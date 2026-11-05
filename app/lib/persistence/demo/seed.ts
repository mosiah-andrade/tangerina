import type {
  Alocacao,
  Caixinha,
  Conta,
  ContaPagar,
  EfeitoSaldo,
  Meta,
  Movimento,
  Recorrencia,
  RegraDistribuicao,
} from "../entities.ts";

export interface DadosDemonstracao {
  contas: Conta[];
  caixinhas: Caixinha[];
  movimentos: Movimento[];
  efeitosSaldo: EfeitoSaldo[];
  alocacoes: Alocacao[];
  regrasDistribuicao: RegraDistribuicao[];
  recorrencias: Recorrencia[];
  contasPagar: ContaPagar[];
  metas: Meta[];
}

const DATA_REFERENCIA = "2026-11-05";
const AGORA = "2026-11-05T12:00:00.000Z";

const IDS = {
  contaPrincipal: "10000000-0000-4000-8000-000000000001",
  contaReserva: "10000000-0000-4000-8000-000000000002",
  caixinhaEssenciais: "20000000-0000-4000-8000-000000000001",
  caixinhaReserva: "20000000-0000-4000-8000-000000000002",
  caixinhaObjetivos: "20000000-0000-4000-8000-000000000003",
  regraEssenciais: "30000000-0000-4000-8000-000000000001",
  regraReserva: "30000000-0000-4000-8000-000000000002",
  regraObjetivos: "30000000-0000-4000-8000-000000000003",
  movimentoReceita: "40000000-0000-4000-8000-000000000001",
  movimentoDespesa: "40000000-0000-4000-8000-000000000002",
  movimentoTransferencia: "40000000-0000-4000-8000-000000000003",
  efeitoReceita: "50000000-0000-4000-8000-000000000001",
  efeitoDespesa: "50000000-0000-4000-8000-000000000002",
  efeitoTransferenciaSaida: "50000000-0000-4000-8000-000000000003",
  efeitoTransferenciaEntrada: "50000000-0000-4000-8000-000000000004",
  alocacaoEssenciais: "60000000-0000-4000-8000-000000000001",
  alocacaoReserva: "60000000-0000-4000-8000-000000000002",
  alocacaoObjetivos: "60000000-0000-4000-8000-000000000003",
  recorrenciaInternet: "70000000-0000-4000-8000-000000000001",
  contaPagarInternet: "80000000-0000-4000-8000-000000000001",
  metaNotebook: "90000000-0000-4000-8000-000000000001",
} as const;

export function criarDadosDemonstracao(): DadosDemonstracao {
  const contas: Conta[] = [
    {
      id: IDS.contaPrincipal,
      nome: "Conta principal",
      tipo: "bancaria",
      instituicao: "Banco demonstrativo",
      saldoInicialCentavos: 500000,
      dataSaldoInicial: DATA_REFERENCIA,
      ativa: true,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.contaReserva,
      nome: "Reserva bancária",
      tipo: "bancaria",
      instituicao: "Banco demonstrativo",
      saldoInicialCentavos: 200000,
      dataSaldoInicial: DATA_REFERENCIA,
      ativa: true,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  const caixinhas: Caixinha[] = [
    {
      id: IDS.caixinhaEssenciais,
      nome: "Essenciais",
      descricao: "Despesas do dia a dia",
      saldoInicialCentavos: 0,
      dataSaldoInicial: DATA_REFERENCIA,
      cor: "#0B3C2A",
      ativa: true,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.caixinhaReserva,
      nome: "Reserva",
      descricao: "Segurança financeira",
      saldoInicialCentavos: 0,
      dataSaldoInicial: DATA_REFERENCIA,
      cor: "#C59B27",
      ativa: true,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.caixinhaObjetivos,
      nome: "Objetivos",
      descricao: "Planos e conquistas",
      saldoInicialCentavos: 0,
      dataSaldoInicial: DATA_REFERENCIA,
      cor: "#1B523E",
      ativa: true,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  const regrasDistribuicao: RegraDistribuicao[] = [
    {
      id: IDS.regraEssenciais,
      nome: "Essenciais",
      caixinhaId: IDS.caixinhaEssenciais,
      ordem: 1,
      ativa: true,
      tipoCalculo: "percentual_receita_bruta",
      percentual: 5000,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.regraReserva,
      nome: "Reserva",
      caixinhaId: IDS.caixinhaReserva,
      ordem: 2,
      ativa: true,
      tipoCalculo: "percentual_receita_bruta",
      percentual: 3000,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.regraObjetivos,
      nome: "Objetivos",
      caixinhaId: IDS.caixinhaObjetivos,
      ordem: 3,
      ativa: true,
      tipoCalculo: "percentual_receita_bruta",
      percentual: 2000,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  const movimentos: Movimento[] = [
    {
      id: IDS.movimentoReceita,
      tipo: "receita",
      status: "confirmado",
      descricao: "Receita de demonstração",
      valorCentavos: 100000,
      dataMovimento: DATA_REFERENCIA,
      idempotencyKey: "demo-receita-2026-11",
      contaDestinoId: IDS.contaPrincipal,
      confirmedAt: AGORA,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.movimentoDespesa,
      tipo: "despesa",
      status: "confirmado",
      descricao: "Despesa de demonstração",
      valorCentavos: 25000,
      dataMovimento: DATA_REFERENCIA,
      idempotencyKey: "demo-despesa-2026-11",
      contaOrigemId: IDS.contaPrincipal,
      caixinhaId: IDS.caixinhaEssenciais,
      confirmedAt: AGORA,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
    {
      id: IDS.movimentoTransferencia,
      tipo: "transferencia_contas",
      status: "confirmado",
      descricao: "Transferência para reserva",
      valorCentavos: 50000,
      dataMovimento: DATA_REFERENCIA,
      idempotencyKey: "demo-transferencia-2026-11",
      contaOrigemId: IDS.contaPrincipal,
      contaDestinoId: IDS.contaReserva,
      confirmedAt: AGORA,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  const efeitosSaldo: EfeitoSaldo[] = [
    {
      id: IDS.efeitoReceita,
      movimentoId: IDS.movimentoReceita,
      tipoAlvo: "conta",
      alvoId: IDS.contaPrincipal,
      valorCentavosAssinado: 100000,
      estado: "ativo",
      createdAt: AGORA,
    },
    {
      id: IDS.efeitoDespesa,
      movimentoId: IDS.movimentoDespesa,
      tipoAlvo: "conta",
      alvoId: IDS.contaPrincipal,
      valorCentavosAssinado: -25000,
      estado: "ativo",
      createdAt: AGORA,
    },
    {
      id: IDS.efeitoTransferenciaSaida,
      movimentoId: IDS.movimentoTransferencia,
      tipoAlvo: "conta",
      alvoId: IDS.contaPrincipal,
      valorCentavosAssinado: -50000,
      estado: "ativo",
      createdAt: AGORA,
    },
    {
      id: IDS.efeitoTransferenciaEntrada,
      movimentoId: IDS.movimentoTransferencia,
      tipoAlvo: "conta",
      alvoId: IDS.contaReserva,
      valorCentavosAssinado: 50000,
      estado: "ativo",
      createdAt: AGORA,
    },
  ];

  const alocacoes: Alocacao[] = [
    {
      id: IDS.alocacaoEssenciais,
      movimentoId: IDS.movimentoReceita,
      caixinhaId: IDS.caixinhaEssenciais,
      tipo: "credito_receita",
      valorCentavos: 50000,
      regraDistribuicaoId: IDS.regraEssenciais,
      ordemAplicacao: 1,
      baseCalculoCentavos: 100000,
      percentualAplicado: 5000,
      createdAt: AGORA,
    },
    {
      id: IDS.alocacaoReserva,
      movimentoId: IDS.movimentoReceita,
      caixinhaId: IDS.caixinhaReserva,
      tipo: "credito_receita",
      valorCentavos: 30000,
      regraDistribuicaoId: IDS.regraReserva,
      ordemAplicacao: 2,
      baseCalculoCentavos: 100000,
      percentualAplicado: 3000,
      createdAt: AGORA,
    },
    {
      id: IDS.alocacaoObjetivos,
      movimentoId: IDS.movimentoReceita,
      caixinhaId: IDS.caixinhaObjetivos,
      tipo: "credito_receita",
      valorCentavos: 20000,
      regraDistribuicaoId: IDS.regraObjetivos,
      ordemAplicacao: 3,
      baseCalculoCentavos: 100000,
      percentualAplicado: 2000,
      createdAt: AGORA,
    },
  ];

  const recorrencias: Recorrencia[] = [
    {
      id: IDS.recorrenciaInternet,
      descricao: "Internet",
      valorCentavos: 12000,
      diaVencimento: 10,
      dataInicio: DATA_REFERENCIA,
      frequencia: "mensal",
      ativa: true,
      contaId: IDS.contaPrincipal,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  const contasPagar: ContaPagar[] = [
    {
      id: IDS.contaPagarInternet,
      recorrenciaId: IDS.recorrenciaInternet,
      chaveOcorrencia: "internet-2026-11",
      descricao: "Internet",
      valorCentavos: 12000,
      dataVencimento: "2026-11-10",
      status: "pendente",
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  const metas: Meta[] = [
    {
      id: IDS.metaNotebook,
      nome: "Novo notebook",
      valorAlvoCentavos: 500000,
      dataAlvo: "2027-06-30",
      modoProgresso: "saldo_atual",
      caixinhaId: IDS.caixinhaObjetivos,
      ativa: true,
      createdAt: AGORA,
      updatedAt: AGORA,
    },
  ];

  return {
    contas,
    caixinhas,
    movimentos,
    efeitosSaldo,
    alocacoes,
    regrasDistribuicao,
    recorrencias,
    contasPagar,
    metas,
  };
}
