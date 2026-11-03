import assert from "node:assert/strict";
import test from "node:test";
import "fake-indexeddb/auto";

test("database opens, exposes all stores, and preserves data after reopening", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const { getDatabase } = await import("../lib/persistence/database.ts");
  const db = getDatabase();

  assert.equal(getDatabase(), db, "getDatabase returns the shared instance");

  await db.delete();
  await db.open();

  const expectedStores = [
    "contas",
    "caixinhas",
    "movimentos",
    "efeitosSaldo",
    "alocacoes",
    "regrasDistribuicao",
    "contasPagar",
    "recorrencias",
    "metas",
    "aportesMeta",
    "auditorias",
    "metadados",
  ];

  assert.deepEqual(
    db.tables.map((table) => table.name).sort(),
    expectedStores.sort(),
  );

  const contaTeste = {
    id: "conta-teste",
    nome: "Conta de teste",
    tipo: "bancaria",
    saldoInicialCentavos: 0,
    dataSaldoInicial: "2026-11-03",
    ativa: true,
    createdAt: "2026-11-03T12:00:00.000Z",
    updatedAt: "2026-11-03T12:00:00.000Z",
  };

  await db.contas.add(contaTeste);

  db.close();
  await db.open();

  assert.deepEqual(await db.contas.get("conta-teste"), contaTeste);

  db.close();
  await db.delete();
  delete globalThis.window;
});

test("getDatabase rejects access outside the browser (SSR)", async () => {
  delete globalThis.window;

  const { getDatabase } = await import("../lib/persistence/database.ts");

  assert.throws(
    () => getDatabase(),
    /só pode ser acessada no navegador/,
  );
});

test("getDatabase reports when IndexedDB is unavailable", async () => {
  globalThis.window = {};

  const { getDatabase } = await import("../lib/persistence/database.ts");

  assert.throws(
    () => getDatabase(),
    /não oferece suporte ao IndexedDB/,
  );

  delete globalThis.window;
});
