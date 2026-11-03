import type { TangerinaDatabase } from "../database";
import type { Meta } from "../entities";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioMetas(db: TangerinaDatabase) {
  return criarRepositorio<Meta>(db.metas);
}
