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

test("cria, edita e arquiva uma caixinha preservando seu saldo inicial", async () => {
  const db = await prepararBanco();
  try {
    const { criarCaixinha } = await import("../lib/persistence/caixinhas/criar.ts");
    const { editarCaixinha } = await import("../lib/persistence/caixinhas/editar.ts");
    const { arquivarCaixinha } = await import("../lib/persistence/caixinhas/arquivar.ts");

    const criada = await criarCaixinha(db, {
      nome: "Reserva",
      descricao: "Emergências",
      saldoInicialCentavos: 12_500,
      dataSaldoInicial: "2026-11-11",
    });
    const editada = await editarCaixinha(db, criada.id, {
      nome: "Reserva de emergência",
      descricao: null,
    });
    const arquivada = await arquivarCaixinha(db, criada.id);

    assert.equal(editada?.nome, "Reserva de emergência");
    assert.equal(editada?.descricao, undefined);
    assert.equal(editada?.saldoInicialCentavos, 12_500);
    assert.equal(arquivada?.ativa, false);
    assert.equal(arquivada?.id, criada.id);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});

test("calcula o saldo da caixinha sem duplicar efeitos de outros alvos", async () => {
  const db = await prepararBanco();
  try {
    const { criarCaixinha } = await import("../lib/persistence/caixinhas/criar.ts");
    const { calcularSaldoCaixinha } = await import("../lib/persistence/caixinhas/saldo.ts");

    const caixinha = await criarCaixinha(db, {
      nome: "Viagem",
      saldoInicialCentavos: 10_000,
      dataSaldoInicial: "2026-11-11",
    });

    const saldo = calcularSaldoCaixinha(caixinha, [
      { id: "1", movimentoId: "m1", tipoAlvo: "caixinha", alvoId: caixinha.id, valorCentavosAssinado: 2_500, estado: "ativo", createdAt: "2026-11-11T00:00:00.000Z" },
      { id: "2", movimentoId: "m2", tipoAlvo: "conta", alvoId: caixinha.id, valorCentavosAssinado: 9_999, estado: "ativo", createdAt: "2026-11-11T00:00:00.000Z" },
      { id: "3", movimentoId: "m3", tipoAlvo: "caixinha", alvoId: caixinha.id, valorCentavosAssinado: 1_000, estado: "revertido", createdAt: "2026-11-11T00:00:00.000Z" },
    ]);

    assert.equal(saldo, 12_500);
  } finally {
    db.close();
    await db.delete();
    delete globalThis.window;
  }
});
