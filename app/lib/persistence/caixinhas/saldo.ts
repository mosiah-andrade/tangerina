import type { Caixinha, Centavos, EfeitoSaldo } from "../entities.ts";

export function calcularSaldoCaixinha(
  caixinha: Caixinha,
  efeitos: readonly EfeitoSaldo[],
): Centavos {
  return efeitos.reduce(
    (saldo, efeito) =>
      efeito.estado === "ativo" &&
      efeito.tipoAlvo === "caixinha" &&
      efeito.alvoId === caixinha.id
        ? saldo + efeito.valorCentavosAssinado
        : saldo,
    caixinha.saldoInicialCentavos,
  );
}
