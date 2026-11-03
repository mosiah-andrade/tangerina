import type { TangerinaDatabase } from "../database";
import type { Auditoria } from "../entities";
import { criarRepositorio } from "./base";

export function criarRepositorioAuditorias(db: TangerinaDatabase) {
  return criarRepositorio<Auditoria>(db.auditorias);
}
