import assert from "node:assert/strict";
import test from "node:test";
import "fake-indexeddb/auto";

const ids = {
  conta: "550e8400-e29b-41d4-a716-446655440000",
  contaDestino: "550e8400-e29b-41d4-a716-446655440001",
  movimento: "550e8400-e29b-41d4-a716-446655440002",
  auditoria: "550e8400-e29b-41d4-a716-446655440003",
};

async function prepararBanco() {
  globalThis.window = { indexedDB: globalThis.indexedDB };
  const { getDatabase } = await import("../lib/persistence/database.ts");
  const db = getDatabase();
  await db.delete();
  await db.open();
  return db;
}

function criarConta(id = ids.conta) {
  const agora = "2026-11-03T12:00:00.000Z";
  return {
    id,
    nome: "Conta inicial",
    tipo: "bancaria",
    saldoInicialCentavos: 12_500,
    dataSaldoInicial: "2026-11-03",
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };
}

test("repository validates insert, lookup, list, update and archive", async () => {
  const db = await prepararBanco();

  try {
    const { criarRepositorioContas } =
      await import("../lib/persistence/repositories/contas.ts");
    const repositorio = criarRepositorioContas(db);
    const conta = criarConta();

    await repositorio.inserir(conta);
    assert.deepEqual(await repositorio.buscarPorId(conta.id), conta);
    assert.deepEqual(await repositorio.listar(), [conta]);

    const atualizada = await repositorio.atualizar(conta.id, {
      nome: "Conta atualizada",
    });
    assert.equal(atualizada, true);

    const registroAtualizado = await repositorio.buscarPorId(conta.id);
    assert.equal(registroAtualizado?.nome, "Conta atualizada");
    assert.equal(registroAtualizado?.createdAt, conta.createdAt);
    assert.notEqual(registroAtualizado?.updatedAt, conta.updatedAt);

    await assert.rejects(
      () => repositorio.atualizar(conta.id, { saldoInicialCentavos: -1 }),
      (erro) =>
        erro.name === "ValidationError" &&
        erro.erros.some((item) => item.codigo === "BELOW_MINIMUM"),
    );
    assert.equal(
      (await repositorio.buscarPorId(conta.id))?.saldoInicialCentavos,
      12_500,
    );

    assert.equal(
      await repositorio.atualizar(ids.contaDestino, { nome: "inexistente" }),
      false,
    );
    assert.equal(await repositorio.arquivar(conta.id), true);
    assert.equal((await repositorio.buscarPorId(conta.id))?.ativa, false);
    assert.equal(await repositorio.arquivar(ids.contaDestino), false);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("repository rejects structurally invalid records before insertion", async () => {
  const db = await prepararBanco();

  try {
    const { criarRepositorioContas } =
      await import("../lib/persistence/repositories/contas.ts");
    const repositorio = criarRepositorioContas(db);

    await assert.rejects(
      () => repositorio.inserir({ ...criarConta(), id: "id-invalido" }),
      (erro) =>
        erro.name === "ValidationError" &&
        erro.erros.some((item) => item.codigo === "INVALID_UUID"),
    );
    assert.equal(await db.contas.count(), 0);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("repository rejects records with missing references", async () => {
  const db = await prepararBanco();

  try {
    const { criarRepositorioMovimentos } =
      await import("../lib/persistence/repositories/movimentos.ts");
    const repositorio = criarRepositorioMovimentos(db);
    const agora = "2026-11-03T12:00:00.000Z";

    await assert.rejects(
      () =>
        repositorio.inserir({
          id: ids.movimento,
          tipo: "despesa",
          status: "rascunho",
          descricao: "Despesa de teste",
          valorCentavos: 500,
          dataMovimento: "2026-11-03",
          idempotencyKey: "despesa-teste-1",
          contaOrigemId: ids.conta,
          createdAt: agora,
          updatedAt: agora,
        }),
      (erro) =>
        erro.name === "ValidationError" &&
        erro.erros.some(
          (item) =>
            item.campo === "contaOrigemId" &&
            item.codigo === "REFERENCE_NOT_FOUND",
        ),
    );
    assert.equal(await db.movimentos.count(), 0);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("repository allows valid references and validates audit records", async () => {
  const db = await prepararBanco();

  try {
    const [
      { criarRepositorioContas },
      { criarRepositorioMovimentos },
      { criarRepositorioAuditorias },
    ] = await Promise.all([
      import("../lib/persistence/repositories/contas.ts"),
      import("../lib/persistence/repositories/movimentos.ts"),
      import("../lib/persistence/repositories/auditorias.ts"),
    ]);

    const contas = criarRepositorioContas(db);
    const movimentos = criarRepositorioMovimentos(db);
    const auditorias = criarRepositorioAuditorias(db);
    await contas.inserir(criarConta());

    const movimento = {
      id: ids.movimento,
      tipo: "despesa",
      status: "rascunho",
      descricao: "Despesa com referência válida",
      valorCentavos: 500,
      dataMovimento: "2026-11-03",
      idempotencyKey: "despesa-referencia-valida-1",
      contaOrigemId: ids.conta,
      createdAt: "2026-11-03T12:00:00.000Z",
      updatedAt: "2026-11-03T12:00:00.000Z",
    };
    await movimentos.inserir(movimento);
    assert.deepEqual(await movimentos.buscarPorId(ids.movimento), movimento);

    const auditoria = {
      id: ids.auditoria,
      entidadeTipo: "contas",
      entidadeId: ids.conta,
      acao: "criado",
      createdAt: "2026-11-03T12:00:00.000Z",
    };

    await auditorias.inserir(auditoria);
    assert.deepEqual(await auditorias.buscarPorId(auditoria.id), auditoria);

    await assert.rejects(
      () => auditorias.arquivar(auditoria.id),
      /não possui arquivamento/,
    );
    assert.deepEqual(await auditorias.buscarPorId(auditoria.id), auditoria);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});
