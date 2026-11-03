import type { TangerinaDatabase } from "../database.ts";
import type { Auditoria } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioAuditorias(db: TangerinaDatabase) {
  return criarRepositorio<Auditoria>(db.auditorias, "auditorias", db);
}
