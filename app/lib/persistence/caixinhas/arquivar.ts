import type { TangerinaDatabase } from "../database.ts";
import type { Caixinha } from "../entities.ts";
import { criarRepositorioCaixinhas } from "../repositories/caixinhas.ts";

export async function arquivarCaixinha(
  db: TangerinaDatabase,
  id: string,
): Promise<Caixinha | undefined> {
  const repositorio = criarRepositorioCaixinhas(db);
  const caixinha = await repositorio.buscarPorId(id);
  if (!caixinha) return undefined;

  await repositorio.atualizar(id, { ativa: false });
  return repositorio.buscarPorId(id);
}
