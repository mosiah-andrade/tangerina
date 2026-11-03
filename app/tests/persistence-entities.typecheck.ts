import type {
  Conta,
  Movimento,
  RegraDistribuicao,
} from "../lib/persistence/entities";

const conta: Conta = {
  id: "conta-1",
  nome: "Conta principal",
  tipo: "bancaria",
  saldoInicialCentavos: 100_00,
  dataSaldoInicial: "2026-11-03",
  ativa: true,
  createdAt: "2026-11-03T12:00:00.000Z",
  updatedAt: "2026-11-03T12:00:00.000Z",
};

const movimento: Movimento = {
  id: "movimento-1",
  tipo: "receita",
  status: "rascunho",
  descricao: "Recebimento de teste",
  valorCentavos: 250_00,
  dataMovimento: "2026-11-03",
  idempotencyKey: "receita-teste-1",
  createdAt: "2026-11-03T12:00:00.000Z",
  updatedAt: "2026-11-03T12:00:00.000Z",
};

const regraFixa: RegraDistribuicao = {
  id: "regra-1",
  nome: "Reserva",
  caixinhaId: "caixinha-1",
  tipoCalculo: "valor_fixo",
  valorFixoCentavos: 5_000,
  ordem: 1,
  ativa: true,
  createdAt: "2026-11-03T12:00:00.000Z",
  updatedAt: "2026-11-03T12:00:00.000Z",
};

const regraPercentual: RegraDistribuicao = {
  id: "regra-2",
  nome: "Investimentos",
  caixinhaId: "caixinha-2",
  tipoCalculo: "percentual_receita_bruta",
  percentual: 1_500,
  ordem: 2,
  ativa: true,
  createdAt: "2026-11-03T12:00:00.000Z",
  updatedAt: "2026-11-03T12:00:00.000Z",
};

// @ts-expect-error Tipo de conta fora do catálogo aprovado.
const contaComTipoInvalido: Conta = { ...conta, tipo: "poupanca" };

// @ts-expect-error Regra percentual precisa de percentual, não valor fixo.
const regraInvalida: RegraDistribuicao = {
  ...regraFixa,
  tipoCalculo: "percentual_saldo_restante",
};

// Mantém os exemplos como fixtures de compilação, sem execução em runtime.
void [movimento, regraPercentual, contaComTipoInvalido, regraInvalida];
