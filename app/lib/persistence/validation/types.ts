/**
 * Contratos compartilhados pela camada de validação da persistência.
 */

export interface ValidationIssue {
  campo: string;
  codigo: string;
  mensagem: string;
}

export interface ValidationSuccess {
  valido: true;
  erros: [];
}

export interface ValidationFailure {
  valido: false;
  erros: ValidationIssue[];
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export type Validator<T> = (valor: unknown) => ValidationResult;

export type EntityValidatorMap = {
  [K in keyof import("../entities").PersistedEntities]: Validator<
    import("../entities").PersistedEntities[K]
  >;
};
