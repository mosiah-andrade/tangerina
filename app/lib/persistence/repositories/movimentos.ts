import type { TangerinaDatabase } from "../database";
import type { Movimento } from "../entities";
import { criarRepositorio } from "./base";

export function criarRepositorioMovimentos(db: TangerinaDatabase) {
  return criarRepositorio<Movimento>(db.movimentos);
}
