import type { TangerinaDatabase } from "../database.ts";
import type { Recorrencia } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioRecorrencias(db: TangerinaDatabase) {
  return criarRepositorio<Recorrencia>(db.recorrencias, "recorrencias", db);
}
