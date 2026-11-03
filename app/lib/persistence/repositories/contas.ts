import type { TangerinaDatabase } from "../database.ts";
import type { Conta } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioContas(db: TangerinaDatabase) {
  return criarRepositorio<Conta>(db.contas, "contas", db);
}
