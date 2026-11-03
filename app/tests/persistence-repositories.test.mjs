import assert from "node:assert/strict";
import test from "node:test";
import "fake-indexeddb/auto";

test("repository supports typed insert, lookup, list, update and archive", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { criarRepositorioContas }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/repositories/contas.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  const repositorio = criarRepositorioContas(db);
  const agora = "2026-11-03T12:00:00.000Z";
  const conta = {
    id: "conta-repositorio",
    nome: "Conta inicial",
    tipo: "bancaria",
    saldoInicialCentavos: 12_500,
    dataSaldoInicial: "2026-11-03",
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };

  await repositorio.inserir(conta);
  assert.deepEqual(await repositorio.buscarPorId(conta.id), conta);
  assert.deepEqual(await repositorio.listar(), [conta]);

  const atualizada = await repositorio.atualizar(conta.id, {
    nome: "Conta atualizada",
  });
  assert.equal(atualizada, true);

  const registroAtualizado = await repositorio.buscarPorId(conta.id);
  assert.equal(registroAtualizado?.nome, "Conta atualizada");
  assert.equal(registroAtualizado?.createdAt, agora);
  assert.notEqual(registroAtualizado?.updatedAt, agora);

  assert.equal(await repositorio.atualizar("inexistente", { nome: "x" }), false);
  assert.equal(await repositorio.arquivar(conta.id), true);
  assert.equal((await repositorio.buscarPorId(conta.id))?.ativa, false);
  assert.equal(await repositorio.arquivar("inexistente"), false);

  db.close();
  await db.delete();
  delete globalThis.window;
});

test("repository does not physically delete records or archive entities without ativa", async () => {
  globalThis.window = { indexedDB: globalThis.indexedDB };

  const [{ getDatabase }, { criarRepositorioAuditorias }] = await Promise.all([
    import("../lib/persistence/database.ts"),
    import("../lib/persistence/repositories/auditorias.ts"),
  ]);

  const db = getDatabase();
  await db.delete();
  await db.open();

  const repositorio = criarRepositorioAuditorias(db);
  const auditoria = {
    id: "auditoria-1",
    entidadeTipo: "contas",
    entidadeId: "conta-1",
    acao: "criado",
    createdAt: "2026-11-03T12:00:00.000Z",
  };

  await repositorio.inserir(auditoria);
  await assert.rejects(
    () => repositorio.arquivar(auditoria.id),
    /não possui arquivamento/,
  );
  assert.deepEqual(await repositorio.buscarPorId(auditoria.id), auditoria);

  db.close();
  await db.delete();
  delete globalThis.window;
});
