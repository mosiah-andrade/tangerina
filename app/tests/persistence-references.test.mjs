import assert from "node:assert/strict";
import test from "node:test";
import "fake-indexeddb/auto";

test("validates references between persisted entities", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { validarReferencias }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/validation/references.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  try {
    await db.contas.put({ id: "conta-1", ativa: false });
    await db.caixinhas.put({ id: "caixinha-1", ativa: false });
    await db.movimentos.put({ id: "movimento-1" });
    await db.regrasDistribuicao.put({
      id: "regra-1",
      caixinhaId: "caixinha-1",
    });
    await db.recorrencias.put({ id: "recorrencia-1" });
    await db.metas.put({ id: "meta-1" });
    await db.efeitosSaldo.put({ id: "efeito-1" });
    await db.alocacoes.put({ id: "alocacao-1" });
    await db.contasPagar.put({ id: "conta-pagar-1" });
    await db.aportesMeta.put({ id: "aporte-1" });

    const casosValidos = [
      ["movimentos", { contaOrigemId: "conta-1", contaDestinoId: "conta-1", caixinhaId: "caixinha-1" }],
      ["efeitosSaldo", { movimentoId: "movimento-1", tipoAlvo: "conta", alvoId: "conta-1" }],
      ["efeitosSaldo", { movimentoId: "movimento-1", tipoAlvo: "caixinha", alvoId: "caixinha-1" }],
      ["alocacoes", { movimentoId: "movimento-1", caixinhaId: "caixinha-1", regraDistribuicaoId: "regra-1" }],
      ["regrasDistribuicao", { caixinhaId: "caixinha-1" }],
      ["recorrencias", { contaId: "conta-1" }],
      ["contasPagar", { recorrenciaId: "recorrencia-1", movimentoPagamentoId: "movimento-1" }],
      ["metas", { caixinhaId: "caixinha-1" }],
      ["aportesMeta", { metaId: "meta-1", movimentoId: "movimento-1" }],
      ["auditorias", { entidadeTipo: "contas", entidadeId: "conta-1" }],
    ];

    for (const [tipo, registro] of casosValidos) {
      assert.deepEqual(await validarReferencias(tipo, registro, db), [], `falhou: ${tipo}`);
    }
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("reports missing references with a stable error code and field", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { validarReferencias }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/validation/references.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  try {
    const erros = await validarReferencias("movimentos", {
      contaOrigemId: "conta-ausente",
      caixinhaId: "caixinha-ausente",
    }, db);

    assert.deepEqual(erros.map(({ campo, codigo }) => ({ campo, codigo })), [
      { campo: "contaOrigemId", codigo: "REFERENCE_NOT_FOUND" },
      { campo: "caixinhaId", codigo: "REFERENCE_NOT_FOUND" },
    ]);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("checks target type and allocation rule consistency", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { validarReferencias }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/validation/references.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  try {
    await db.contas.put({ id: "conta-1" });
    await db.caixinhas.put({ id: "caixinha-1" });
    await db.caixinhas.put({ id: "caixinha-2" });
    await db.regrasDistribuicao.put({ id: "regra-1", caixinhaId: "caixinha-2" });

    const tipoIncompativel = await validarReferencias("efeitosSaldo", {
      tipoAlvo: "caixinha",
      alvoId: "conta-1",
    }, db);
    assert.equal(tipoIncompativel[0]?.codigo, "REFERENCE_NOT_FOUND");
    assert.equal(tipoIncompativel[0]?.campo, "alvoId");

    const regraIncompativel = await validarReferencias("alocacoes", {
      caixinhaId: "caixinha-1",
      regraDistribuicaoId: "regra-1",
    }, db);
    assert.equal(regraIncompativel[0]?.codigo, "REFERENCE_INCONSISTENT");
    assert.equal(regraIncompativel[0]?.campo, "regraDistribuicaoId");
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("validates audit references according to the declared entity type", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { validarReferencias }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/validation/references.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  try {
    const erros = await validarReferencias("auditorias", {
      entidadeTipo: "metas",
      entidadeId: "meta-inexistente",
    }, db);

    assert.equal(erros.length, 1);
    assert.equal(erros[0]?.campo, "entidadeId");
    assert.equal(erros[0]?.codigo, "REFERENCE_NOT_FOUND");
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("does not require optional references when they are absent", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { validarReferencias }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/validation/references.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  try {
    for (const tipo of [
      "movimentos",
      "efeitosSaldo",
      "alocacoes",
      "recorrencias",
      "contasPagar",
      "metas",
      "aportesMeta",
    ]) {
      assert.deepEqual(await validarReferencias(tipo, {}, db), [], `falhou: ${tipo}`);
    }
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});
