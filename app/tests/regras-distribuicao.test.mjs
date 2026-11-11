import test from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import { TangerinaDatabase } from "../lib/persistence/database.ts";
import { criarCaixinha } from "../lib/persistence/caixinhas/criar.ts";
import {
  criarRegraDistribuicao,
  listarRegrasDistribuicao,
  atualizarRegraDistribuicao,
} from "../lib/persistence/distribuicao/regras.ts";

test("cadastra regras de distribuição ordenadas e permite desativação", async () => {
  const db = new TangerinaDatabase();
  await db.open();
  const caixinha = await criarCaixinha(db, {
    nome: "Reserva",
    saldoInicialCentavos: 0,
    dataSaldoInicial: "2026-11-11",
  });

  const percentual = await criarRegraDistribuicao(db, {
    nome: "Reserva",
    caixinhaId: caixinha.id,
    ordem: 2,
    tipoCalculo: "percentual_receita_bruta",
    percentual: 1000,
  });
  await criarRegraDistribuicao(db, {
    nome: "Fixo",
    caixinhaId: caixinha.id,
    ordem: 1,
    tipoCalculo: "valor_fixo",
    valorFixoCentavos: 5000,
  });

  assert.deepEqual((await listarRegrasDistribuicao(db)).map((r) => r.ordem), [1, 2]);

  await atualizarRegraDistribuicao(db, percentual.id, {
    tipoCalculo: "percentual_saldo_restante",
    percentual: 2500,
    ativa: false,
  });

  assert.equal((await listarRegrasDistribuicao(db, false)).length, 1);
  await db.delete();
});
