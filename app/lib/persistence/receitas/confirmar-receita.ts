import type { TangerinaDatabase } from "@/lib/persistence/database";
import type { Alocacao, Auditoria, EfeitoSaldo, Movimento } from "@/lib/persistence/entities";
import { executarTransacaoPersistencia } from "@/lib/persistence/transactions";

export type ConfirmarReceitaInput = {
  descricao: string;
  valorCentavos: number;
  dataMovimento: string;
  alocacoes: Array<{ caixinhaId: string; valorCentavos: number; regraDistribuicaoId?: string }>;
  idempotencyKey: string;
};

export async function confirmarReceita(
  db: TangerinaDatabase,
  input: ConfirmarReceitaInput,
): Promise<{ movimentoId: string }> {
  if (!input.descricao.trim()) throw new Error("A descrição da receita é obrigatória.");
  if (!Number.isInteger(input.valorCentavos) || input.valorCentavos <= 0) throw new Error("O valor da receita deve ser maior que zero.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dataMovimento)) throw new Error("A data da receita é inválida.");

  const totalAlocado = input.alocacoes.reduce((total, item) => {
    if (!Number.isInteger(item.valorCentavos) || item.valorCentavos < 0) throw new Error("Uma alocação possui valor inválido.");
    return total + item.valorCentavos;
  }, 0);
  if (totalAlocado > input.valorCentavos) throw new Error("A distribuição não pode exceder o valor da receita.");

  const existente = await db.movimentos.where("idempotencyKey").equals(input.idempotencyKey).first();
  if (existente) return { movimentoId: existente.id };

  const ids = new Set<string>();
  for (const item of input.alocacoes) {
    if (item.valorCentavos === 0) continue;
    if (ids.has(item.caixinhaId)) throw new Error("Cada caixinha deve aparecer apenas uma vez na distribuição.");
    ids.add(item.caixinhaId);
  }

  const agora = new Date().toISOString();
  const movimentoId = crypto.randomUUID();

  await executarTransacaoPersistencia(
    db,
    [db.movimentos, db.alocacoes, db.efeitosSaldo, db.auditorias, db.caixinhas],
    async () => {
      for (const item of input.alocacoes) {
        if (item.valorCentavos === 0) continue;
        const caixinha = await db.caixinhas.get(item.caixinhaId);
        if (!caixinha || !caixinha.ativa) throw new Error("Uma caixinha selecionada não está disponível.");
      }

      const movimento: Movimento = {
        id: movimentoId,
        createdAt: agora,
        updatedAt: agora,
        tipo: "receita",
        status: "confirmado",
        descricao: input.descricao.trim(),
        valorCentavos: input.valorCentavos,
        dataMovimento: input.dataMovimento,
        idempotencyKey: input.idempotencyKey,
        confirmedAt: agora,
      };

      await db.movimentos.add(movimento);

      const efeitos: EfeitoSaldo[] = [];
      const alocacoes: Alocacao[] = [];
      for (const item of input.alocacoes) {
        if (item.valorCentavos === 0) continue;
        const alocacao: Alocacao = {
          id: crypto.randomUUID(),
          createdAt: agora,
          movimentoId,
          caixinhaId: item.caixinhaId,
          tipo: "credito_receita",
          valorCentavos: item.valorCentavos,
          regraDistribuicaoId: item.regraDistribuicaoId,
        };
        alocacoes.push(alocacao);
        efeitos.push({
          id: crypto.randomUUID(),
          createdAt: agora,
          movimentoId,
          tipoAlvo: "caixinha",
          alvoId: item.caixinhaId,
          valorCentavosAssinado: item.valorCentavos,
          estado: "ativo",
        });
      }

      if (alocacoes.length) await db.alocacoes.bulkAdd(alocacoes);
      if (efeitos.length) await db.efeitosSaldo.bulkAdd(efeitos);

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
          totalAlocadoCentavos: totalAlocado,
        },
      };
      await db.auditorias.add(auditoria);
    },
  );

  return { movimentoId };
}
