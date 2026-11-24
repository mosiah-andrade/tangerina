import type { TangerinaDatabase } from "../database.ts";
import type { Caixinha, Centavos } from "../entities.ts";
import { calcularSaldoCaixinhaPorAlocacoes } from "./saldo.ts";

export interface CaixinhaComSaldo {
  caixinha: Caixinha;
  saldoAtualCentavos: Centavos;
}

export async function listarCaixinhasComSaldo(
  db: TangerinaDatabase,
): Promise<CaixinhaComSaldo[]> {
  const [caixinhas, alocacoes] = await Promise.all([
    db.caixinhas.toArray(),
    db.alocacoes.toArray(),
  ]);

  return caixinhas.map((caixinha) => ({
    caixinha,
    saldoAtualCentavos: calcularSaldoCaixinhaPorAlocacoes(caixinha, alocacoes),
  }));
}
