import type { TangerinaDatabase } from "../database.ts";
import type { Conta } from "../entities.ts";
import { criarRepositorioContas } from "../repositories/contas.ts";

export interface DadosEdicaoContaBancaria {
  nome?: string;
  instituicao?: string | null;
}

/**
 * Edita os dados cadastrais de uma conta bancária existente.
 *
 * O tipo e o saldo inicial não são alterados neste caso de uso para evitar
 * mudar a natureza da conta ou reescrever sua posição inicial.
 */
export async function editarContaBancaria(
  db: TangerinaDatabase,
  id: string,
  dados: DadosEdicaoContaBancaria,
): Promise<Conta | undefined> {
  const repositorio = criarRepositorioContas(db);
  const conta = await repositorio.buscarPorId(id);

  if (!conta || conta.tipo !== "bancaria") {
    return undefined;
  }

  const alteracoes = {
    ...(dados.nome !== undefined ? { nome: dados.nome } : {}),
    ...(dados.instituicao !== undefined
      ? dados.instituicao === null
        ? { instituicao: undefined }
        : { instituicao: dados.instituicao }
      : {}),
  };

  const atualizada = await repositorio.atualizar(id, alteracoes);

  if (!atualizada) {
    return undefined;
  }

  return repositorio.buscarPorId(id);
}
