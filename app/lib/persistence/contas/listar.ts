import type { TangerinaDatabase } from "../database.ts";
import type { Centavos, Conta } from "../entities.ts";
import { calcularSaldoConta } from "./saldo.ts";

export interface ContaComSaldo {
  conta: Conta;
  saldoAtualCentavos: Centavos;
}

export async function listarContasComSaldo(
  db: TangerinaDatabase,
): Promise<ContaComSaldo[]> {
  const [contas, efeitosSaldo] = await Promise.all([
    db.contas.where("tipo").equals("bancaria").toArray(),
    db.efeitosSaldo.toArray(),
  ]);

  return contas.map((conta) => ({
    conta,
    saldoAtualCentavos: calcularSaldoConta(conta, efeitosSaldo),
  }));
}
