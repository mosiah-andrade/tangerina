import type { TangerinaDatabase } from "../database.ts";
import type { Caixinha } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioCaixinhas(db: TangerinaDatabase) {
  return criarRepositorio<Caixinha>(db.caixinhas, "caixinhas", db);
}
