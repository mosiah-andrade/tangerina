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


test("calcula saldo consolidado e não alocado sem dupla contagem das caixinhas", async () => {
  const { calcularResumoDashboard } =
    await import("../lib/persistence/dashboard/resumo.ts");

  const resumo = calcularResumoDashboard({
    contas: [
      {
        id: "conta-1",
        nome: "Principal",
        tipo: "bancaria",
        saldoInicialCentavos: 100_000,
        dataSaldoInicial: "2026-11-11",
        ativa: true,
        createdAt: "2026-11-11T00:00:00.000Z",
        updatedAt: "2026-11-11T00:00:00.000Z",
      },
      {
        id: "conta-2",
        nome: "Arquivada",
        tipo: "bancaria",
        saldoInicialCentavos: 50_000,
        dataSaldoInicial: "2026-11-11",
        ativa: false,
        createdAt: "2026-11-11T00:00:00.000Z",
        updatedAt: "2026-11-11T00:00:00.000Z",
      },
    ],
    caixinhas: [
      {
        id: "caixinha-1",
        nome: "Reserva",
        saldoInicialCentavos: 30_000,
        dataSaldoInicial: "2026-11-11",
        ativa: true,
        createdAt: "2026-11-11T00:00:00.000Z",
        updatedAt: "2026-11-11T00:00:00.000Z",
      },
      {
        id: "caixinha-2",
        nome: "Arquivada",
        saldoInicialCentavos: 10_000,
        dataSaldoInicial: "2026-11-11",
        ativa: false,
        createdAt: "2026-11-11T00:00:00.000Z",
        updatedAt: "2026-11-11T00:00:00.000Z",
      },
    ],
    efeitosSaldo: [
      {
        id: "efeito-1",
        movimentoId: "movimento-1",
        tipoAlvo: "conta",
        alvoId: "conta-1",
        valorCentavosAssinado: 5_000,
        estado: "ativo",
        createdAt: "2026-11-11T00:00:00.000Z",
      },
      {
        id: "efeito-2",
        movimentoId: "movimento-2",
        tipoAlvo: "conta",
        alvoId: "conta-1",
        valorCentavosAssinado: 9_999,
        estado: "revertido",
        createdAt: "2026-11-11T00:00:00.000Z",
      },
    ],
    alocacoes: [
      {
        id: "alocacao-1",
        movimentoId: "movimento-3",
        caixinhaId: "caixinha-1",
        tipo: "credito_receita",
        valorCentavos: 2_500,
        createdAt: "2026-11-11T00:00:00.000Z",
      },
      {
        id: "alocacao-2",
        movimentoId: "movimento-4",
        caixinhaId: "caixinha-1",
        tipo: "debito_despesa",
        valorCentavos: 500,
        createdAt: "2026-11-11T00:00:00.000Z",
      },
    ],
  });

  assert.deepEqual(resumo, {
    patrimonioCentavos: 105_000,
    emCaixinhasCentavos: 32_000,
    naoAlocadoCentavos: 73_000,
  });
});
