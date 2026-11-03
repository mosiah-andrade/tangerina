import type { Table } from "dexie";
import type { Id } from "../entities";

export type Atualizacao<T> = Partial<
  Omit<T, "id" | "createdAt" | "updatedAt">
>;

export interface Repositorio<T extends { id: Id }> {
  buscarPorId(id: Id): Promise<T | undefined>;
  listar(): Promise<T[]>;
  inserir(registro: T): Promise<Id>;
  atualizar(id: Id, alteracoes: Atualizacao<T>): Promise<boolean>;
  arquivar(id: Id): Promise<boolean>;
}

/**
 * Cria operações CRUD tipadas para tabelas cuja chave primária é id.
 *
 * A remoção física não é exposta: registros financeiros e históricos devem
 * ser cancelados, revertidos ou arquivados conforme o domínio.
 */
export function criarRepositorio<T extends { id: Id }>(
  tabela: Table<T, Id>,
): Repositorio<T> {
  return {
    buscarPorId(id) {
      return tabela.get(id);
    },

    listar() {
      return tabela.toArray();
    },

    inserir(registro) {
      return tabela.add(registro);
    },

    async atualizar(id, alteracoes) {
      const registro = await tabela.get(id);
      if (!registro) return false;

      const atualizacao: Record<string, unknown> = {
        ...alteracoes,
      };

      if ("updatedAt" in registro) {
        atualizacao.updatedAt = new Date().toISOString();
      }

      const quantidade = await tabela.update(
        id,
        atualizacao as Partial<T>,
      );

      return quantidade > 0;
    },

    async arquivar(id) {
      const registro = await tabela.get(id);
      if (!registro) return false;

      if (!("ativa" in registro) || typeof registro.ativa !== "boolean") {
        throw new Error(
          "Esta entidade não possui arquivamento pelo campo 'ativa'.",
        );
      }

      const quantidade = await tabela.update(id, {
        ativa: false,
        ...("updatedAt" in registro
          ? { updatedAt: new Date().toISOString() }
          : {}),
      } as Partial<T>);

      return quantidade > 0;
    },
  };
}
