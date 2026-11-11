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

test("creates and persists an active bank account", async () => {
  const db = await prepararBanco();

  try {
    const { criarContaBancaria } =
      await import("../lib/persistence/contas/criar.ts");

    const conta = await criarContaBancaria(db, {
      nome: "Conta principal",
      instituicao: "Banco Tangerina",
      saldoInicialCentavos: 12_500,
      dataSaldoInicial: "2026-11-11",
    });

    assert.match(
      conta.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    assert.equal(conta.nome, "Conta principal");
    assert.equal(conta.tipo, "bancaria");
    assert.equal(conta.instituicao, "Banco Tangerina");
    assert.equal(conta.saldoInicialCentavos, 12_500);
    assert.equal(conta.dataSaldoInicial, "2026-11-11");
    assert.equal(conta.ativa, true);
    assert.equal(conta.createdAt, conta.updatedAt);
    assert.deepEqual(await db.contas.get(conta.id), conta);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("allows a bank account without institution", async () => {
  const db = await prepararBanco();

  try {
    const { criarContaBancaria } =
      await import("../lib/persistence/contas/criar.ts");

    const conta = await criarContaBancaria(db, {
      nome: "Conta sem instituição",
      saldoInicialCentavos: 0,
      dataSaldoInicial: "2026-11-11",
    });

    assert.equal(conta.instituicao, undefined);
    assert.equal(await db.contas.count(), 1);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("does not persist a bank account with invalid initial balance", async () => {
  const db = await prepararBanco();

  try {
    const { criarContaBancaria } =
      await import("../lib/persistence/contas/criar.ts");

    await assert.rejects(
      () =>
        criarContaBancaria(db, {
          nome: "Conta inválida",
          saldoInicialCentavos: -1,
          dataSaldoInicial: "2026-11-11",
        }),
      (erro) =>
        erro.name === "ValidationError" &&
        erro.erros.some(
          (item) =>
            item.campo === "saldoInicialCentavos" &&
            item.codigo === "BELOW_MINIMUM",
        ),
    );

    assert.equal(await db.contas.count(), 0);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});
