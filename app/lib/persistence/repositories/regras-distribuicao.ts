import type { TangerinaDatabase } from "../database";
import type { RegraDistribuicao } from "../entities";
import { criarRepositorio } from "./base";

export function criarRepositorioRegrasDistribuicao(db: TangerinaDatabase) {
  return criarRepositorio<RegraDistribuicao>(db.regrasDistribuicao);
}
