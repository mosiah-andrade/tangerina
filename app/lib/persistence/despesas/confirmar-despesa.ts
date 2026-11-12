import type { TangerinaDatabase } from "@/lib/persistence/database";
import type { Alocacao, Auditoria, EfeitoSaldo, Movimento } from "@/lib/persistence/entities";
import { executarTransacaoPersistencia } from "@/lib/persistence/transactions";

export type ConfirmarDespesaInput = {
  descricao: string;
  categoria: string;
  valorCentavos: number;
  dataMovimento: string;
  contaOrigemId: string;
  caixinhaId: string;
  idempotencyKey: string;
};

export async function confirmarDespesa(
  db: TangerinaDatabase,
  input: ConfirmarDespesaInput,
): Promise<{ movimentoId: string }> {
  if (!input.descricao.trim()) throw new Error("A descrição da despesa é obrigatória.");
  if (!input.categoria.trim()) throw new Error("A categoria da despesa é obrigatória.");
  if (!Number.isInteger(input.valorCentavos) || input.valorCentavos <= 0) throw new Error("O valor da despesa deve ser maior que zero.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dataMovimento)) throw new Error("A data da despesa é inválida.");
  if (!input.contaOrigemId) throw new Error("A conta bancária de origem é obrigatória.");
  if (!input.caixinhaId) throw new Error("A caixinha de origem é obrigatória.");

  const existente = await db.movimentos.where("idempotencyKey").equals(input.idempotencyKey).first();
  if (existente) return { movimentoId: existente.id };

  const agora = new Date().toISOString();
  const movimentoId = crypto.randomUUID();

  await executarTransacaoPersistencia(
    db,
    [db.movimentos, db.alocacoes, db.efeitosSaldo, db.auditorias, db.caixinhas, db.contas],
    async () => {
      const conta = await db.contas.get(input.contaOrigemId);
      if (!conta || !conta.ativa || conta.tipo !== "bancaria") throw new Error("A conta bancária de origem não está disponível.");

      const caixinha = await db.caixinhas.get(input.caixinhaId);
      if (!caixinha) throw new Error("A caixinha de origem não foi encontrada.");
      if (!caixinha.ativa) throw new Error(`A caixinha "${caixinha.nome}" está arquivada e não pode registrar uma despesa.`);

      const movimento: Movimento = {
        id: movimentoId,
        createdAt: agora,
        updatedAt: agora,
        tipo: "despesa",
        status: "confirmado",
        descricao: input.descricao.trim(),
        valorCentavos: input.valorCentavos,
        dataMovimento: input.dataMovimento,
        contaOrigemId: input.contaOrigemId,
        caixinhaId: input.caixinhaId,
        idempotencyKey: input.idempotencyKey,
        confirmedAt: agora,
      };

      const alocacao: Alocacao = {
        id: crypto.randomUUID(),
        createdAt: agora,
        movimentoId,
        caixinhaId: input.caixinhaId,
        tipo: "debito_despesa",
        valorCentavos: input.valorCentavos,
      };

      const efeitos: EfeitoSaldo[] = [
        { id: crypto.randomUUID(), createdAt: agora, movimentoId, tipoAlvo: "conta", alvoId: input.contaOrigemId, valorCentavosAssinado: -input.valorCentavos, estado: "ativo" },
        { id: crypto.randomUUID(), createdAt: agora, movimentoId, tipoAlvo: "caixinha", alvoId: input.caixinhaId, valorCentavosAssinado: -input.valorCentavos, estado: "ativo" },
      ];

      await db.movimentos.add(movimento);
      await db.alocacoes.add(alocacao);
      await db.efeitosSaldo.bulkAdd(efeitos);

      const auditoria: Auditoria = {
        id: crypto.randomUUID(),
        createdAt: agora,
        entidadeTipo: "movimentos",
        entidadeId: movimentoId,
        acao: "criado",
        depois: {
          tipo: movimento.tipo,
          status: movimento.status,
          descricao: movimento.descricao,
          categoria: input.categoria.trim(),
          valorCentavos: movimento.valorCentavos,
          dataMovimento: movimento.dataMovimento,
          contaOrigemId: movimento.contaOrigemId ?? null,
          caixinhaId: movimento.caixinhaId ?? null,
        },
      };
      await db.auditorias.add(auditoria);
    },
  );

  return { movimentoId };
}
