import type { TangerinaDatabase } from "../database.ts";
import type { RegraDistribuicao } from "../entities.ts";
import { criarRepositorio } from "./base.ts";

export function criarRepositorioRegrasDistribuicao(db: TangerinaDatabase) {
  return criarRepositorio<RegraDistribuicao>(
    db.regrasDistribuicao,
    "regrasDistribuicao",
    db,
  );
}
