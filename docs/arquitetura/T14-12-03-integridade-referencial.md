# T14-12-03 — Validação de integridade referencial

**Projeto:** Tangerina Financeiro  
**Tarefa:** T14-12-03  
**Status:** Concluída e integrada à `main` (merge do PR #28 confirmado pelo usuário)  
**Branch:** `feat/t14-12-03-integridade-referencial`  
**Pull Request:** [#28 — feat(persistence): adicionar validação de integridade referencial](https://github.com/mosiah-andrade/tangerina/pull/28) — integrado à `main` em 03/11/2026  
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

## 7. Verificações e critérios de conclusão

- [x] Contrato assíncrono de integridade referencial implementado.
- [x] Relacionamentos aprovados mapeados para as tabelas corretas.
- [x] Compatibilidade de tipo de alvo em efeitos de saldo.
- [x] Coerência entre alocação e regra de distribuição.
- [x] Resolução de auditoria pela tabela indicada em `entidadeTipo`.
- [x] Testes automatizados adicionados.
- [x] `npm test`: 80 testes aprovados, 0 falhas.
- [x] `npm run typecheck` aprovado.
- [x] `npm run lint` aprovado.
- [x] `npm run build` aprovado.
- [ ] `npm run format:check` global: não confirmado nesta etapa; os três arquivos novos/alterados da T14-12-03 foram formatados individualmente com Prettier.
- [x] Pull request #28 integrado à `main` (merge confirmado pelo usuário).

## 8. Encerramento

A T14-12-03 está concluída e integrada à `main`. A validação estrutural da T14-12-02 e a validação referencial desta etapa permanecem separadas: a primeira verifica formato e estrutura; a segunda verifica existência e coerência das relações entre registros.

A T14 como um todo permanece em andamento, pois ainda há outras entregas da camada de persistência previstas no roadmap.
