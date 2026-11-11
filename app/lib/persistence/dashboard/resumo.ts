import type { Alocacao, Caixinha, Conta, EfeitoSaldo } from "../entities.ts";
import { calcularSaldoConta } from "../contas/saldo.ts";

export interface ResumoDashboard {
  patrimonioCentavos: number;
  emCaixinhasCentavos: number;
  naoAlocadoCentavos: number;
}

function somarValores(valores: number[]): number {
  return valores.reduce((total, valor) => total + valor, 0);
}



function calcularSaldoCaixinha(
  caixinha: Caixinha,
  alocacoes: Alocacao[],
): number {
  const alocacoesDaCaixinha = alocacoes.filter(
    (alocacao) => alocacao.caixinhaId === caixinha.id,
  );

  const variacaoCentavos = somarValores(
    alocacoesDaCaixinha.map((alocacao) => {
      switch (alocacao.tipo) {
        case "credito_receita":
        case "transferencia_entrada":
          return alocacao.valorCentavos;

        case "debito_despesa":
        case "transferencia_saida":
          return -alocacao.valorCentavos;

        case "ajuste":
          return alocacao.valorCentavos;
      }
    }),
  );

  return caixinha.saldoInicialCentavos + variacaoCentavos;
}

export function calcularResumoDashboard({
  contas,
  caixinhas,
  efeitosSaldo,
  alocacoes,
}: {
  contas: Conta[];
  caixinhas: Caixinha[];
  efeitosSaldo: EfeitoSaldo[];
  alocacoes: Alocacao[];
}): ResumoDashboard {
  const contasAtivas = contas.filter((conta) => conta.ativa);

  const caixinhasAtivas = caixinhas.filter((caixinha) => caixinha.ativa);

  const patrimonioCentavos = somarValores(
    contasAtivas.map((conta) => calcularSaldoConta(conta, efeitosSaldo)),
  );

  const emCaixinhasCentavos = somarValores(
    caixinhasAtivas.map((caixinha) =>
      calcularSaldoCaixinha(caixinha, alocacoes),
    ),
  );

  const naoAlocadoCentavos = patrimonioCentavos - emCaixinhasCentavos;

  return {
    patrimonioCentavos,
    emCaixinhasCentavos,
    naoAlocadoCentavos,
  };
}
