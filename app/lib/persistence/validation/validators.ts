import { criarErro, resultadoInvalido, resultadoValido } from "./errors.ts";
import type { ValidationIssue, ValidationResult } from "./types";

type Registro = Record<string, unknown>;

function validarObjeto(valor: unknown): valor is Registro {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export function validarString(
  valor: unknown,
  campo: string,
  obrigatoria = true,
): ValidationIssue[] {
  if (valor === undefined || valor === null) {
    return obrigatoria
      ? [criarErro(campo, "REQUIRED", "Campo obrigatório.")]
      : [];
  }

  if (typeof valor !== "string") {
    return [criarErro(campo, "INVALID_TYPE", "O campo deve ser um texto.")];
  }

  if (obrigatoria && valor.trim().length === 0) {
    return [criarErro(campo, "EMPTY_STRING", "O campo não pode estar vazio.")];
  }

  return [];
}

export function validarBooleano(
  valor: unknown,
  campo: string,
): ValidationIssue[] {
  return typeof valor === "boolean"
    ? []
    : [criarErro(campo, "INVALID_BOOLEAN", "O campo deve ser booleano.")];
}

export function validarNumeroInteiro(
  valor: unknown,
  campo: string,
  minimo?: number,
  maximo?: number,
): ValidationIssue[] {
  if (typeof valor !== "number" || !Number.isSafeInteger(valor)) {
    return [
      criarErro(
        campo,
        "INVALID_INTEGER",
        "O campo deve ser um número inteiro seguro.",
      ),
    ];
  }

  if (minimo !== undefined && valor < minimo) {
    return [criarErro(campo, "BELOW_MINIMUM", `O valor mínimo é ${minimo}.`)];
  }

  if (maximo !== undefined && valor > maximo) {
    return [criarErro(campo, "ABOVE_MAXIMUM", `O valor máximo é ${maximo}.`)];
  }

  return [];
}

export function validarCentavos(
  valor: unknown,
  campo: string,
  minimo = 0,
): ValidationIssue[] {
  return validarNumeroInteiro(valor, campo, minimo);
}

export function validarPercentual(
  valor: unknown,
  campo: string,
): ValidationIssue[] {
  return validarNumeroInteiro(valor, campo, 0, 10_000);
}

export function validarUUID(valor: unknown, campo: string): ValidationIssue[] {
  if (
    typeof valor !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      valor,
    )
  ) {
    return [
      criarErro(campo, "INVALID_UUID", "O campo deve conter um UUID válido."),
    ];
  }

  return [];
}

export function validarDataISO(
  valor: unknown,
  campo: string,
): ValidationIssue[] {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return [
      criarErro(
        campo,
        "INVALID_DATE",
        "A data deve estar no formato YYYY-MM-DD.",
      ),
    ];
  }

  const data = new Date(`${valor}T00:00:00.000Z`);

  if (
    Number.isNaN(data.getTime()) ||
    data.toISOString().slice(0, 10) !== valor
  ) {
    return [criarErro(campo, "INVALID_DATE", "A data informada não existe.")];
  }

  return [];
}

export function validarDateTimeISO(
  valor: unknown,
  campo: string,
): ValidationIssue[] {
  if (
    typeof valor !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      valor,
    ) ||
    Number.isNaN(Date.parse(valor))
  ) {
    return [
      criarErro(
        campo,
        "INVALID_DATETIME",
        "Informe uma data e hora ISO 8601 com fuso horário.",
      ),
    ];
  }

  return [];
}

export function validarEnum(
  valor: unknown,
  campo: string,
  valoresPermitidos: readonly string[],
): ValidationIssue[] {
  return typeof valor === "string" && valoresPermitidos.includes(valor)
    ? []
    : [
        criarErro(
          campo,
          "INVALID_ENUM",
          `Valor inválido. Valores permitidos: ${valoresPermitidos.join(", ")}.`,
        ),
      ];
}

export function validarCampoOpcional(
  registro: Registro,
  campo: string,
  validador: (valor: unknown, campo: string) => ValidationIssue[],
): ValidationIssue[] {
  if (registro[campo] === undefined) {
    return [];
  }

  return validador(registro[campo], campo);
}

export function validarJSON(valor: unknown, campo: string): ValidationIssue[] {
  try {
    const visitados = new Set<object>();

    function verificar(item: unknown): boolean {
      if (
        item === null ||
        typeof item === "string" ||
        typeof item === "boolean"
      ) {
        return true;
      }

      if (typeof item === "number") {
        return Number.isFinite(item);
      }

      if (typeof item !== "object") {
        return false;
      }

      if (visitados.has(item)) {
        return false;
      }

      visitados.add(item);

      const valido = Array.isArray(item)
        ? item.every(verificar)
        : Object.values(item).every(verificar);

      visitados.delete(item);
      return valido;
    }

    return verificar(valor)
      ? []
      : [
          criarErro(
            campo,
            "INVALID_JSON",
            "O valor deve ser compatível com JSON.",
          ),
        ];
  } catch {
    return [
      criarErro(campo, "INVALID_JSON", "O valor deve ser compatível com JSON."),
    ];
  }
}

export function validarRegistro(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return resultadoInvalido([
      criarErro("", "INVALID_OBJECT", "O registro deve ser um objeto."),
    ]);
  }

  return resultadoValido();
}

function validarEntidadeBase(registro: Registro): ValidationIssue[] {
  return [
    ...validarUUID(registro.id, "id"),
    ...validarDateTimeISO(registro.createdAt, "createdAt"),
    ...validarDateTimeISO(registro.updatedAt, "updatedAt"),
  ];
}

function finalizarValidacao(erros: ValidationIssue[]): ValidationResult {
  return erros.length > 0 ? resultadoInvalido(erros) : resultadoValido();
}

export function validarConta(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarString(valor.nome, "nome"),
    ...validarEnum(valor.tipo, "tipo", ["bancaria", "carteira_fisica"]),
    ...validarCentavos(valor.saldoInicialCentavos, "saldoInicialCentavos"),
    ...validarDataISO(valor.dataSaldoInicial, "dataSaldoInicial"),
    ...validarBooleano(valor.ativa, "ativa"),
    ...validarCampoOpcional(valor, "instituicao", validarString),
  ];

  return finalizarValidacao(erros);
}

export function validarCaixinha(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarString(valor.nome, "nome"),
    ...validarCentavos(valor.saldoInicialCentavos, "saldoInicialCentavos"),
    ...validarDataISO(valor.dataSaldoInicial, "dataSaldoInicial"),
    ...validarBooleano(valor.ativa, "ativa"),
    ...validarCampoOpcional(valor, "descricao", validarString),
    ...validarCampoOpcional(valor, "cor", validarString),
  ];

  return finalizarValidacao(erros);
}

export function validarMovimento(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarEnum(valor.tipo, "tipo", [
      "receita",
      "despesa",
      "transferencia_contas",
      "transferencia_caixinhas",
      "saque_carteira",
      "ajuste_conciliacao",
    ]),
    ...validarEnum(valor.status, "status", [
      "rascunho",
      "confirmado",
      "cancelado",
    ]),
    ...validarString(valor.descricao, "descricao"),
    ...validarCentavos(valor.valorCentavos, "valorCentavos", 1),
    ...validarDataISO(valor.dataMovimento, "dataMovimento"),
    ...validarString(valor.idempotencyKey, "idempotencyKey"),
    ...validarCampoOpcional(valor, "contaOrigemId", validarUUID),
    ...validarCampoOpcional(valor, "contaDestinoId", validarUUID),
    ...validarCampoOpcional(valor, "caixinhaId", validarUUID),
    ...validarCampoOpcional(valor, "confirmedAt", validarDateTimeISO),
    ...validarCampoOpcional(valor, "cancelledAt", validarDateTimeISO),
    ...validarCampoOpcional(valor, "motivoCancelamento", validarString),
  ];

  return finalizarValidacao(erros);
}

export function validarEfeitoSaldo(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarUUID(valor.id, "id"),
    ...validarDateTimeISO(valor.createdAt, "createdAt"),
    ...validarUUID(valor.movimentoId, "movimentoId"),
    ...validarEnum(valor.tipoAlvo, "tipoAlvo", ["conta", "caixinha"]),
    ...validarUUID(valor.alvoId, "alvoId"),
    ...validarNumeroInteiro(
      valor.valorCentavosAssinado,
      "valorCentavosAssinado",
    ),
    ...validarEnum(valor.estado, "estado", ["ativo", "revertido"]),
  ];

  return finalizarValidacao(erros);
}

export function validarAlocacao(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarUUID(valor.id, "id"),
    ...validarDateTimeISO(valor.createdAt, "createdAt"),
    ...validarUUID(valor.movimentoId, "movimentoId"),
    ...validarUUID(valor.caixinhaId, "caixinhaId"),
    ...validarEnum(valor.tipo, "tipo", [
      "credito_receita",
      "debito_despesa",
      "transferencia_entrada",
      "transferencia_saida",
      "ajuste",
    ]),
    ...validarCentavos(valor.valorCentavos, "valorCentavos"),
    ...validarCampoOpcional(valor, "regraDistribuicaoId", validarUUID),
    ...validarCampoOpcional(valor, "ordemAplicacao", (campo, nome) =>
      validarNumeroInteiro(campo, nome, 0),
    ),
    ...validarCampoOpcional(valor, "baseCalculoCentavos", validarCentavos),
    ...validarCampoOpcional(valor, "percentualAplicado", validarPercentual),
  ];

  return finalizarValidacao(erros);
}

export function validarRegraDistribuicao(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarString(valor.nome, "nome"),
    ...validarUUID(valor.caixinhaId, "caixinhaId"),
    ...validarNumeroInteiro(valor.ordem, "ordem", 0),
    ...validarBooleano(valor.ativa, "ativa"),
    ...validarEnum(valor.tipoCalculo, "tipoCalculo", [
      "valor_fixo",
      "percentual_receita_bruta",
      "percentual_saldo_restante",
    ]),
  ];

  if (valor.tipoCalculo === "valor_fixo") {
    erros.push(
      ...validarCentavos(valor.valorFixoCentavos, "valorFixoCentavos"),
    );

    if (valor.percentual !== undefined) {
      erros.push({
        campo: "percentual",
        codigo: "FIELD_NOT_ALLOWED",
        mensagem:
          "O campo percentual não é permitido para regras de valor fixo.",
      });
    }
  } else if (
    valor.tipoCalculo === "percentual_receita_bruta" ||
    valor.tipoCalculo === "percentual_saldo_restante"
  ) {
    erros.push(...validarPercentual(valor.percentual, "percentual"));

    if (valor.valorFixoCentavos !== undefined) {
      erros.push({
        campo: "valorFixoCentavos",
        codigo: "FIELD_NOT_ALLOWED",
        mensagem:
          "O campo valorFixoCentavos não é permitido para regras percentuais.",
      });
    }
  }

  return finalizarValidacao(erros);
}

export function validarRecorrencia(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarString(valor.descricao, "descricao"),
    ...validarCentavos(valor.valorCentavos, "valorCentavos", 1),
    ...validarNumeroInteiro(valor.diaVencimento, "diaVencimento", 1, 31),
    ...validarDataISO(valor.dataInicio, "dataInicio"),
    ...validarCampoOpcional(valor, "dataFim", validarDataISO),
    ...validarString(valor.frequencia, "frequencia"),
    ...validarBooleano(valor.ativa, "ativa"),
    ...validarCampoOpcional(valor, "contaId", validarUUID),
  ];

  return finalizarValidacao(erros);
}

export function validarContaPagar(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarCampoOpcional(valor, "recorrenciaId", validarUUID),
    ...validarString(valor.chaveOcorrencia, "chaveOcorrencia"),
    ...validarString(valor.descricao, "descricao"),
    ...validarCentavos(valor.valorCentavos, "valorCentavos", 1),
    ...validarDataISO(valor.dataVencimento, "dataVencimento"),
    ...validarEnum(valor.status, "status", ["pendente", "paga", "cancelada"]),
    ...validarCampoOpcional(valor, "movimentoPagamentoId", validarUUID),
  ];

  return finalizarValidacao(erros);
}

export function validarMeta(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarEntidadeBase(valor),
    ...validarString(valor.nome, "nome"),
    ...validarCentavos(valor.valorAlvoCentavos, "valorAlvoCentavos", 1),
    ...validarCampoOpcional(valor, "dataAlvo", validarDataISO),
    ...validarEnum(valor.modoProgresso, "modoProgresso", [
      "saldo_atual",
      "aportes_acumulados",
    ]),
    ...validarCampoOpcional(valor, "caixinhaId", validarUUID),
    ...validarBooleano(valor.ativa, "ativa"),
  ];

  return finalizarValidacao(erros);
}

export function validarAporteMeta(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarUUID(valor.id, "id"),
    ...validarUUID(valor.metaId, "metaId"),
    ...validarCampoOpcional(valor, "movimentoId", validarUUID),
    ...validarCentavos(valor.valorCentavos, "valorCentavos", 1),
    ...validarDataISO(valor.data, "data"),
  ];

  return finalizarValidacao(erros);
}
export function validarAuditoria(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarUUID(valor.id, "id"),
    ...validarDateTimeISO(valor.createdAt, "createdAt"),
    ...validarEnum(valor.entidadeTipo, "entidadeTipo", [
      "contas",
      "caixinhas",
      "movimentos",
      "efeitosSaldo",
      "alocacoes",
      "regrasDistribuicao",
      "contasPagar",
      "recorrencias",
      "metas",
      "aportesMeta",
    ]),
    ...validarUUID(valor.entidadeId, "entidadeId"),
    ...validarEnum(valor.acao, "acao", [
      "criado",
      "editado",
      "cancelado",
      "restaurado",
      "conciliado",
    ]),
    ...validarCampoOpcional(valor, "antes", validarJSON),
    ...validarCampoOpcional(valor, "depois", validarJSON),
    ...validarCampoOpcional(valor, "motivo", validarString),
  ];

  return finalizarValidacao(erros);
}

export function validarMetadataRecord(valor: unknown): ValidationResult {
  if (!validarObjeto(valor)) {
    return validarRegistro(valor);
  }

  const erros: ValidationIssue[] = [
    ...validarString(valor.chave, "chave"),
  ];

  if (!Object.hasOwn(valor, "valor")) {
    erros.push(
      criarErro(
        "valor",
        "REQUIRED",
        "O campo valor é obrigatório.",
      ),
    );
  } else {
    erros.push(...validarJSON(valor.valor, "valor"));
  }

  return finalizarValidacao(erros);
}