import type { TangerinaDatabase } from "../database.ts";
import { calcularSaldoCaixinhaPorAlocacoes } from "./saldo.ts";
import type { Alocacao, Auditoria, Movimento } from "../entities.ts";
import { executarTransacaoPersistencia } from "../transactions.ts";

export interface TransferirEntreCaixinhasInput {
  caixinhaOrigemId: string;
  caixinhaDestinoId: string;
  valorCentavos: number;
  dataMovimento: string;
  idempotencyKey: string;
  descricao?: string;
}

export interface TransferirEntreCaixinhasResult {
  movimentoId: string;
  origemAlocacaoId: string;
  destinoAlocacaoId: string;
}

function validarDataISO(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const parsed = new Date(`${data}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === data;
}

function mesmaTransferencia(
  existente: Movimento,
  input: TransferirEntreCaixinhasInput,
): boolean {
  return (
    existente.tipo === "transferencia_caixinhas" &&
    existente.valorCentavos === input.valorCentavos &&
    existente.dataMovimento === input.dataMovimento &&
    existente.descricao === (input.descricao?.trim() || "Transferência entre caixinhas")
  );
}

/**
 * Registra uma transferência entre duas caixinhas.
 *
 * A operação cria um movimento e duas alocações vinculadas a ele:
 * uma saída na origem e uma entrada no destino. Como o saldo das caixinhas
 * é calculado pelo livro de alocações, não são criados efeitos de conta
 * nem alterações no saldo bancário consolidado.
 */
export async function transferirEntreCaixinhas(
  db: TangerinaDatabase,
  input: TransferirEntreCaixinhasInput,
): Promise<TransferirEntreCaixinhasResult> {
  if (!input.caixinhaOrigemId || !input.caixinhaDestinoId) {
    throw new Error("Selecione as caixinhas de origem e destino.");
  }
  if (input.caixinhaOrigemId === input.caixinhaDestinoId) {
    throw new Error("A caixinha de origem deve ser diferente da caixinha de destino.");
  }
  if (!Number.isSafeInteger(input.valorCentavos) || input.valorCentavos <= 0) {
    throw new Error("O valor da transferência deve ser maior que zero e estar em centavos inteiros.");
  }
  if (!validarDataISO(input.dataMovimento)) {
    throw new Error("A data da transferência é inválida.");
  }
  if (!input.idempotencyKey.trim()) {
    throw new Error("A chave de idempotência da transferência é obrigatória.");
  }

  const agora = new Date().toISOString();
  const descricao = input.descricao?.trim() || "Transferência entre caixinhas";

  return executarTransacaoPersistencia(
    db,
    [db.caixinhas, db.movimentos, db.alocacoes, db.auditorias],
    async () => {
      const existente = await db.movimentos
        .where("idempotencyKey")
        .equals(input.idempotencyKey)
        .first();

      if (existente) {
        if (!mesmaTransferencia(existente, { ...input, descricao })) {
          throw new Error("Esta chave de idempotência já foi utilizada em outra operação.");
        }

        const alocacoes = await db.alocacoes
          .where("movimentoId")
          .equals(existente.id)
          .toArray();
        const saida = alocacoes.find(
          (item) => item.tipo === "transferencia_saida" && item.caixinhaId === input.caixinhaOrigemId,
        );
        const entrada = alocacoes.find(
          (item) => item.tipo === "transferencia_entrada" && item.caixinhaId === input.caixinhaDestinoId,
        );

        if (
          !saida ||
          !entrada ||
          saida.valorCentavos !== input.valorCentavos ||
          entrada.valorCentavos !== input.valorCentavos
        ) {
          throw new Error("A transferência existente está incompleta ou diverge dos dados enviados.");
        }

        return {
          movimentoId: existente.id,
          origemAlocacaoId: saida.id,
          destinoAlocacaoId: entrada.id,
        };
      }

      const origem = await db.caixinhas.get(input.caixinhaOrigemId);
      const destino = await db.caixinhas.get(input.caixinhaDestinoId);

      if (!origem || !origem.ativa) {
        throw new Error("A caixinha de origem não está disponível.");
      }
      if (!destino || !destino.ativa) {
        throw new Error("A caixinha de destino não está disponível.");
      }

      const alocacoesOrigem = await db.alocacoes
        .where("caixinhaId")
        .equals(origem.id)
        .toArray();
      const saldoOrigem = calcularSaldoCaixinhaPorAlocacoes(origem, alocacoesOrigem);

      if (saldoOrigem <= 0) {
        throw new Error("A caixinha de origem precisa ter saldo positivo para realizar uma transferência.");
      }
      if (input.valorCentavos > saldoOrigem) {
        throw new Error("O valor da transferência não pode exceder o saldo disponível da caixinha de origem.");
      }

      const movimentoId = crypto.randomUUID();
      const origemAlocacaoId = crypto.randomUUID();
      const destinoAlocacaoId = crypto.randomUUID();

      const movimento: Movimento = {
        id: movimentoId,
        createdAt: agora,
        updatedAt: agora,
        tipo: "transferencia_caixinhas",
        status: "confirmado",
        descricao,
        valorCentavos: input.valorCentavos,
        dataMovimento: input.dataMovimento,
        idempotencyKey: input.idempotencyKey,
        confirmedAt: agora,
      };

      const alocacoes: Alocacao[] = [
        {
          id: origemAlocacaoId,
          createdAt: agora,
          movimentoId,
          caixinhaId: origem.id,
          tipo: "transferencia_saida",
          valorCentavos: input.valorCentavos,
        },
        {
          id: destinoAlocacaoId,
          createdAt: agora,
          movimentoId,
          caixinhaId: destino.id,
          tipo: "transferencia_entrada",
          valorCentavos: input.valorCentavos,
        },
      ];

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
          valorCentavos: movimento.valorCentavos,
          dataMovimento: movimento.dataMovimento,
          caixinhaOrigemId: origem.id,
          caixinhaDestinoId: destino.id,
          alocacoes: alocacoes.map((item) => ({
            caixinhaId: item.caixinhaId,
            tipo: item.tipo,
            valorCentavos: item.valorCentavos,
          })),
        },
      };

      await db.movimentos.add(movimento);
      await db.alocacoes.bulkAdd(alocacoes);
      await db.auditorias.add(auditoria);

      return { movimentoId, origemAlocacaoId, destinoAlocacaoId };
    },
  );
}
