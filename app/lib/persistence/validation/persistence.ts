import type { Table } from "dexie";
import type { TangerinaDatabase } from "../database.ts";
import type { EntityValidatorMap } from "./types.ts";
import {
  validarAlocacao,
  validarAporteMeta,
  validarAuditoria,
  validarCaixinha,
  validarConta,
  validarContaPagar,
  validarEfeitoSaldo,
  validarMetadataRecord,
  validarMeta,
  validarMovimento,
  validarRecorrencia,
  validarRegraDistribuicao,
} from "./validators.ts";
import { lancarSeInvalido, resultadoInvalido } from "./errors.ts";
import { validarReferencias } from "./references.ts";

/**
 * Associação única entre tabelas persistidas e seus validadores estruturais.
 * Mantém a validação de runtime alinhada ao mapa PersistedEntities.
 */
const validadoresEstruturais: EntityValidatorMap = {
  contas: validarConta,
  caixinhas: validarCaixinha,
  movimentos: validarMovimento,
  efeitosSaldo: validarEfeitoSaldo,
  alocacoes: validarAlocacao,
  regrasDistribuicao: validarRegraDistribuicao,
  contasPagar: validarContaPagar,
  recorrencias: validarRecorrencia,
  metas: validarMeta,
  aportesMeta: validarAporteMeta,
  auditorias: validarAuditoria,
  metadados: validarMetadataRecord,
};

/**
 * Retorna a tabela principal e todas as tabelas consultadas pelo validador.
 * A lista é usada para manter as leituras referenciais dentro da transação
 * que executa a gravação.
 */
export function obterTabelasDaValidacao(
  tipo: keyof typeof validadoresEstruturais,
  db: TangerinaDatabase,
): Table[] {
  const tabelasPorTipo: Record<keyof typeof validadoresEstruturais, Table[]> = {
    contas: [db.contas],
    caixinhas: [db.caixinhas],
    movimentos: [db.movimentos, db.contas, db.caixinhas],
    efeitosSaldo: [db.efeitosSaldo, db.movimentos, db.contas, db.caixinhas],
    alocacoes: [
      db.alocacoes,
      db.movimentos,
      db.caixinhas,
      db.regrasDistribuicao,
    ],
    regrasDistribuicao: [db.regrasDistribuicao, db.caixinhas],
    contasPagar: [db.contasPagar, db.recorrencias, db.movimentos],
    recorrencias: [db.recorrencias, db.contas],
    metas: [db.metas, db.caixinhas],
    aportesMeta: [db.aportesMeta, db.metas, db.movimentos],
    auditorias: [
      db.auditorias,
      db.contas,
      db.caixinhas,
      db.movimentos,
      db.efeitosSaldo,
      db.alocacoes,
      db.regrasDistribuicao,
      db.contasPagar,
      db.recorrencias,
      db.metas,
      db.aportesMeta,
    ],
    metadados: [db.metadados],
  };

  return tabelasPorTipo[tipo];
}

/**
 * Valida a estrutura primeiro e as referências depois.
 * A gravação só deve ocorrer quando esta função terminar sem erro.
 */
export async function validarRegistroPersistido(
  tipo: keyof typeof validadoresEstruturais,
  valor: unknown,
  db: TangerinaDatabase,
): Promise<void> {
  const resultadoEstrutural = validadoresEstruturais[tipo](valor);
  lancarSeInvalido(resultadoEstrutural);

  const errosReferenciais = await validarReferencias(tipo, valor, db);
  if (errosReferenciais.length > 0) {
    lancarSeInvalido(resultadoInvalido(errosReferenciais));
  }
}
