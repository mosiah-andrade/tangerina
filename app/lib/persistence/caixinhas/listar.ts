import type { TangerinaDatabase } from "../database.ts";
import type { Caixinha, Centavos } from "../entities.ts";
import { calcularSaldoCaixinha } from "./saldo.ts";

export interface CaixinhaComSaldo {
  caixinha: Caixinha;
  saldoAtualCentavos: Centavos;
}

export async function listarCaixinhasComSaldo(
  db: TangerinaDatabase,
): Promise<CaixinhaComSaldo[]> {
  const [caixinhas, efeitos] = await Promise.all([
    db.caixinhas.toArray(),
    db.efeitosSaldo.toArray(),
  ]);

  return caixinhas.map((caixinha) => ({
    caixinha,
    saldoAtualCentavos: calcularSaldoCaixinha(caixinha, efeitos),
  }));
}
