import test from "node:test";
import assert from "node:assert/strict";
import { calcularDistribuicao } from "../domain/finance/distribution.ts";

const regra = (id, ordem, tipoCalculo, extra = {}) => ({
  id,
  ordem,
  ativa: true,
  tipoCalculo,
  ...extra,
});

test("aplica regras na ordem aprovada: fixo, receita bruta e saldo restante", () => {
  const resultado = calcularDistribuicao(100_000, [
    regra("restante", 3, "percentual_saldo_restante", { percentual: 2500 }),
    regra("bruta", 2, "percentual_receita_bruta", { percentual: 1000 }),
    regra("fixa", 1, "valor_fixo", { valorFixoCentavos: 30_000 }),
  ]);

  assert.deepEqual(
    resultado.alocacoes.map((item) => [
      item.regraDistribuicaoId,
      item.valorCentavos,
      item.baseCalculoCentavos,
    ]),
    [
      ["fixa", 30_000, 100_000],
      ["bruta", 10_000, 100_000],
      ["restante", 15_000, 60_000],
    ],
  );
  assert.equal(resultado.totalAlocadoCentavos, 55_000);
  assert.equal(resultado.naoAlocadoCentavos, 45_000);
  assert.equal(resultado.podeConfirmar, true);
});

test("ignora regras inativas", () => {
  const resultado = calcularDistribuicao(10_000, [
    { ...regra("inativa", 1, "valor_fixo", { valorFixoCentavos: 9_000 }), ativa: false },
  ]);
  assert.equal(resultado.totalAlocadoCentavos, 0);
  assert.equal(resultado.naoAlocadoCentavos, 10_000);
});

test("arredonda percentual para o centavo mais próximo", () => {
  const resultado = calcularDistribuicao(101, [
    regra("um-terco", 1, "percentual_receita_bruta", { percentual: 3333 }),
  ]);
  assert.equal(resultado.alocacoes[0].valorCentavos, 34);
  assert.equal(resultado.naoAlocadoCentavos, 67);
});

test("bloqueia confirmação quando uma regra excede o disponível", () => {
  const resultado = calcularDistribuicao(10_000, [
    regra("ok", 1, "valor_fixo", { valorFixoCentavos: 8_000 }),
    regra("excesso", 2, "valor_fixo", { valorFixoCentavos: 5_000 }),
  ]);
  assert.equal(resultado.totalAlocadoCentavos, 8_000);
  assert.equal(resultado.naoAlocadoCentavos, 2_000);
  assert.equal(resultado.excedenteCentavos, 3_000);
  assert.equal(resultado.podeConfirmar, false);
  assert.deepEqual(resultado.alocacoes.map((item) => item.regraDistribuicaoId), ["ok"]);
});

test("nunca ultrapassa a receita disponível e mantém a sobra visível", () => {
  const resultado = calcularDistribuicao(100, [
    regra("bruta", 1, "percentual_receita_bruta", { percentual: 5000 }),
    regra("restante", 2, "percentual_saldo_restante", { percentual: 5000 }),
  ]);
  assert.equal(resultado.totalAlocadoCentavos, 75);
  assert.equal(resultado.naoAlocadoCentavos, 25);
  assert.equal(resultado.excedenteCentavos, 0);
});
