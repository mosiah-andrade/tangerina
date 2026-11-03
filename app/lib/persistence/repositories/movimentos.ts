import type { TangerinaDatabase } from "../database.ts";
import type { Movimento } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioMovimentos(db: TangerinaDatabase) {
  return criarRepositorio<Movimento>(db.movimentos, "movimentos", db);
}
