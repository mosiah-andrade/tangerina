import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import "fake-indexeddb/auto";

async function prepararBanco() {
  globalThis.window = { indexedDB: globalThis.indexedDB };
  const { getDatabase } = await import("../lib/persistence/database.ts");
  const db = getDatabase();
  await db.delete();
  await db.open();
  return db;
}

async function finalizarBanco(db) {
  db.close();
  await db.delete();
  delete globalThis.window;
}

function criarConta(tipo = "bancaria", saldoInicialCentavos = 10_000) {
  const agora = "2026-11-22T12:00:00.000Z";
  return {
    id: randomUUID(),
    nome: tipo === "carteira_fisica" ? "Carteira" : "Conta principal",
    tipo,
    saldoInicialCentavos,
    dataSaldoInicial: "2026-11-22",
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };
}

function criarCaixinha(saldoInicialCentavos = 5_000) {
  const agora = "2026-11-22T12:00:00.000Z";
  return {
    id: randomUUID(),
    nome: "Reserva",
    saldoInicialCentavos,
    dataSaldoInicial: "2026-11-22",
    ativa: true,
    createdAt: agora,
    updatedAt: agora,
  };
}

function entradaDespesa(contaOrigemId, ajustes = {}) {
  return {
    descricao: "Compra de mercado",
    categoria: "Alimentação",
    valorCentavos: 2_500,
    dataMovimento: "2026-11-22",
    contaOrigemId,
    idempotencyKey: randomUUID(),
    ...ajustes,
  };
}

test("registra despesa não alocada, preservando categoria e contabilização única", async () => {
  const db = await prepararBanco();

  try {
    const { confirmarDespesa } = await import("../lib/persistence/despesas/confirmar-despesa.ts");
    const { calcularSaldoConta } = await import("../lib/persistence/contas/saldo.ts");
    const conta = criarConta("bancaria", 10_000);
    await db.contas.add(conta);

    const resultado = await confirmarDespesa(db, entradaDespesa(conta.id));

    const movimento = await db.movimentos.get(resultado.movimentoId);
    const efeitos = await db.efeitosSaldo.toArray();
    const alocacoes = await db.alocacoes.toArray();
    const auditorias = await db.auditorias.toArray();
    const saldo = calcularSaldoConta(conta, efeitos);

    assert.equal(movimento?.tipo, "despesa");
    assert.equal(movimento?.categoria, "Alimentação");
    assert.equal(movimento?.valorCentavos, 2_500);
    assert.equal(movimento?.caixinhaId, undefined);
    assert.equal(efeitos.length, 1);
    assert.equal(efeitos[0].tipoAlvo, "conta");
    assert.equal(efeitos[0].valorCentavosAssinado, -2_500);
    assert.equal(alocacoes.length, 0);
    assert.equal(auditorias.length, 1);
    assert.equal(saldo, 7_500);
  } finally {
    await finalizarBanco(db);
  }
});

test("exige confirmação explícita antes de deixar a caixinha negativa", async () => {
  const db = await prepararBanco();

  try {
    const { confirmarDespesa } = await import("../lib/persistence/despesas/confirmar-despesa.ts");
    const { calcularSaldoCaixinhaPorAlocacoes } = await import("../lib/persistence/caixinhas/saldo.ts");
    const conta = criarConta("bancaria", 20_000);
    const caixinha = criarCaixinha(5_000);
    await db.contas.add(conta);
    await db.caixinhas.add(caixinha);

    const input = entradaDespesa(conta.id, {
      valorCentavos: 7_000,
      caixinhaId: caixinha.id,
    });

    await assert.rejects(
      () => confirmarDespesa(db, input),
      /deixará a caixinha .* negativa/,
    );
    assert.equal(await db.movimentos.count(), 0);
    assert.equal(await db.efeitosSaldo.count(), 0);
    assert.equal(await db.alocacoes.count(), 0);

    const resultado = await confirmarDespesa(db, {
      ...input,
      confirmarCaixinhaNegativa: true,
    });

    const alocacoes = await db.alocacoes.toArray();
    assert.equal(alocacoes.length, 1);
    assert.equal(
      calcularSaldoCaixinhaPorAlocacoes(caixinha, alocacoes),
      -2_000,
    );
    assert.equal(await db.movimentos.count(), 1);
    assert.equal(resultado.movimentoId.length > 0, true);
  } finally {
    await finalizarBanco(db);
  }
});

test("bloqueia despesas acima do saldo bancário ou da carteira física", async () => {
  const db = await prepararBanco();

  try {
    const { confirmarDespesa } = await import("../lib/persistence/despesas/confirmar-despesa.ts");
    const conta = criarConta("bancaria", 1_000);
    const carteira = criarConta("carteira_fisica", 1_000);
    await db.contas.bulkAdd([conta, carteira]);

    await assert.rejects(
      () => confirmarDespesa(db, entradaDespesa(conta.id)),
      /Saldo insuficiente na conta bancária/,
    );
    await assert.rejects(
      () => confirmarDespesa(db, entradaDespesa(carteira.id)),
      /Saldo insuficiente na carteira física/,
    );

    assert.equal(await db.movimentos.count(), 0);
    assert.equal(await db.efeitosSaldo.count(), 0);
  } finally {
    await finalizarBanco(db);
  }
});

test("confirmação repetida com a mesma chave não duplica a despesa", async () => {
  const db = await prepararBanco();

  try {
    const { confirmarDespesa } = await import("../lib/persistence/despesas/confirmar-despesa.ts");
    const conta = criarConta("bancaria", 20_000);
    await db.contas.add(conta);
    const input = entradaDespesa(conta.id);

    const primeira = await confirmarDespesa(db, input);
    const segunda = await confirmarDespesa(db, input);

    assert.equal(segunda.movimentoId, primeira.movimentoId);
    assert.equal(await db.movimentos.count(), 1);
    assert.equal(await db.efeitosSaldo.count(), 1);
    assert.equal(await db.auditorias.count(), 1);

    await assert.rejects(
      () => confirmarDespesa(db, { ...input, valorCentavos: 3_000 }),
      /chave de confirmação já foi utilizada/,
    );
    assert.equal(await db.movimentos.count(), 1);
  } finally {
    await finalizarBanco(db);
  }
});

test("rejeita data inexistente e valor monetário inválido", async () => {
  const db = await prepararBanco();

  try {
    const { confirmarDespesa } = await import("../lib/persistence/despesas/confirmar-despesa.ts");
    const conta = criarConta();
    await db.contas.add(conta);

    await assert.rejects(
      () => confirmarDespesa(db, entradaDespesa(conta.id, { dataMovimento: "2026-02-30" })),
      /data da despesa é inválida/,
    );
    await assert.rejects(
      () => confirmarDespesa(db, entradaDespesa(conta.id, { valorCentavos: 10.5 })),
      /centavos inteiros/,
    );

    assert.equal(await db.movimentos.count(), 0);
  } finally {
    await finalizarBanco(db);
  }
});
