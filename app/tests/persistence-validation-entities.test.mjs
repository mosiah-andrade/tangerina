import assert from "node:assert/strict";
import test from "node:test";

const { validarConta, validarCaixinha } =
  await import("../lib/persistence/validation/validators.ts");

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
