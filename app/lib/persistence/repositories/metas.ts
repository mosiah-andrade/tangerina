import type { TangerinaDatabase } from "../database";
import type { Meta } from "../entities";
import { criarRepositorio } from "./base";

export function criarRepositorioMetas(db: TangerinaDatabase) {
  return criarRepositorio<Meta>(db.metas);
}
