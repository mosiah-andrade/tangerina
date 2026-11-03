import assert from "node:assert/strict";
import test from "node:test";
import "fake-indexeddb/auto";

async function prepararBanco() {
  globalThis.window = { indexedDB: globalThis.indexedDB };
  const { getDatabase } = await import("../lib/persistence/database.ts");
  const db = getDatabase();
  await db.delete();
  await db.open();
  return db;
}

function criarConta(id = "550e8400-e29b-41d4-a716-446655440010") {
  const agora = "2026-11-03T12:00:00.000Z";
  return {
    id,
    nome: "Conta transacional",
    tipo: "bancaria",
    saldoInicialCentavos: 10_000,
    dataSaldoInicial: "2026-11-03",
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };
}

function criarCaixinha(id = "550e8400-e29b-41d4-a716-446655440011") {
  const agora = "2026-11-03T12:00:00.000Z";
  return {
    id,
    nome: "Reserva",
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };
}

test("multi-table transaction commits all writes together", async () => {
  const db = await prepararBanco();

  try {
    const { executarTransacaoPersistencia } =
      await import("../lib/persistence/transactions.ts");

    await executarTransacaoPersistencia(
      db,
      [db.contas, db.caixinhas],
      async () => {
        await db.contas.add(criarConta());
        await db.caixinhas.add(criarCaixinha());
      },
    );

    assert.equal(await db.contas.count(), 1);
    assert.equal(await db.caixinhas.count(), 1);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("multi-table transaction rolls back every write when an operation fails", async () => {
  const db = await prepararBanco();

  try {
    const { executarTransacaoPersistencia } =
      await import("../lib/persistence/transactions.ts");

    await assert.rejects(
      () =>
        executarTransacaoPersistencia(
          db,
          [db.contas, db.caixinhas],
          async () => {
            await db.contas.add(criarConta());
            await db.caixinhas.add(criarCaixinha());
            throw new Error("Falha simulada após a segunda gravação");
          },
        ),
      /Falha simulada/,
    );

    assert.equal(await db.contas.count(), 0);
    assert.equal(await db.caixinhas.count(), 0);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("transaction helper rejects an empty table list", async () => {
  const db = await prepararBanco();

  try {
    const { executarTransacaoPersistencia } =
      await import("../lib/persistence/transactions.ts");

    await assert.rejects(
      () => executarTransacaoPersistencia(db, [], async () => "resultado"),
      /ao menos uma tabela/,
    );
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});
