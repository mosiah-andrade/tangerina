import type { TangerinaDatabase } from "../database";
import type { Recorrencia } from "../entities";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioRecorrencias(db: TangerinaDatabase) {
  return criarRepositorio<Recorrencia>(db.recorrencias);
}
