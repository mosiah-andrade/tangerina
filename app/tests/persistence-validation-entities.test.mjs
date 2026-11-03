import assert from "node:assert/strict";
import test from "node:test";

const {
  validarConta,
  validarCaixinha,
  validarMovimento,
  validarEfeitoSaldo,
  validarAlocacao,
  validarRegraDistribuicao,
  validarRecorrencia,
  validarContaPagar,
  validarMeta,
  validarAporteMeta,
  validarAuditoria,
  validarMetadataRecord,
} = await import("../lib/persistence/validation/validators.ts");

const agora = "2026-11-03T12:00:00.000Z";

const contaValida = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  nome: "Conta principal",
  tipo: "bancaria",
  saldoInicialCentavos: 100000,
  dataSaldoInicial: "2026-11-03",
  ativa: true,
  createdAt: agora,
  updatedAt: agora,
};

const caixinhaValida = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  nome: "Reserva",
  saldoInicialCentavos: 50000,
  dataSaldoInicial: "2026-11-03",
  ativa: true,
  createdAt: agora,
  updatedAt: agora,
};

test("validates a complete account", () => {
  assert.equal(validarConta(contaValida).valido, true);
});

test("rejects invalid account fields", () => {
  const resultado = validarConta({
    ...contaValida,
    nome: "",
    tipo: "poupanca",
    saldoInicialCentavos: -100,
    dataSaldoInicial: "2026-02-30",
    ativa: "sim",
  });

  assert.equal(resultado.valido, false);

  if (!resultado.valido) {
    assert.ok(resultado.erros.length >= 5);
  }
});

test("validates optional account institution", () => {
  assert.equal(
    validarConta({ ...contaValida, instituicao: "Banco exemplo" }).valido,
    true,
  );

  assert.equal(
    validarConta({ ...contaValida, instituicao: 123 }).valido,
    false,
  );
});

test("validates a complete savings pocket", () => {
  assert.equal(validarCaixinha(caixinhaValida).valido, true);
});

test("validates optional savings pocket fields", () => {
  assert.equal(
    validarCaixinha({
      ...caixinhaValida,
      descricao: "Reserva de emergência",
      cor: "#0B3C2A",
    }).valido,
    true,
  );

  assert.equal(validarCaixinha({ ...caixinhaValida, cor: 123 }).valido, false);
});

test("rejects invalid savings pocket data", () => {
  assert.equal(
    validarCaixinha({
      ...caixinhaValida,
      id: "caixinha-1",
      saldoInicialCentavos: -1,
      ativa: "true",
    }).valido,
    false,
  );
});

const movimentoValido = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  tipo: "receita",
  status: "confirmado",
  descricao: "Salário",
  valorCentavos: 300000,
  dataMovimento: "2026-11-03",
  idempotencyKey: "receita-salario-2026-11",
  confirmedAt: agora,
  createdAt: agora,
  updatedAt: agora,
};

const efeitoSaldoValido = {
  id: "550e8400-e29b-41d4-a716-446655440003",
  movimentoId: "550e8400-e29b-41d4-a716-446655440002",
  tipoAlvo: "conta",
  alvoId: "550e8400-e29b-41d4-a716-446655440000",
  valorCentavosAssinado: 300000,
  estado: "ativo",
  createdAt: agora,
};

test("validates a complete movement", () => {
  assert.equal(validarMovimento(movimentoValido).valido, true);
});

test("validates movement optional identifiers and dates", () => {
  assert.equal(
    validarMovimento({
      ...movimentoValido,
      contaOrigemId: "550e8400-e29b-41d4-a716-446655440000",
      contaDestinoId: "550e8400-e29b-41d4-a716-446655440001",
      caixinhaId: "550e8400-e29b-41d4-a716-446655440003",
      cancelledAt: agora,
      motivoCancelamento: "Correção",
    }).valido,
    true,
  );
});

test("rejects invalid movement data", () => {
  const resultado = validarMovimento({
    ...movimentoValido,
    tipo: "pagamento",
    status: "aberto",
    valorCentavos: 0,
    dataMovimento: "2026-02-30",
    idempotencyKey: "",
    contaOrigemId: "conta-inexistente",
  });

  assert.equal(resultado.valido, false);
});

test("does not impose conditional movement requirements yet", () => {
  assert.equal(
    validarMovimento({
      ...movimentoValido,
      contaOrigemId: undefined,
      contaDestinoId: undefined,
    }).valido,
    true,
  );
});

test("validates a complete balance effect", () => {
  assert.equal(validarEfeitoSaldo(efeitoSaldoValido).valido, true);
});

test("accepts signed balance effects", () => {
  assert.equal(
    validarEfeitoSaldo({
      ...efeitoSaldoValido,
      valorCentavosAssinado: -5000,
    }).valido,
    true,
  );
});

test("rejects invalid balance effects", () => {
  assert.equal(
    validarEfeitoSaldo({
      ...efeitoSaldoValido,
      tipoAlvo: "meta",
      valorCentavosAssinado: 10.5,
      estado: "cancelado",
    }).valido,
    false,
  );
});

const alocacaoValida = {
  id: "550e8400-e29b-41d4-a716-446655440004",
  movimentoId: "550e8400-e29b-41d4-a716-446655440002",
  caixinhaId: "550e8400-e29b-41d4-a716-446655440001",
  tipo: "credito_receita",
  valorCentavos: 50000,
  createdAt: agora,
};

const regraBaseValida = {
  id: "550e8400-e29b-41d4-a716-446655440005",
  nome: "Reserva",
  caixinhaId: "550e8400-e29b-41d4-a716-446655440001",
  ordem: 0,
  ativa: true,
  createdAt: agora,
  updatedAt: agora,
};

test("validates a complete allocation", () => {
  assert.equal(validarAlocacao(alocacaoValida).valido, true);
});

test("validates optional allocation fields", () => {
  assert.equal(
    validarAlocacao({
      ...alocacaoValida,
      regraDistribuicaoId: "550e8400-e29b-41d4-a716-446655440005",
      ordemAplicacao: 1,
      baseCalculoCentavos: 100000,
      percentualAplicado: 500,
    }).valido,
    true,
  );
});

test("rejects invalid allocation fields", () => {
  assert.equal(
    validarAlocacao({
      ...alocacaoValida,
      tipo: "pagamento",
      valorCentavos: -1,
      ordemAplicacao: -1,
      percentualAplicado: 10001,
    }).valido,
    false,
  );
});

test("validates fixed-value distribution rules", () => {
  assert.equal(
    validarRegraDistribuicao({
      ...regraBaseValida,
      tipoCalculo: "valor_fixo",
      valorFixoCentavos: 25000,
    }).valido,
    true,
  );
});

test("validates gross-revenue percentage rules", () => {
  assert.equal(
    validarRegraDistribuicao({
      ...regraBaseValida,
      tipoCalculo: "percentual_receita_bruta",
      percentual: 2000,
    }).valido,
    true,
  );
});

test("validates remaining-balance percentage rules", () => {
  assert.equal(
    validarRegraDistribuicao({
      ...regraBaseValida,
      tipoCalculo: "percentual_saldo_restante",
      percentual: 10000,
    }).valido,
    true,
  );
});

test("rejects missing or incompatible distribution fields", () => {
  const semValorFixo = validarRegraDistribuicao({
    ...regraBaseValida,
    tipoCalculo: "valor_fixo",
  });

  const semPercentual = validarRegraDistribuicao({
    ...regraBaseValida,
    tipoCalculo: "percentual_receita_bruta",
  });

  const fixoComPercentual = validarRegraDistribuicao({
    ...regraBaseValida,
    tipoCalculo: "valor_fixo",
    valorFixoCentavos: 10000,
    percentual: 500,
  });

  const percentualComFixo = validarRegraDistribuicao({
    ...regraBaseValida,
    tipoCalculo: "percentual_saldo_restante",
    percentual: 500,
    valorFixoCentavos: 10000,
  });

  assert.equal(semValorFixo.valido, false);
  assert.equal(semPercentual.valido, false);
  assert.equal(fixoComPercentual.valido, false);
  assert.equal(percentualComFixo.valido, false);
});

test("rejects distribution percentages outside the approved range", () => {
  assert.equal(
    validarRegraDistribuicao({
      ...regraBaseValida,
      tipoCalculo: "percentual_receita_bruta",
      percentual: 10001,
    }).valido,
    false,
  );
});

const recorrenciaValida = {
  id: "550e8400-e29b-41d4-a716-446655440006",
  descricao: "Aluguel",
  valorCentavos: 120000,
  diaVencimento: 10,
  dataInicio: "2026-01-01",
  frequencia: "mensal",
  ativa: true,
  createdAt: agora,
  updatedAt: agora,
};

const contaPagarValida = {
  id: "550e8400-e29b-41d4-a716-446655440007",
  chaveOcorrencia: "aluguel-2026-11",
  descricao: "Aluguel de novembro",
  valorCentavos: 120000,
  dataVencimento: "2026-11-10",
  status: "pendente",
  createdAt: agora,
  updatedAt: agora,
};

test("validates a complete recurrence", () => {
  assert.equal(validarRecorrencia(recorrenciaValida).valido, true);
});

test("validates optional recurrence fields", () => {
  assert.equal(
    validarRecorrencia({
      ...recorrenciaValida,
      dataFim: "2027-01-01",
      contaId: "550e8400-e29b-41d4-a716-446655440000",
    }).valido,
    true,
  );
});

test("keeps recurrence frequency as a non-empty string", () => {
  assert.equal(
    validarRecorrencia({
      ...recorrenciaValida,
      frequencia: "quinzenal",
    }).valido,
    true,
  );

  assert.equal(
    validarRecorrencia({
      ...recorrenciaValida,
      frequencia: "",
    }).valido,
    false,
  );
});

test("rejects invalid recurrence fields", () => {
  assert.equal(
    validarRecorrencia({
      ...recorrenciaValida,
      valorCentavos: 0,
      diaVencimento: 32,
      dataInicio: "2026-02-30",
      contaId: "conta-invalida",
    }).valido,
    false,
  );
});

test("validates a complete payable account", () => {
  assert.equal(validarContaPagar(contaPagarValida).valido, true);
});

test("validates optional payable account references", () => {
  assert.equal(
    validarContaPagar({
      ...contaPagarValida,
      recorrenciaId: "550e8400-e29b-41d4-a716-446655440006",
      movimentoPagamentoId: "550e8400-e29b-41d4-a716-446655440002",
    }).valido,
    true,
  );
});

test("rejects invalid payable account fields", () => {
  assert.equal(
    validarContaPagar({
      ...contaPagarValida,
      chaveOcorrencia: "",
      valorCentavos: 0,
      dataVencimento: "2026-02-30",
      status: "aberta",
      recorrenciaId: "recorrencia-invalida",
    }).valido,
    false,
  );
});

const metaValida = {
  id: "550e8400-e29b-41d4-a716-446655440008",
  nome: "Reserva de emergência",
  valorAlvoCentavos: 1000000,
  modoProgresso: "aportes_acumulados",
  ativa: true,
  createdAt: agora,
  updatedAt: agora,
};

const aporteMetaValido = {
  id: "550e8400-e29b-41d4-a716-446655440009",
  metaId: "550e8400-e29b-41d4-a716-446655440008",
  valorCentavos: 50000,
  data: "2026-11-03",
};

test("validates a complete goal", () => {
  assert.equal(validarMeta(metaValida).valido, true);
});

test("validates optional goal fields", () => {
  assert.equal(
    validarMeta({
      ...metaValida,
      dataAlvo: "2027-12-31",
      caixinhaId: "550e8400-e29b-41d4-a716-446655440001",
    }).valido,
    true,
  );
});

test("rejects invalid goal fields", () => {
  assert.equal(
    validarMeta({
      ...metaValida,
      nome: "",
      valorAlvoCentavos: 0,
      modoProgresso: "progresso_manual",
      dataAlvo: "2026-02-30",
      caixinhaId: "caixinha-invalida",
      ativa: "sim",
    }).valido,
    false,
  );
});

test("validates a complete goal contribution", () => {
  assert.equal(validarAporteMeta(aporteMetaValido).valido, true);
});

test("validates optional movement reference in goal contribution", () => {
  assert.equal(
    validarAporteMeta({
      ...aporteMetaValido,
      movimentoId: "550e8400-e29b-41d4-a716-446655440002",
    }).valido,
    true,
  );
});

test("rejects invalid goal contribution fields", () => {
  assert.equal(
    validarAporteMeta({
      ...aporteMetaValido,
      metaId: "meta-invalida",
      movimentoId: "movimento-invalido",
      valorCentavos: 0,
      data: "2026-02-30",
    }).valido,
    false,
  );
});
const auditoriaValida = {
  id: "550e8400-e29b-41d4-a716-446655440010",
  createdAt: agora,
  entidadeTipo: "contas",
  entidadeId: "550e8400-e29b-41d4-a716-446655440000",
  acao: "criado",
};

const metadataValido = {
  chave: "versao_schema",
  valor: {
    versao: 1,
    migrado: true,
    detalhes: ["inicial"],
  },
};

test("validates a complete audit record", () => {
  assert.equal(validarAuditoria(auditoriaValida).valido, true);
});

test("validates audit snapshots and optional reason", () => {
  assert.equal(
    validarAuditoria({
      ...auditoriaValida,
      antes: { nome: "Conta antiga", saldo: 1000 },
      depois: { nome: "Conta nova", saldo: 2000 },
      motivo: "Correção cadastral",
    }).valido,
    true,
  );
});

test("rejects invalid audit fields and snapshots", () => {
  const resultado = validarAuditoria({
    ...auditoriaValida,
    entidadeTipo: "usuarios",
    entidadeId: "id-invalido",
    acao: "excluido",
    antes: { valor: undefined },
    motivo: 123,
  });

  assert.equal(resultado.valido, false);
  assert.ok(resultado.erros.length >= 5);
});

test("rejects audit snapshots with circular references", () => {
  const snapshot = {};
  snapshot.self = snapshot;

  assert.equal(
    validarAuditoria({
      ...auditoriaValida,
      antes: snapshot,
    }).valido,
    false,
  );
});

test("validates a metadata record with JSON value", () => {
  assert.equal(validarMetadataRecord(metadataValido).valido, true);
});

test("validates metadata with null and primitive JSON values", () => {
  for (const valor of [null, true, 42, "texto", [1, 2, 3]]) {
    assert.equal(
      validarMetadataRecord({ chave: "configuracao", valor }).valido,
      true,
    );
  }
});

test("rejects metadata with missing or invalid fields", () => {
  assert.equal(validarMetadataRecord({ valor: "teste" }).valido, false);
  assert.equal(validarMetadataRecord({ chave: "", valor: "teste" }).valido, false);
  assert.equal(validarMetadataRecord({ chave: "configuracao" }).valido, false);
});

test("rejects metadata with non-JSON values", () => {
  assert.equal(
    validarMetadataRecord({
      chave: "funcao",
      valor: () => "não serializável",
    }).valido,
    false,
  );

  assert.equal(
    validarMetadataRecord({
      chave: "numero",
      valor: Number.POSITIVE_INFINITY,
    }).valido,
    false,
  );
});