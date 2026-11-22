import type { TangerinaDatabase } from "@/lib/persistence/database";
import { calcularSaldoConta } from "@/lib/persistence/contas/saldo";
import { calcularSaldoCaixinhaPorAlocacoes } from "@/lib/persistence/caixinhas/saldo";
import type { Alocacao, Auditoria, EfeitoSaldo, Movimento } from "@/lib/persistence/entities";
import { executarTransacaoPersistencia } from "@/lib/persistence/transactions";

export type ConfirmarDespesaInput = {
  descricao: string;
  categoria: string;
  valorCentavos: number;
  dataMovimento: string;
  contaOrigemId: string;
  caixinhaId?: string;
  idempotencyKey: string;
  confirmarCaixinhaNegativa?: boolean;
};

function formatarMoeda(valorCentavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorCentavos / 100);
}

function validarDataMovimento(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;

  const data = new Date(`${valor}T00:00:00.000Z`);
  return (
    !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === valor
  );
}

function mesmaDespesa(
  existente: Movimento,
  input: ConfirmarDespesaInput,
): boolean {
  return (
    existente.tipo === "despesa" &&
    existente.descricao === input.descricao.trim() &&
    existente.categoria === input.categoria.trim() &&
    existente.valorCentavos === input.valorCentavos &&
    existente.dataMovimento === input.dataMovimento &&
    existente.contaOrigemId === input.contaOrigemId &&
    existente.caixinhaId === (input.caixinhaId || undefined)
  );
}

export async function confirmarDespesa(
  db: TangerinaDatabase,
  input: ConfirmarDespesaInput,
): Promise<{ movimentoId: string }> {
  if (!input.descricao.trim()) {
    throw new Error("A descrição da despesa é obrigatória.");
  }
  if (!input.categoria.trim()) {
    throw new Error("A categoria da despesa é obrigatória.");
  }
  if (!Number.isSafeInteger(input.valorCentavos) || input.valorCentavos <= 0) {
    throw new Error("O valor da despesa deve ser maior que zero e estar em centavos inteiros.");
  }
  if (!validarDataMovimento(input.dataMovimento)) {
    throw new Error("A data da despesa é inválida.");
  }
  if (!input.contaOrigemId) {
    throw new Error("A origem do pagamento é obrigatória.");
  }
  if (!input.idempotencyKey.trim()) {
    throw new Error("A chave de confirmação da despesa é obrigatória.");
  }
  if (input.caixinhaId !== undefined && !input.caixinhaId) {
    throw new Error("A caixinha selecionada é inválida.");
  }

  const agora = new Date().toISOString();

  const movimentoId = await executarTransacaoPersistencia(
    db,
    [
      db.movimentos,
      db.alocacoes,
      db.efeitosSaldo,
      db.auditorias,
      db.caixinhas,
      db.contas,
    ],
    async () => {
      const existente = await db.movimentos
        .where("idempotencyKey")
        .equals(input.idempotencyKey)
        .first();

      if (existente) {
        if (!mesmaDespesa(existente, input)) {
          throw new Error(
            "Esta chave de confirmação já foi utilizada em outra despesa. Reabra o formulário para iniciar uma nova operação.",
          );
        }
        return existente.id;
      }

      const conta = await db.contas.get(input.contaOrigemId);
      if (!conta || !conta.ativa) {
        throw new Error("A origem do pagamento não está disponível.");
      }

      const efeitosDaConta = await db.efeitosSaldo
        .where("alvoId")
        .equals(conta.id)
        .toArray();
      const saldoDisponivelCentavos = calcularSaldoConta(conta, efeitosDaConta);

      if (input.valorCentavos > saldoDisponivelCentavos) {
        const faltaCentavos = input.valorCentavos - saldoDisponivelCentavos;
        const tipoOrigem =
          conta.tipo === "carteira_fisica" ? "carteira física" : "conta bancária";

        throw new Error(
          `Saldo insuficiente na ${tipoOrigem} "${conta.nome}". Despesa: ${formatarMoeda(input.valorCentavos)}. Saldo disponível: ${formatarMoeda(saldoDisponivelCentavos)}. Faltam: ${formatarMoeda(faltaCentavos)}.`,
        );
      }

      const caixinha = input.caixinhaId
        ? await db.caixinhas.get(input.caixinhaId)
        : undefined;

      if (input.caixinhaId && !caixinha) {
        throw new Error("A caixinha de origem não foi encontrada.");
      }
      if (caixinha && !caixinha.ativa) {
        throw new Error(
          `A caixinha "${caixinha.nome}" está arquivada e não pode registrar uma despesa.`,
        );
      }

      if (caixinha) {
        const alocacoesDaCaixinha = await db.alocacoes
          .where("caixinhaId")
          .equals(caixinha.id)
          .toArray();
        const saldoAtualCaixinha = calcularSaldoCaixinhaPorAlocacoes(
          caixinha,
          alocacoesDaCaixinha,
        );
        const saldoProjetadoCaixinha =
          saldoAtualCaixinha - input.valorCentavos;

        if (
          saldoProjetadoCaixinha < 0 &&
          !input.confirmarCaixinhaNegativa
        ) {
          throw new Error(
            `A despesa deixará a caixinha "${caixinha.nome}" negativa. Saldo atual: ${formatarMoeda(saldoAtualCaixinha)}. Saldo após a despesa: ${formatarMoeda(saldoProjetadoCaixinha)}. É necessária confirmação explícita para continuar.`,
          );
        }
      }

      const novoMovimentoId = crypto.randomUUID();
      const movimento: Movimento = {
        id: novoMovimentoId,
        createdAt: agora,
        updatedAt: agora,
        tipo: "despesa",
        status: "confirmado",
        descricao: input.descricao.trim(),
        categoria: input.categoria.trim(),
        valorCentavos: input.valorCentavos,
        dataMovimento: input.dataMovimento,
        contaOrigemId: input.contaOrigemId,
        caixinhaId: input.caixinhaId,
        idempotencyKey: input.idempotencyKey,
        confirmedAt: agora,
      };

      const alocacao: Alocacao | undefined = input.caixinhaId
        ? {
            id: crypto.randomUUID(),
            createdAt: agora,
            movimentoId: novoMovimentoId,
            caixinhaId: input.caixinhaId,
            tipo: "debito_despesa",
            valorCentavos: input.valorCentavos,
          }
        : undefined;

      const efeitos: EfeitoSaldo[] = [
        {
          id: crypto.randomUUID(),
          createdAt: agora,
          movimentoId: novoMovimentoId,
          tipoAlvo: "conta",
          alvoId: input.contaOrigemId,
          valorCentavosAssinado: -input.valorCentavos,
          estado: "ativo",
        },
        ...(input.caixinhaId
          ? [
              {
                id: crypto.randomUUID(),
                createdAt: agora,
                movimentoId: novoMovimentoId,
                tipoAlvo: "caixinha" as const,
                alvoId: input.caixinhaId,
                valorCentavosAssinado: -input.valorCentavos,
                estado: "ativo" as const,
              },
            ]
          : []),
      ];

      await db.movimentos.add(movimento);
      if (alocacao) await db.alocacoes.add(alocacao);
      await db.efeitosSaldo.bulkAdd(efeitos);

      const auditoria: Auditoria = {
        id: crypto.randomUUID(),
        createdAt: agora,
        entidadeTipo: "movimentos",
        entidadeId: novoMovimentoId,
        acao: "criado",
        depois: {
          tipo: movimento.tipo,
          status: movimento.status,
          descricao: movimento.descricao,
          categoria: movimento.categoria ?? null,
          valorCentavos: movimento.valorCentavos,
          dataMovimento: movimento.dataMovimento,
          contaOrigemId: movimento.contaOrigemId ?? null,
          caixinhaId: movimento.caixinhaId ?? null,
        },
      };
      await db.auditorias.add(auditoria);

      return novoMovimentoId;
    },
  );

  return { movimentoId };
}
