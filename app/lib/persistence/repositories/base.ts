import type { Table } from "dexie";
import type { Id, PersistedEntities } from "../entities.ts";
import type { TangerinaDatabase } from "../database.ts";
import { validarRegistroPersistido } from "../validation/persistence.ts";

export type Atualizacao<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

export interface Repositorio<T extends { id: Id }> {
  buscarPorId(id: Id): Promise<T | undefined>;
  listar(): Promise<T[]>;
  inserir(registro: T): Promise<Id>;
  atualizar(id: Id, alteracoes: Atualizacao<T>): Promise<boolean>;
  arquivar(id: Id): Promise<boolean>;
}

type TipoEntidadeComId = Exclude<keyof PersistedEntities, "metadados">;

/**
 * Cria operações CRUD tipadas e garante validação estrutural e referencial
 * antes de inserir, atualizar ou arquivar registros.
 *
 * A remoção física não é exposta: registros financeiros e históricos devem
 * ser cancelados, revertidos ou arquivados conforme o domínio.
 */
export function criarRepositorio<T extends { id: Id }>(
  tabela: Table<T, Id>,
  tipo: TipoEntidadeComId,
  db: TangerinaDatabase,
): Repositorio<T> {
  return {
    buscarPorId(id) {
      return tabela.get(id);
    },

    listar() {
      return tabela.toArray();
    },

    async inserir(registro) {
      await validarRegistroPersistido(tipo, registro, db);
      return tabela.add(registro);
    },

    async atualizar(id, alteracoes) {
      const registro = await tabela.get(id);
      if (!registro) return false;

      const atualizado = {
        ...registro,
        ...alteracoes,
        id: registro.id,
        ...("createdAt" in registro ? { createdAt: registro.createdAt } : {}),
        ...("updatedAt" in registro
          ? { updatedAt: new Date().toISOString() }
          : {}),
      } as T;

      await validarRegistroPersistido(tipo, atualizado, db);
      await tabela.put(atualizado);
      return true;
    },

    async arquivar(id) {
      const registro = await tabela.get(id);
      if (!registro) return false;

      if (!("ativa" in registro) || typeof registro.ativa !== "boolean") {
        throw new Error(
          "Esta entidade não possui arquivamento pelo campo 'ativa'.",
        );
      }

      const atualizado = {
        ...registro,
        ativa: false,
        ...("updatedAt" in registro
          ? { updatedAt: new Date().toISOString() }
          : {}),
      } as T;

      await validarRegistroPersistido(tipo, atualizado, db);
      await tabela.put(atualizado);
      return true;
    },
  };
}
