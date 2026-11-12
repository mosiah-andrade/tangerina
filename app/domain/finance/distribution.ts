import {
  assertValidCents,
  multiplyAndRoundCents,
  subtractCents,
} from "./money.ts";

export type DistributionRuleKind =
  | "valor_fixo"
  | "percentual_receita_bruta"
  | "percentual_saldo_restante";

export interface DistributionRuleInput {
  id: string;
  ordem: number;
  ativa: boolean;
  tipoCalculo: DistributionRuleKind;
  valorFixoCentavos?: number;
  percentual?: number;
}

export interface DistributionAllocation {
  regraDistribuicaoId: string;
  ordemAplicacao: number;
  tipoCalculo: DistributionRuleKind;
  valorCentavos: number;
  baseCalculoCentavos: number;
  percentualAplicado?: number;
}

export interface DistributionResult {
  receitaBrutaCentavos: number;
  alocacoes: DistributionAllocation[];
  totalAlocadoCentavos: number;
  naoAlocadoCentavos: number;
  excedenteCentavos: number;
  podeConfirmar: boolean;
}

/**
 * Applies approved rules deterministically in explicit order.
 * Fixed values consume the available balance first; gross-revenue percentages
 * use the original receipt as their base; remaining-balance percentages use
 * the balance left after all previous rules. No allocation can silently exceed
 * the available receipt.
 */
export function calcularDistribuicao(
  receitaBrutaCentavos: number,
  regras: readonly DistributionRuleInput[],
): DistributionResult {
  assertValidCents(receitaBrutaCentavos);
  if (receitaBrutaCentavos < 0) {
    throw new RangeError("A receita deve ser maior ou igual a zero.");
  }

  const ordenadas = regras
    .filter((regra) => regra.ativa)
    .slice()
    .sort((a, b) => a.ordem - b.ordem || a.id.localeCompare(b.id));

  let restante = receitaBrutaCentavos;
  let totalAlocado = 0;
  let excedente = 0;
  const alocacoes: DistributionAllocation[] = [];

  for (const regra of ordenadas) {
    let calculado: number;
    let baseCalculoCentavos: number;
    let percentualAplicado: number | undefined;

    switch (regra.tipoCalculo) {
      case "valor_fixo":
        if (
          regra.valorFixoCentavos === undefined ||
          !Number.isSafeInteger(regra.valorFixoCentavos) ||
          regra.valorFixoCentavos < 0
        ) {
          throw new RangeError("Regra fixa inválida.");
        }
        baseCalculoCentavos = restante;
        calculado = regra.valorFixoCentavos;
        break;

      case "percentual_receita_bruta":
        if (regra.percentual === undefined) {
          throw new RangeError("Regra percentual sem percentual.");
        }
        baseCalculoCentavos = receitaBrutaCentavos;
        percentualAplicado = regra.percentual;
        calculado = multiplyAndRoundCents(
          receitaBrutaCentavos,
          regra.percentual,
        );
        break;

      case "percentual_saldo_restante":
        if (regra.percentual === undefined) {
          throw new RangeError("Regra percentual sem percentual.");
        }
        baseCalculoCentavos = restante;
        percentualAplicado = regra.percentual;
        calculado = multiplyAndRoundCents(restante, regra.percentual);
        break;

      default: {
        const exhaustive: never = regra.tipoCalculo;
        throw new Error(`Tipo de regra não suportado: ${exhaustive}`);
      }
    }

    if (calculado > restante) {
      excedente += calculado - restante;
      continue;
    }

    restante = subtractCents(restante, calculado);
    totalAlocado += calculado;
    alocacoes.push({
      regraDistribuicaoId: regra.id,
      ordemAplicacao: regra.ordem,
      tipoCalculo: regra.tipoCalculo,
      valorCentavos: calculado,
      baseCalculoCentavos,
      percentualAplicado,
    });
  }

  return {
    receitaBrutaCentavos,
    alocacoes,
    totalAlocadoCentavos: totalAlocado,
    naoAlocadoCentavos: restante,
    excedenteCentavos: excedente,
    podeConfirmar: excedente === 0,
  };
}
