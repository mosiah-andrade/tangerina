import type { TangerinaDatabase } from "../database";
import type { Conta } from "../entities";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioContas(db: TangerinaDatabase) {
  return criarRepositorio<Conta>(db.contas);
}
