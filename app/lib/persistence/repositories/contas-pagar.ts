import type { TangerinaDatabase } from "../database";
import type { ContaPagar } from "../entities";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioContasPagar(db: TangerinaDatabase) {
  return criarRepositorio<ContaPagar>(db.contasPagar);
}
