import type { TangerinaDatabase } from "../database.ts";
import type { ContaPagar } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioContasPagar(db: TangerinaDatabase) {
  return criarRepositorio<ContaPagar>(db.contasPagar, "contasPagar", db);
}
