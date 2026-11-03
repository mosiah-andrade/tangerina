import { criarErro } from "./errors.ts";
import type { ValidationIssue } from "./types.ts";
import type { TangerinaDatabase } from "../database.ts";
import type { PersistedEntities, TipoEntidadeAuditoria } from "../entities.ts";

type TipoTabela = keyof PersistedEntities;
type Registro = Record<string, unknown>;

const tabelasAuditoria: Record<TipoEntidadeAuditoria, TipoTabela> = {
  contas: "contas",
  caixinhas: "caixinhas",
  movimentos: "movimentos",
  efeitosSaldo: "efeitosSaldo",
  alocacoes: "alocacoes",
  regrasDistribuicao: "regrasDistribuicao",
  contasPagar: "contasPagar",
  recorrencias: "recorrencias",
  metas: "metas",
  aportesMeta: "aportesMeta",
};

function ehRegistro(valor: unknown): valor is Registro {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function adicionarReferenciaAusente(
  erros: ValidationIssue[],
  campo: string,
  id: string,
): void {
  erros.push(
    criarErro(
      campo,
      "REFERENCE_NOT_FOUND",
      `Não existe registro relacionado com o identificador "${id}".`,
    ),
  );
}

async function verificarReferencia(
  erros: ValidationIssue[],
  campo: string,
  id: unknown,
  buscar: (id: string) => Promise<unknown>,
): Promise<unknown> {
  // A validação estrutural é responsável por rejeitar IDs que não sejam strings/UUIDs.
  if (id === undefined || typeof id !== "string") return undefined;

  const relacionado = await buscar(id);
  if (relacionado === undefined) adicionarReferenciaAusente(erros, campo, id);
  return relacionado;
}

/**
 * Verifica se os relacionamentos de um registro apontam para registros existentes.
 * Não substitui a validação estrutural: IDs com formato inválido são tratados por ela.
 */
export async function validarReferencias(
  tipo: TipoTabela,
  valor: unknown,
  db: TangerinaDatabase,
): Promise<ValidationIssue[]> {
  if (!ehRegistro(valor)) return [];

  const erros: ValidationIssue[] = [];

  switch (tipo) {
    case "movimentos":
      await verificarReferencia(erros, "contaOrigemId", valor.contaOrigemId, (id) => db.contas.get(id));
      await verificarReferencia(erros, "contaDestinoId", valor.contaDestinoId, (id) => db.contas.get(id));
      await verificarReferencia(erros, "caixinhaId", valor.caixinhaId, (id) => db.caixinhas.get(id));
      break;

    case "efeitosSaldo": {
      await verificarReferencia(erros, "movimentoId", valor.movimentoId, (id) => db.movimentos.get(id));
      if (valor.tipoAlvo === "conta") {
        await verificarReferencia(erros, "alvoId", valor.alvoId, (id) => db.contas.get(id));
      } else if (valor.tipoAlvo === "caixinha") {
        await verificarReferencia(erros, "alvoId", valor.alvoId, (id) => db.caixinhas.get(id));
      } else if (valor.alvoId !== undefined) {
        erros.push(criarErro("tipoAlvo", "REFERENCE_TYPE_MISMATCH", "O tipo do alvo deve ser 'conta' ou 'caixinha' para validar sua referência."));
      }
      break;
    }

    case "alocacoes": {
      await verificarReferencia(erros, "movimentoId", valor.movimentoId, (id) => db.movimentos.get(id));
      await verificarReferencia(erros, "caixinhaId", valor.caixinhaId, (id) => db.caixinhas.get(id));
      const regra = await verificarReferencia(erros, "regraDistribuicaoId", valor.regraDistribuicaoId, (id) => db.regrasDistribuicao.get(id));
      if (regra && ehRegistro(regra) && typeof valor.caixinhaId === "string" && regra.caixinhaId !== valor.caixinhaId) {
        erros.push(criarErro("regraDistribuicaoId", "REFERENCE_INCONSISTENT", "A regra de distribuição deve pertencer à mesma caixinha da alocação."));
      }
      break;
    }

    case "regrasDistribuicao":
      await verificarReferencia(erros, "caixinhaId", valor.caixinhaId, (id) => db.caixinhas.get(id));
      break;

    case "recorrencias":
      await verificarReferencia(erros, "contaId", valor.contaId, (id) => db.contas.get(id));
      break;

    case "contasPagar":
      await verificarReferencia(erros, "recorrenciaId", valor.recorrenciaId, (id) => db.recorrencias.get(id));
      await verificarReferencia(erros, "movimentoPagamentoId", valor.movimentoPagamentoId, (id) => db.movimentos.get(id));
      break;

    case "metas":
      await verificarReferencia(erros, "caixinhaId", valor.caixinhaId, (id) => db.caixinhas.get(id));
      break;

    case "aportesMeta":
      await verificarReferencia(erros, "metaId", valor.metaId, (id) => db.metas.get(id));
      await verificarReferencia(erros, "movimentoId", valor.movimentoId, (id) => db.movimentos.get(id));
      break;

    case "auditorias": {
      const tipoEntidade = valor.entidadeTipo;
      if (typeof tipoEntidade !== "string" || !(tipoEntidade in tabelasAuditoria)) {
        if (valor.entidadeTipo !== undefined) {
          erros.push(criarErro("entidadeTipo", "REFERENCE_TYPE_MISMATCH", "O tipo de entidade da auditoria não possui uma tabela de referência válida."));
        }
        break;
      }

      const tabela = tabelasAuditoria[tipoEntidade as TipoEntidadeAuditoria];
      const buscar = async (id: string): Promise<unknown> => {
        switch (tabela) {
          case "contas": return db.contas.get(id);
          case "caixinhas": return db.caixinhas.get(id);
          case "movimentos": return db.movimentos.get(id);
          case "efeitosSaldo": return db.efeitosSaldo.get(id);
          case "alocacoes": return db.alocacoes.get(id);
          case "regrasDistribuicao": return db.regrasDistribuicao.get(id);
          case "contasPagar": return db.contasPagar.get(id);
          case "recorrencias": return db.recorrencias.get(id);
          case "metas": return db.metas.get(id);
          case "aportesMeta": return db.aportesMeta.get(id);
          default: return undefined;
        }
      };
      await verificarReferencia(erros, "entidadeId", valor.entidadeId, buscar);
      break;
    }

    case "contas":
    case "caixinhas":
    case "metadados":
      break;
  }

  return erros;
}
