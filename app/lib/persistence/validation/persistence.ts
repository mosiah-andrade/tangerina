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
