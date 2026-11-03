# T14-12-03 — Validação de integridade referencial

**Projeto:** Tangerina Financeiro  
**Tarefa:** T14-12-03  
**Status:** Implementação e testes publicados na branch; execução local e integração pendentes  
**Branch:** `feat/t14-12-03-integridade-referencial`  
**Data:** 03/11/2026

## 1. Objetivo

Complementar a validação estrutural da T14-12-02 verificando se referências entre registros persistidos apontam para entidades existentes e compatíveis. A validação consulta o IndexedDB por meio de uma instância `TangerinaDatabase`.

## 2. Contrato

`validarReferencias(tipo, valor, db)` é assíncrona e retorna `Promise<ValidationIssue[]>`. A função não substitui os validadores estruturais: o formato dos IDs, os campos obrigatórios e os enums continuam sob responsabilidade de `validators.ts`.

| Código | Significado |
|---|---|
| `REFERENCE_NOT_FOUND` | A entidade referenciada não existe na tabela esperada |
| `REFERENCE_TYPE_MISMATCH` | O tipo declarado não identifica uma tabela compatível |
| `REFERENCE_INCONSISTENT` | Os registros existem, mas a relação entre eles é incoerente |

## 3. Relacionamentos verificados

| Registro | Referência | Verificação |
|---|---|---|
| Movimento | `contaOrigemId`, `contaDestinoId` | Conta existente |
| Movimento | `caixinhaId` | Caixinha existente |
| EfeitoSaldo | `movimentoId` | Movimento existente |
| EfeitoSaldo | `alvoId` | Conta ou caixinha existente conforme `tipoAlvo` |
| Alocacao | `movimentoId`, `caixinhaId` | Movimento e caixinha existentes |
| Alocacao | `regraDistribuicaoId` | Regra existente e pertencente à mesma caixinha |
| RegraDistribuicao | `caixinhaId` | Caixinha existente |
| Recorrencia | `contaId` | Conta existente |
| ContaPagar | `recorrenciaId`, `movimentoPagamentoId` | Recorrência e movimento existentes |
| Meta | `caixinhaId` | Caixinha existente |
| AporteMeta | `metaId`, `movimentoId` | Meta e movimento existentes |
| Auditoria | `entidadeTipo` + `entidadeId` | Registro existente na tabela correspondente |

Contas e caixinhas arquivadas/inativas permanecem válidas como referências. Campos opcionais não informados não são consultados. Campos presentes com formato incorreto devem ser rejeitados pela validação estrutural.

## 4. Arquivos

- `app/lib/persistence/validation/references.ts`: validação assíncrona dos relacionamentos.
- `app/lib/persistence/validation/README.md`: documentação de uso e limites.
- `app/tests/persistence-references.test.mjs`: testes com IndexedDB simulado por `fake-indexeddb`.

## 5. Cobertura de testes prevista

Os testes cobrem referências existentes e ausentes, alvos de efeito de saldo por tipo, coerência entre alocação e regra, auditoria com resolução dinâmica de tabela, campos opcionais e validade de registros inativos.

## 6. Limites

Esta etapa não:
- impõe combinações condicionais de campos por tipo de movimento;
- verifica saldo disponível ou regras financeiras;
- realiza distribuição, transferência, pagamento, cancelamento ou reversão;
- garante atomicidade ou isolamento entre validação e gravação;
- impede exclusão física por política de negócio.

A existência pode mudar entre a consulta e a gravação. A validação referencial isolada não é uma garantia transacional; operações que exigem consistência concorrente deverão validar e gravar dentro de uma transação apropriada nas etapas seguintes.

## 7. Critérios de conclusão

- [x] Contrato assíncrono de integridade referencial implementado.
- [x] Relacionamentos aprovados mapeados para as tabelas corretas.
- [x] Compatibilidade de tipo de alvo em efeitos de saldo.
- [x] Coerência entre alocação e regra de distribuição.
- [x] Resolução de auditoria pela tabela indicada em `entidadeTipo`.
- [x] Testes automatizados adicionados.
- [ ] Testes, typecheck, lint, formatação e build executados localmente.
- [ ] CI aprovada e pull request integrado.

## 8. Próximo passo

Executar as verificações locais em `app/`, corrigir eventuais problemas e então abrir/revisar o pull request. A T14 permanece em andamento.
