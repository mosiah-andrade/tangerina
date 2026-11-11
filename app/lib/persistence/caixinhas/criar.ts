import type { TangerinaDatabase } from "../database.ts";
import type { Caixinha, Centavos, DataISO } from "../entities.ts";
import { criarRepositorioCaixinhas } from "../repositories/caixinhas.ts";

export interface DadosNovaCaixinha {
  nome: string;
  descricao?: string;
  saldoInicialCentavos: Centavos;
  dataSaldoInicial: DataISO;
  cor?: string;
}

export async function criarCaixinha(
  db: TangerinaDatabase,
  dados: DadosNovaCaixinha,
): Promise<Caixinha> {
  const agora = new Date().toISOString();
  const caixinha: Caixinha = {
    id: crypto.randomUUID(),
    nome: dados.nome,
    ...(dados.descricao ? { descricao: dados.descricao } : {}),
    saldoInicialCentavos: dados.saldoInicialCentavos,
    dataSaldoInicial: dados.dataSaldoInicial,
    ...(dados.cor ? { cor: dados.cor } : {}),
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };
  await criarRepositorioCaixinhas(db).inserir(caixinha);
  return caixinha;
}
