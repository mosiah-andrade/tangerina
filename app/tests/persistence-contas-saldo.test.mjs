import assert from "node:assert/strict";
import test from "node:test";

import { calcularSaldoConta } from "../lib/persistence/contas/saldo.ts";

const conta = {
  id: "conta-1",
  nome: "Conta principal",
  tipo: "bancaria",
  saldoInicialCentavos: 10000,
  dataSaldoInicial: "2026-01-01",
  ativa: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("calcula o saldo inicial quando não existem efeitos", () => {
  assert.equal(calcularSaldoConta(conta, []), 10000);
});

test("soma créditos e débitos ativos da conta", () => {
  const efeitos = [
    {
      id: "efeito-1",
      movimentoId: "movimento-1",
      tipoAlvo: "conta",
      alvoId: "conta-1",
      valorCentavosAssinado: 2500,
      estado: "ativo",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "efeito-2",
      movimentoId: "movimento-2",
      tipoAlvo: "conta",
      alvoId: "conta-1",
      valorCentavosAssinado: -1000,
      estado: "ativo",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  assert.equal(calcularSaldoConta(conta, efeitos), 11500);
});

test("ignora efeitos revertidos, de outros alvos e de outro tipo", () => {
  const efeitos = [
    {
      id: "efeito-ativo",
      movimentoId: "movimento-1",
      tipoAlvo: "conta",
      alvoId: "conta-1",
      valorCentavosAssinado: 500,
      estado: "ativo",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "efeito-revertido",
      movimentoId: "movimento-2",
      tipoAlvo: "conta",
      alvoId: "conta-1",
      valorCentavosAssinado: 9999,
      estado: "revertido",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "efeito-outra-conta",
      movimentoId: "movimento-3",
      tipoAlvo: "conta",
      alvoId: "conta-2",
      valorCentavosAssinado: 9999,
      estado: "ativo",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "efeito-caixinha",
      movimentoId: "movimento-4",
      tipoAlvo: "caixinha",
      alvoId: "conta-1",
      valorCentavosAssinado: 9999,
      estado: "ativo",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  assert.equal(calcularSaldoConta(conta, efeitos), 10500);
});