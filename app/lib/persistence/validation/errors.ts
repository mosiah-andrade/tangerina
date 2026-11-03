import type { ValidationIssue, ValidationResult } from "./types.ts";

export class ValidationError extends Error {
  public readonly erros: ValidationIssue[];

  constructor(erros: ValidationIssue[]) {
    super("Os dados informados não passaram pela validação.");
    this.name = "ValidationError";
    this.erros = erros;
  }
}

export function criarErro(
  campo: string,
  codigo: string,
  mensagem: string,
): ValidationIssue {
  return { campo, codigo, mensagem };
}

export function resultadoValido(): ValidationResult {
  return {
    valido: true,
    erros: [],
  };
}

export function resultadoInvalido(erros: ValidationIssue[]): ValidationResult {
  return {
    valido: false,
    erros,
  };
}

export function lancarSeInvalido(resultado: ValidationResult): void {
  if (!resultado.valido) {
    throw new ValidationError(resultado.erros);
  }
}
