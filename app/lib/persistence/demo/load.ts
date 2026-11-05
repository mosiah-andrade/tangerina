import type { TangerinaDatabase } from "../database.ts";
import { executarTransacaoPersistencia } from "../transactions.ts";
import type { DadosDemonstracao } from "./seed.ts";
import { criarDadosDemonstracao } from "./seed.ts";

const CHAVE_STATUS_DEMO = "demo.status";
const CHAVE_LOADED_AT_DEMO = "demo.loadedAt";

export interface ResultadoCargaDemonstracao {
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
 * Grava um cenário completo de demonstração em uma única transação.
 *
 * Se qualquer gravação falhar, nenhuma alteração da carga é confirmada.
 * Os dados usam bulkAdd, portanto IDs duplicados são tratados como erro
 * em vez de sobrescrever registros existentes.
 */
export async function carregarDadosDemonstracao(
  db: TangerinaDatabase,
  dados: DadosDemonstracao = criarDadosDemonstracao(),
): Promise<ResultadoCargaDemonstracao> {
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
      await db.contas.bulkAdd(dados.contas);
      await db.caixinhas.bulkAdd(dados.caixinhas);
      await db.regrasDistribuicao.bulkAdd(dados.regrasDistribuicao);
      await db.movimentos.bulkAdd(dados.movimentos);
      await db.efeitosSaldo.bulkAdd(dados.efeitosSaldo);
      await db.alocacoes.bulkAdd(dados.alocacoes);
      await db.recorrencias.bulkAdd(dados.recorrencias);
      await db.contasPagar.bulkAdd(dados.contasPagar);
      await db.metas.bulkAdd(dados.metas);

      const loadedAt = new Date().toISOString();

      await db.metadados.bulkPut([
        {
          chave: CHAVE_STATUS_DEMO,
          valor: "loaded",
        },
        {
          chave: CHAVE_LOADED_AT_DEMO,
          valor: loadedAt,
        },
      ]);

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
