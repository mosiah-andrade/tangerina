/**
 * Contratos de dados persistidos pelo Tangerina.
 *
 * Estes tipos refletem o modelo aprovado em T5 e os tipos documentados em T12.
 * Eles descrevem a forma dos registros; validações de valores e referências
 * em tempo de execução pertencem à camada de validação da persistência.
 */

export type Id = string;
export type Centavos = number;
export type DataISO = string;
export type DateTimeISO = string;
export type PontosBase = number;

export interface EntidadeBase {
  id: Id;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface EntidadeCriada {
  id: Id;
  createdAt: DateTimeISO;
}

export type TipoConta = "bancaria" | "carteira_fisica";

export interface Conta extends EntidadeBase {
  nome: string;
  tipo: TipoConta;
  instituicao?: string;
  saldoInicialCentavos: Centavos;
  dataSaldoInicial: DataISO;
  ativa: boolean;
}

export interface Caixinha extends EntidadeBase {
  nome: string;
  descricao?: string;
  saldoInicialCentavos: Centavos;
  dataSaldoInicial: DataISO;
  cor?: string;
  ativa: boolean;
}

export type TipoMovimento =
  | "receita"
  | "despesa"
  | "transferencia_contas"
  | "transferencia_caixinhas"
  | "saque_carteira"
  | "ajuste_conciliacao";

export type StatusMovimento = "rascunho" | "confirmado" | "cancelado";

export interface Movimento extends EntidadeBase {
  tipo: TipoMovimento;
  status: StatusMovimento;
  descricao: string;
  valorCentavos: Centavos;
  dataMovimento: DataISO;
  idempotencyKey: string;
  contaOrigemId?: Id;
  contaDestinoId?: Id;
  caixinhaId?: Id;
  confirmedAt?: DateTimeISO;
  cancelledAt?: DateTimeISO;
  motivoCancelamento?: string;
}

export type TipoAlvoSaldo = "conta" | "caixinha";
export type EstadoEfeitoSaldo = "ativo" | "revertido";

export interface EfeitoSaldo extends EntidadeCriada {
  movimentoId: Id;
  tipoAlvo: TipoAlvoSaldo;
  alvoId: Id;
  valorCentavosAssinado: Centavos;
  estado: EstadoEfeitoSaldo;
}

export type TipoAlocacao =
  | "credito_receita"
  | "debito_despesa"
  | "transferencia_entrada"
  | "transferencia_saida"
  | "ajuste";

export interface Alocacao extends EntidadeCriada {
  movimentoId: Id;
  caixinhaId: Id;
  tipo: TipoAlocacao;
  valorCentavos: Centavos;
  regraDistribuicaoId?: Id;
  ordemAplicacao?: number;
  baseCalculoCentavos?: Centavos;
  percentualAplicado?: PontosBase;
}

export type TipoCalculoDistribuicao =
  "valor_fixo" | "percentual_receita_bruta" | "percentual_saldo_restante";

export type BaseCalculoDistribuicao = "receita_bruta" | "saldo_restante";

interface RegraDistribuicaoBase extends EntidadeBase {
  nome: string;
  caixinhaId: Id;
  ordem: number;
  ativa: boolean;
}

export type RegraDistribuicao =
  | (RegraDistribuicaoBase & {
      tipoCalculo: "valor_fixo";
      valorFixoCentavos: Centavos;
      percentual?: never;
    })
  | (RegraDistribuicaoBase & {
      tipoCalculo: "percentual_receita_bruta" | "percentual_saldo_restante";
      percentual: PontosBase;
      valorFixoCentavos?: never;
    });

/**
 * O catálogo definitivo de frequências continua pendente de validação
 * documental. Por isso, o contrato de persistência não restringe o valor
 * a um enum ainda não aprovado.
 */
export interface Recorrencia extends EntidadeBase {
  descricao: string;
  valorCentavos: Centavos;
  diaVencimento: number;
  dataInicio: DataISO;
  dataFim?: DataISO;
  frequencia: string;
  ativa: boolean;
  contaId?: Id;
}

export type StatusContaPagar = "pendente" | "paga" | "cancelada";

export interface ContaPagar extends EntidadeBase {
  recorrenciaId?: Id;
  chaveOcorrencia: string;
  descricao: string;
  valorCentavos: Centavos;
  dataVencimento: DataISO;
  status: StatusContaPagar;
  movimentoPagamentoId?: Id;
}

export type ModoProgressoMeta = "saldo_atual" | "aportes_acumulados";

export interface Meta extends EntidadeBase {
  nome: string;
  valorAlvoCentavos: Centavos;
  dataAlvo?: DataISO;
  modoProgresso: ModoProgressoMeta;
  caixinhaId?: Id;
  ativa: boolean;
}

export interface AporteMeta {
  id: Id;
  metaId: Id;
  movimentoId?: Id;
  valorCentavos: Centavos;
  data: DataISO;
}

export type AcaoAuditoria =
  "criado" | "editado" | "cancelado" | "restaurado" | "conciliado";

export type TipoEntidadeAuditoria =
  | "contas"
  | "caixinhas"
  | "movimentos"
  | "efeitosSaldo"
  | "alocacoes"
  | "regrasDistribuicao"
  | "contasPagar"
  | "recorrencias"
  | "metas"
  | "aportesMeta";

export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export interface Auditoria extends EntidadeCriada {
  entidadeTipo: TipoEntidadeAuditoria;
  entidadeId: Id;
  acao: AcaoAuditoria;
  antes?: JsonValue;
  depois?: JsonValue;
  motivo?: string;
}

export interface MetadataRecord {
  chave: string;
  valor: unknown;
}

export interface PersistedEntities {
  contas: Conta;
  caixinhas: Caixinha;
  movimentos: Movimento;
  efeitosSaldo: EfeitoSaldo;
  alocacoes: Alocacao;
  regrasDistribuicao: RegraDistribuicao;
  contasPagar: ContaPagar;
  recorrencias: Recorrencia;
  metas: Meta;
  aportesMeta: AporteMeta;
  auditorias: Auditoria;
  metadados: MetadataRecord;
}
