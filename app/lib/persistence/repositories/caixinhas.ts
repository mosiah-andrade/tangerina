import type { TangerinaDatabase } from "../database";
import type { Caixinha } from "../entities";
import { criarRepositorio } from "./base";

export function criarRepositorioCaixinhas(db: TangerinaDatabase) {
  return criarRepositorio<Caixinha>(db.caixinhas);
}
