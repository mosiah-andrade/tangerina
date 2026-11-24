import test from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";

import { TangerinaDatabase } from "../lib/persistence/database.ts";
import { criarCaixinha } from "../lib/persistence/caixinhas/criar.ts";
import { calcularSaldoCaixinhaPorAlocacoes } from "../lib/persistence/caixinhas/saldo.ts";
import { cancelarTransferenciaEntreCaixinhas, editarTransferenciaEntreCaixinhas, transferirEntreCaixinhas } from "../lib/persistence/caixinhas/transferir.ts";

async function prepararBanco() {
  const db = new TangerinaDatabase();
  await db.open();

  const origem = await criarCaixinha(db, {
    nome: "Origem",
    saldoInicialCentavos: 10_000,
    dataSaldoInicial: "2026-11-24",
  });
  const destino = await criarCaixinha(db, {
    nome: "Destino",
    saldoInicialCentavos: 2_000,
    dataSaldoInicial: "2026-11-24",
  });

  return { db, origem, destino };
}

async function saldoDaCaixinha(db, caixinha) {
  const alocacoes = await db.alocacoes
    .where("caixinhaId")
    .equals(caixinha.id)
    .toArray();
  return calcularSaldoCaixinhaPorAlocacoes(caixinha, alocacoes);
}

function input(origem, destino, overrides = {}) {
  return {
    caixinhaOrigemId: origem.id,
    caixinhaDestinoId: destino.id,
    valorCentavos: 3_000,
    dataMovimento: "2026-11-24",
    idempotencyKey: "transferencia-teste-001",
    ...overrides,
  };
}

test("registra transferência parcial com saída e entrada vinculadas", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    const resultado = await transferirEntreCaixinhas(db, input(origem, destino));
    const alocacoes = await db.alocacoes
      .where("movimentoId")
      .equals(resultado.movimentoId)
      .toArray();

    assert.equal(alocacoes.length, 2);
    assert.equal(alocacoes.find((item) => item.tipo === "transferencia_saida")?.caixinhaId, origem.id);
    assert.equal(alocacoes.find((item) => item.tipo === "transferencia_entrada")?.caixinhaId, destino.id);
    assert.equal(await saldoDaCaixinha(db, origem), 7_000);
    assert.equal(await saldoDaCaixinha(db, destino), 5_000);
    assert.equal(await db.efeitosSaldo.count(), 0);
    const auditorias = await db.auditorias.toArray();
    assert.equal(
      auditorias.filter((item) => item.entidadeId === resultado.movimentoId).length,
      1,
    );
  } finally {
    await db.delete();
  }
});

test("permite transferir todo o saldo disponível da origem", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    await transferirEntreCaixinhas(
      db,
      input(origem, destino, { valorCentavos: 10_000 }),
    );

    assert.equal(await saldoDaCaixinha(db, origem), 0);
    assert.equal(await saldoDaCaixinha(db, destino), 12_000);
  } finally {
    await db.delete();
  }
});

test("bloqueia transferência quando a origem está negativa ou zerada", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    const alocacoesIniciais = await db.alocacoes.toArray();
    assert.equal(await saldoDaCaixinha(db, origem), 10_000);

    await db.caixinhas.update(origem.id, { saldoInicialCentavos: 0 });
    const origemZerada = await db.caixinhas.get(origem.id);

    await assert.rejects(
      transferirEntreCaixinhas(db, input(origemZerada, destino)),
      /saldo positivo/,
    );

    await db.caixinhas.update(origem.id, { saldoInicialCentavos: -500 });
    const origemNegativa = await db.caixinhas.get(origem.id);

    await assert.rejects(
      transferirEntreCaixinhas(db, input(origemNegativa, destino, { idempotencyKey: "negativa" })),
      /saldo positivo/,
    );
    assert.equal(await db.movimentos.count(), 0);
    assert.equal(await db.alocacoes.count(), alocacoesIniciais.length);
  } finally {
    await db.delete();
  }
});

test("bloqueia valor superior ao saldo disponível da origem", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    await assert.rejects(
      transferirEntreCaixinhas(db, input(origem, destino, { valorCentavos: 10_001 })),
      /não pode exceder o saldo disponível/,
    );
    assert.equal(await db.movimentos.count(), 0);
    assert.equal(await db.alocacoes.count(), 0);
  } finally {
    await db.delete();
  }
});

test("permite receber transferência em destino negativo e ultrapassar o déficit", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    await db.caixinhas.update(destino.id, { saldoInicialCentavos: -5_000 });
    const destinoNegativo = await db.caixinhas.get(destino.id);

    await transferirEntreCaixinhas(
      db,
      input(origem, destinoNegativo, { valorCentavos: 7_000 }),
    );

    assert.equal(await saldoDaCaixinha(db, origem), 3_000);
    assert.equal(await saldoDaCaixinha(db, destinoNegativo), 2_000);
  } finally {
    await db.delete();
  }
});

test("idempotência retorna a mesma transferência sem duplicar registros", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    const dados = input(origem, destino);
    const primeira = await transferirEntreCaixinhas(db, dados);
    const segunda = await transferirEntreCaixinhas(db, dados);

    assert.deepEqual(segunda, primeira);
    assert.equal(await db.movimentos.count(), 1);
    assert.equal(await db.alocacoes.count(), 2);
    assert.equal(await db.auditorias.count(), 1);
  } finally {
    await db.delete();
  }
});

test("rejeita origem igual ao destino, valor inválido e data inválida", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    await assert.rejects(
      transferirEntreCaixinhas(db, input(origem, origem)),
      /diferente/,
    );
    await assert.rejects(
      transferirEntreCaixinhas(db, input(origem, destino, { valorCentavos: 0 })),
      /maior que zero/,
    );
    await assert.rejects(
      transferirEntreCaixinhas(db, input(origem, destino, { dataMovimento: "2026-02-30" })),
      /data da transferência é inválida/,
    );
    assert.equal(await db.movimentos.count(), 0);
  } finally {
    await db.delete();
  }
});


test("edita transferência iniciada pelo registro de saída e atualiza destino e valor", async () => {
  const { db, origem, destino } = await prepararBanco();
  const novoDestino = await criarCaixinha(db, {
    nome: "Novo destino",
    saldoInicialCentavos: 1_000,
    dataSaldoInicial: "2026-11-24",
  });

  try {
    const criada = await transferirEntreCaixinhas(db, input(origem, destino));
    await editarTransferenciaEntreCaixinhas(db, {
      registroId: criada.origemAlocacaoId,
      caixinhaDestinoId: novoDestino.id,
      valorCentavos: 4_000,
      dataMovimento: "2026-11-25",
      descricao: "Transferência revisada",
    });

    assert.equal(await saldoDaCaixinha(db, origem), 6_000);
    assert.equal(await saldoDaCaixinha(db, destino), 2_000);
    assert.equal(await saldoDaCaixinha(db, novoDestino), 5_000);
    const movimento = await db.movimentos.get(criada.movimentoId);
    assert.equal(movimento.valorCentavos, 4_000);
    assert.equal(movimento.dataMovimento, "2026-11-25");
    assert.equal(movimento.descricao, "Transferência revisada");
    const alocacoes = await db.alocacoes.where("movimentoId").equals(criada.movimentoId).toArray();
    assert.equal(alocacoes.filter((item) => item.tipo === "transferencia_saida").length, 1);
    assert.equal(alocacoes.filter((item) => item.tipo === "transferencia_entrada").length, 1);
    assert.equal(alocacoes.find((item) => item.tipo === "transferencia_entrada").caixinhaId, novoDestino.id);
    assert.equal((await db.auditorias.toArray()).filter((item) => item.acao === "editado").length, 1);
  } finally {
    await db.delete();
  }
});

test("bloqueia edição quando o novo valor excede saldo da origem após reversão", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    const criada = await transferirEntreCaixinhas(db, input(origem, destino));
    await db.alocacoes.add({
      id: "saida-adicional",
      createdAt: new Date().toISOString(),
      movimentoId: "movimento-externo",
      caixinhaId: origem.id,
      tipo: "transferencia_saida",
      valorCentavos: 8_000,
    });

    await assert.rejects(
      editarTransferenciaEntreCaixinhas(db, {
        registroId: criada.destinoAlocacaoId,
        caixinhaDestinoId: destino.id,
        valorCentavos: 3_000,
        dataMovimento: "2026-11-24",
      }),
      /excede o saldo disponível/,
    );
    assert.equal((await db.movimentos.get(criada.movimentoId)).valorCentavos, 3_000);
  } finally {
    await db.delete();
  }
});

test("cancelamento pede confirmação se a reversão deixar destino negativo", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    await db.caixinhas.update(destino.id, { saldoInicialCentavos: -1_000 });
    const destinoNegativo = await db.caixinhas.get(destino.id);
    const criada = await transferirEntreCaixinhas(db, input(origem, destinoNegativo));

    const previa = await cancelarTransferenciaEntreCaixinhas(db, {
      registroId: criada.destinoAlocacaoId,
    });
    assert.equal(previa.saldoDestinoProjetadoCentavos, -1_000);
    assert.equal((await db.movimentos.get(criada.movimentoId)).status, "confirmado");

    const cancelada = await cancelarTransferenciaEntreCaixinhas(db, {
      registroId: criada.origemAlocacaoId,
      confirmarSaldoNegativo: true,
    });
    assert.equal(cancelada.saldoDestinoProjetadoCentavos, -1_000);
    assert.equal(await saldoDaCaixinha(db, origem), 10_000);
    assert.equal(await saldoDaCaixinha(db, destinoNegativo), -1_000);
    assert.equal((await db.movimentos.get(criada.movimentoId)).status, "cancelado");
    assert.equal((await db.auditorias.toArray()).filter((item) => item.acao === "cancelado").length, 1);
  } finally {
    await db.delete();
  }
});

test("cancela sem confirmação quando destino permanece não negativo", async () => {
  const { db, origem, destino } = await prepararBanco();

  try {
    const criada = await transferirEntreCaixinhas(db, input(origem, destino));
    await cancelarTransferenciaEntreCaixinhas(db, { registroId: criada.movimentoId });

    assert.equal(await saldoDaCaixinha(db, origem), 10_000);
    assert.equal(await saldoDaCaixinha(db, destino), 2_000);
    assert.equal((await db.movimentos.get(criada.movimentoId)).status, "cancelado");
  } finally {
    await db.delete();
  }
});
