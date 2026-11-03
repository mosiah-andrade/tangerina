import type { TangerinaDatabase } from "../database.ts";
import type { Meta } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioMetas(db: TangerinaDatabase) {
  return criarRepositorio<Meta>(db.metas, "metas", db);
}
