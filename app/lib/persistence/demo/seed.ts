import type {
  Alocacao,
  Caixinha,
  Conta,
  ContaPagar,
  EfeitoSaldo,
  Meta,
  Movimento,
  Recorrencia,
  RegraDistribuicao,
} from "../entities.ts";

export interface DadosDemonstracao {
  contas: Conta[];
  caixinhas: Caixinha[];
  movimentos: Movimento[];
  efeitosSaldo: EfeitoSaldo[];
  alocacoes: Alocacao[];
  regrasDistribuicao: RegraDistribuicao[];
  recorrencias: Recorrencia[];
  contasPagar: ContaPagar[];
  metas: Meta[];
}
