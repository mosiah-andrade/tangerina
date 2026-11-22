import type { Alocacao, Caixinha, Centavos, EfeitoSaldo } from "../entities.ts";

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


/**
 * Calcula o saldo virtual da caixinha a partir do livro de alocações,
 * que é a fonte utilizada pelo resumo financeiro do dashboard.
 */
export function calcularSaldoCaixinhaPorAlocacoes(
  caixinha: Pick<Caixinha, "id" | "saldoInicialCentavos">,
  alocacoes: readonly Alocacao[],
): Centavos {
  return alocacoes.reduce((saldo, alocacao) => {
    if (alocacao.caixinhaId !== caixinha.id) return saldo;

    switch (alocacao.tipo) {
      case "credito_receita":
      case "transferencia_entrada":
        return saldo + alocacao.valorCentavos;
      case "debito_despesa":
      case "transferencia_saida":
        return saldo - alocacao.valorCentavos;
      case "ajuste":
        return saldo + alocacao.valorCentavos;
    }
  }, caixinha.saldoInicialCentavos);
}
