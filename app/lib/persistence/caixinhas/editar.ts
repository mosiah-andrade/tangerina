import type { TangerinaDatabase } from "../database.ts";
import type { Caixinha } from "../entities.ts";
import { criarRepositorioCaixinhas } from "../repositories/caixinhas.ts";

export interface DadosEdicaoCaixinha {
  nome?: string;
  descricao?: string | null;
  cor?: string | null;
}

export async function editarCaixinha(
  db: TangerinaDatabase,
  id: string,
  dados: DadosEdicaoCaixinha,
): Promise<Caixinha | undefined> {
  const repositorio = criarRepositorioCaixinhas(db);
  if (!(await repositorio.buscarPorId(id))) return undefined;

  await repositorio.atualizar(id, {
    ...(dados.nome !== undefined ? { nome: dados.nome } : {}),
    ...(dados.descricao !== undefined
      ? dados.descricao === null
        ? { descricao: undefined }
        : { descricao: dados.descricao }
      : {}),
    ...(dados.cor !== undefined
      ? dados.cor === null ? { cor: undefined } : { cor: dados.cor }
      : {}),
  });

  return repositorio.buscarPorId(id);
}
