import type { TangerinaDatabase } from "../database.ts";
import type { Centavos, Conta, DataISO } from "../entities.ts";
import { criarRepositorioContas } from "../repositories/contas.ts";

export interface DadosNovaContaBancaria {
  nome: string;
  instituicao?: string;
  saldoInicialCentavos: Centavos;
  dataSaldoInicial: DataISO;
}

function criarIdConta(): string {
  return crypto.randomUUID();
}

/**
 * Cria e persiste uma conta bancária ativa.
 *
 * A validação estrutural e de valores permanece centralizada no repositório
 * de contas, mantendo este caso de uso responsável pela composição do
 * registro de domínio.
 */
export async function criarContaBancaria(
  db: TangerinaDatabase,
  dados: DadosNovaContaBancaria,
): Promise<Conta> {
  const agora = new Date().toISOString();

  const conta: Conta = {
    id: criarIdConta(),
    nome: dados.nome,
    tipo: "bancaria",
    ...(dados.instituicao !== undefined
      ? { instituicao: dados.instituicao }
      : {}),
    saldoInicialCentavos: dados.saldoInicialCentavos,
    dataSaldoInicial: dados.dataSaldoInicial,
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };

  const repositorio = criarRepositorioContas(db);
  await repositorio.inserir(conta);

  return conta;
}
