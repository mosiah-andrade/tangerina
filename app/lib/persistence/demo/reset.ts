import type { TangerinaDatabase } from "../database";
import { executarTransacaoPersistencia } from "../transactions";
import { criarDadosDemonstracao } from "./seed";
import { CHAVE_LOADED_AT_DEMO, CHAVE_STATUS_DEMO } from "./state";

export interface ResultadoResetDemonstracao {
  contas: number;
  caixinhas: number;
  movimentos: number;
  efeitosSaldo: number;
  alocacoes: number;
  regrasDistribuicao: number;
  recorrencias: number;
  contasPagar: number;
  metas: number;
}

/**
 * Remove somente os registros pertencentes ao cenário de demonstração.
 *
 * Os IDs são obtidos do conjunto oficial de seed e todas as exclusões,
 * incluindo os metadados de estado, acontecem em uma única transação.
 */
export async function resetarDadosDemonstracao(
  db: TangerinaDatabase,
): Promise<ResultadoResetDemonstracao> {
  const dados = criarDadosDemonstracao();

  return executarTransacaoPersistencia(
    db,
    [
      db.contas,
      db.caixinhas,
      db.movimentos,
      db.efeitosSaldo,
      db.alocacoes,
      db.regrasDistribuicao,
      db.recorrencias,
      db.contasPagar,
      db.metas,
      db.metadados,
    ],
    async () => {
      await db.efeitosSaldo.bulkDelete(dados.efeitosSaldo.map(({ id }) => id));
      await db.alocacoes.bulkDelete(dados.alocacoes.map(({ id }) => id));
      await db.contasPagar.bulkDelete(dados.contasPagar.map(({ id }) => id));
      await db.movimentos.bulkDelete(dados.movimentos.map(({ id }) => id));
      await db.regrasDistribuicao.bulkDelete(
        dados.regrasDistribuicao.map(({ id }) => id),
      );
      await db.recorrencias.bulkDelete(dados.recorrencias.map(({ id }) => id));
      await db.metas.bulkDelete(dados.metas.map(({ id }) => id));
      await db.caixinhas.bulkDelete(dados.caixinhas.map(({ id }) => id));
      await db.contas.bulkDelete(dados.contas.map(({ id }) => id));

      await db.metadados.bulkPut([
        {
          chave: CHAVE_STATUS_DEMO,
          valor: "not_loaded",
        },
      ]);
      await db.metadados.delete(CHAVE_LOADED_AT_DEMO);

      return {
        contas: dados.contas.length,
        caixinhas: dados.caixinhas.length,
        movimentos: dados.movimentos.length,
        efeitosSaldo: dados.efeitosSaldo.length,
        alocacoes: dados.alocacoes.length,
        regrasDistribuicao: dados.regrasDistribuicao.length,
        recorrencias: dados.recorrencias.length,
        contasPagar: dados.contasPagar.length,
        metas: dados.metas.length,
      };
    },
  );
}
