import assert from "node:assert/strict";
import test from "node:test";
import "fake-indexeddb/auto";

async function prepararBanco() {
  globalThis.window = { indexedDB: globalThis.indexedDB };
  const { TangerinaDatabase } =
    await import("../lib/persistence/database.ts");
  const db = new TangerinaDatabase();
  await db.open();
  return db;
}

async function limparBanco(db) {
  db.close();
  await db.delete();
  delete globalThis.window;
}

test("loads the complete demonstration scenario atomically", async () => {
  const db = await prepararBanco();

  try {
    const { carregarDadosDemonstracao } =
      await import("../lib/persistence/demo/load.ts");
    const { obterEstadoDadosDemonstracao } =
      await import("../lib/persistence/demo/state.ts");

    const resultado = await carregarDadosDemonstracao(db);

    assert.deepEqual(resultado, {
      contas: 2,
      caixinhas: 3,
      movimentos: 3,
      efeitosSaldo: 4,
      alocacoes: 3,
      regrasDistribuicao: 3,
      recorrencias: 1,
      contasPagar: 1,
      metas: 1,
    });

    assert.equal(await db.contas.count(), 2);
    assert.equal(await db.caixinhas.count(), 3);
    assert.equal(await db.movimentos.count(), 3);
    assert.equal(await db.efeitosSaldo.count(), 4);
    assert.equal(await db.alocacoes.count(), 3);
    assert.equal(await db.regrasDistribuicao.count(), 3);
    assert.equal(await db.recorrencias.count(), 1);
    assert.equal(await db.contasPagar.count(), 1);
    assert.equal(await db.metas.count(), 1);

    const estado = await obterEstadoDadosDemonstracao(db);

    assert.equal(estado.status, "loaded");
    assert.match(estado.loadedAt ?? "", /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    await limparBanco(db);
  }
});

test("rolls back the demonstration load when a write fails", async () => {
  const db = await prepararBanco();

  try {
    const { criarDadosDemonstracao } =
      await import("../lib/persistence/demo/seed.ts");
    const { carregarDadosDemonstracao } =
      await import("../lib/persistence/demo/load.ts");

    const dados = criarDadosDemonstracao();
    dados.movimentos.push({ ...dados.movimentos[0] });

    await assert.rejects(
      () => carregarDadosDemonstracao(db, dados),
      /ConstraintError|constraint/i,
    );

    assert.equal(await db.contas.count(), 0);
    assert.equal(await db.caixinhas.count(), 0);
    assert.equal(await db.movimentos.count(), 0);
    assert.equal(await db.efeitosSaldo.count(), 0);
    assert.equal(await db.alocacoes.count(), 0);
    assert.equal(await db.regrasDistribuicao.count(), 0);
    assert.equal(await db.recorrencias.count(), 0);
    assert.equal(await db.contasPagar.count(), 0);
    assert.equal(await db.metas.count(), 0);
  } finally {
    await limparBanco(db);
  }
});

test("resets only the demonstration scenario and its metadata atomically", async () => {
  const db = await prepararBanco();

  try {
    const { carregarDadosDemonstracao } =
      await import("../lib/persistence/demo/load.ts");
    const { resetarDadosDemonstracao } =
      await import("../lib/persistence/demo/reset.ts");
    const { obterEstadoDadosDemonstracao } =
      await import("../lib/persistence/demo/state.ts");

    await carregarDadosDemonstracao(db);

    const resultado = await resetarDadosDemonstracao(db);

    assert.deepEqual(resultado, {
      contas: 2,
      caixinhas: 3,
      movimentos: 3,
      efeitosSaldo: 4,
      alocacoes: 3,
      regrasDistribuicao: 3,
      recorrencias: 1,
      contasPagar: 1,
      metas: 1,
    });

    assert.equal(await db.contas.count(), 0);
    assert.equal(await db.caixinhas.count(), 0);
    assert.equal(await db.movimentos.count(), 0);
    assert.equal(await db.efeitosSaldo.count(), 0);
    assert.equal(await db.alocacoes.count(), 0);
    assert.equal(await db.regrasDistribuicao.count(), 0);
    assert.equal(await db.recorrencias.count(), 0);
    assert.equal(await db.contasPagar.count(), 0);
    assert.equal(await db.metas.count(), 0);

    assert.deepEqual(await obterEstadoDadosDemonstracao(db), {
      status: "not_loaded",
      loadedAt: null,
    });
  } finally {
    await limparBanco(db);
  }
});
