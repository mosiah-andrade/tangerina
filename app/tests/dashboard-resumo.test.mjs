import assert from "node:assert/strict";
import test from "node:test";

test("calcula o resumo financeiro do cenário de demonstração", async () => {
  const { criarDadosDemonstracao } =
    await import("../lib/persistence/demo/seed.ts");

  const { calcularResumoDashboard } =
    await import("../lib/persistence/dashboard/resumo.ts");

  const dados = criarDadosDemonstracao();

  const resumo = calcularResumoDashboard(dados);

  assert.deepEqual(resumo, {
    patrimonioCentavos: 775000,
    emCaixinhasCentavos: 100000,
    naoAlocadoCentavos: 675000,
  });
});
