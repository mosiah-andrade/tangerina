import type { Table } from "dexie";
import type { TangerinaDatabase } from "./database.ts";

/**
 * Executa uma operação de escrita em uma única transação Dexie.
 *
 * Todas as tabelas lidas ou escritas pela operação precisam ser declaradas
 * antes da execução. Erros são propagados para que o Dexie reverta a transação.
 */
export async function executarTransacaoPersistencia<T>(
  db: TangerinaDatabase,
  tabelas: Table[],
  operacao: () => Promise<T>,
): Promise<T> {
  if (tabelas.length === 0) {
    throw new Error("Uma transação de persistência exige ao menos uma tabela.");
  }

  const tabelasUnicas = [...new Set(tabelas)];

  return db.transaction("rw", ...tabelasUnicas, operacao);
}
