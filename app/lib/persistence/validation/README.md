# Validação da persistência

A camada separa duas responsabilidades:

- **Validação estrutural** (`validators.ts`): verifica formato, tipo, campos obrigatórios, enums, datas, centavos e JSON.
- **Integridade referencial** (`references.ts`): consulta o IndexedDB e verifica se as entidades relacionadas existem e se alguns relacionamentos são coerentes.

## Integridade referencial — T14-12-03

A função assíncrona `validarReferencias(tipo, valor, db)` recebe o nome da tabela, o registro e uma instância aberta de `TangerinaDatabase`. Retorna uma lista de `ValidationIssue`; lista vazia significa que as referências verificadas estão íntegras.

Códigos emitidos:

- `REFERENCE_NOT_FOUND`: registro relacionado não existe.
- `REFERENCE_TYPE_MISMATCH`: tipo da referência não permite determinar uma tabela compatível.
- `REFERENCE_INCONSISTENT`: os registros existem, mas a relação entre eles é incoerente.

Registros inativos/arquivados continuam sendo referências válidas. Campos opcionais ausentes não geram erro. IDs com formato inválido continuam sendo responsabilidade da validação estrutural.

### Relacionamentos cobertos

Movimentos, efeitos de saldo, alocações, regras de distribuição, recorrências, contas a pagar, metas, aportes de meta e auditorias. Efeitos verificam a tabela do alvo conforme `tipoAlvo`; alocações verificam se a regra de distribuição pertence à mesma caixinha; auditorias resolvem a tabela conforme `entidadeTipo`.

### Limites

A validação não impõe requisitos condicionais por tipo de movimento, não verifica saldos, não executa operações financeiras e não oferece garantias transacionais. A consulta deve ser feita dentro do fluxo de persistência apropriado; atomicidade e prevenção de alterações concorrentes serão tratadas na etapa de transações.
