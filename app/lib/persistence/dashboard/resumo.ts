import type { Alocacao, Caixinha, Conta, EfeitoSaldo } from "../entities.ts";
import { calcularSaldoConta } from "../contas/saldo.ts";
import { calcularSaldoCaixinhaPorAlocacoes } from "../caixinhas/saldo.ts";

export interface ResumoDashboard {
  patrimonioCentavos: number;
  emCaixinhasCentavos: number;
  naoAlocadoCentavos: number;
}

function somarValores(valores: number[]): number {
  return valores.reduce((total, valor) => total + valor, 0);
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
      calcularSaldoCaixinhaPorAlocacoes(caixinha, alocacoes),
    ),
  );

  const naoAlocadoCentavos = patrimonioCentavos - emCaixinhasCentavos;

  return {
    patrimonioCentavos,
    emCaixinhasCentavos,
    naoAlocadoCentavos,
  };
}
