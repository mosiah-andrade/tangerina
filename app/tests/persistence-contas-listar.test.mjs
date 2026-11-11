import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import test from "node:test";

import { TangerinaDatabase } from "../lib/persistence/database.ts";
import { listarContasComSaldo } from "../lib/persistence/contas/listar.ts";

function criarConta({
  id,
  tipo = "bancaria",
  saldoInicialCentavos,
}) {
  return {
    id,
    nome: id,
    tipo,
    saldoInicialCentavos,
    dataSaldoInicial: "2026-01-01",
    ativa: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function criarEfeito({
  id,
  alvoId,
  valorCentavosAssinado,
  estado = "ativo",
  tipoAlvo = "conta",
}) {
  return {
    id,
    movimentoId: `movimento-${id}`,
    tipoAlvo,
    alvoId,
    valorCentavosAssinado,
    estado,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

async function comBanco(t, executar) {
  const db = new TangerinaDatabase();
  t.after(() => db.delete());
  await executar(db);
}

test("lista apenas contas bancárias com o saldo inicial", async (t) => {
  await comBanco(t, async (db) => {
    await db.contas.bulkAdd([
      criarConta({
        id: "conta-1",
        saldoInicialCentavos: 10000,
      }),
      criarConta({
        id: "carteira-1",
        tipo: "carteira_fisica",
        saldoInicialCentavos: 5000,
      }),
    ]);

    const contas = await listarContasComSaldo(db);

    assert.deepEqual(contas, [
      {
        conta: await db.contas.get("conta-1"),
        saldoAtualCentavos: 10000,
      },
    ]);
  });
});

test("calcula o saldo atual de cada conta", async (t) => {
  await comBanco(t, async (db) => {
    await db.contas.bulkAdd([
      criarConta({
        id: "conta-1",
        saldoInicialCentavos: 10000,
      }),
      criarConta({
        id: "conta-2",
        saldoInicialCentavos: 20000,
      }),
    ]);

    await db.efeitosSaldo.bulkAdd([
      criarEfeito({
        id: "efeito-1",
        alvoId: "conta-1",
        valorCentavosAssinado: 2500,
      }),
      criarEfeito({
        id: "efeito-2",
        alvoId: "conta-2",
        valorCentavosAssinado: -3000,
      }),
    ]);

    const contas = await listarContasComSaldo(db);

    assert.deepEqual(
      contas.map(({ conta, saldoAtualCentavos }) => ({
        id: conta.id,
        saldoAtualCentavos,
      })),
      [
        {
          id: "conta-1",
          saldoAtualCentavos: 12500,
        },
        {
          id: "conta-2",
          saldoAtualCentavos: 17000,
        },
      ],
    );
  });
});

test("ignora efeitos revertidos e efeitos de outras contas", async (t) => {
  await comBanco(t, async (db) => {
    await db.contas.add(
      criarConta({
        id: "conta-1",
        saldoInicialCentavos: 10000,
      }),
    );

    await db.efeitosSaldo.bulkAdd([
      criarEfeito({
        id: "efeito-ativo",
        alvoId: "conta-1",
        valorCentavosAssinado: 500,
      }),
      criarEfeito({
        id: "efeito-revertido",
        alvoId: "conta-1",
        valorCentavosAssinado: 9999,
        estado: "revertido",
      }),
      criarEfeito({
        id: "efeito-outra-conta",
        alvoId: "conta-2",
        valorCentavosAssinado: 9999,
      }),
    ]);

    const contas = await listarContasComSaldo(db);

    assert.equal(contas[0].saldoAtualCentavos, 10500);
  });
});

test("retorna uma lista vazia quando não existem contas bancárias", async (t) => {
  await comBanco(t, async (db) => {
    await db.contas.add(
      criarConta({
        id: "carteira-1",
        tipo: "carteira_fisica",
        saldoInicialCentavos: 5000,
      }),
    );

    const contas = await listarContasComSaldo(db);

    assert.deepEqual(contas, []);
  });
});
