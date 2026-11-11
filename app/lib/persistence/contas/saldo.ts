import type { TangerinaDatabase } from "../database.ts";
import type { Centavos, Conta, EfeitoSaldo, Id } from "../entities.ts";

export function calcularSaldoConta(
  conta: Conta,
  efeitosSaldo: EfeitoSaldo[],
): Centavos {
  const variacaoCentavos = efeitosSaldo
    .filter(
      (efeito) =>
        efeito.tipoAlvo === "conta" &&
        efeito.alvoId === conta.id &&
        efeito.estado === "ativo",
    )
    .reduce(
      (total, efeito) => total + efeito.valorCentavosAssinado,
      0,
    );

  return conta.saldoInicialCentavos + variacaoCentavos;
}

export async function obterSaldoAtualConta(
  db: TangerinaDatabase,
  contaId: Id,
): Promise<Centavos | undefined> {
  const conta = await db.contas.get(contaId);

  if (!conta) return undefined;

  const efeitosSaldo = await db.efeitosSaldo
    .where("alvoId")
    .equals(contaId)
    .toArray();

  return calcularSaldoConta(conta, efeitosSaldo);
}