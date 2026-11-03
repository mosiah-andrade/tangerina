# T14-14 — Transações e atomicidade

**Projeto:** Tangerina Financeiro  
**Tarefa:** T14-14 — Transações e atomicidade  
**Subtarefas:** T14-14-01 — Contrato; T14-14-02 — Especificação técnica  
**Status:** Implementação em desenvolvimento  
**Branch:** `feat/t14-14-transacoes-atomicidade`  
**Base:** T14 — Camada de Persistência Local

## 1. Objetivo

Garantir que cada operação de gravação dos repositórios e cada operação explícita que envolva múltiplas tabelas seja atômica: todas as gravações são confirmadas juntas ou revertidas juntas.

As validações estruturais e referenciais devem ocorrer na mesma transação que realiza a gravação, evitando que as referências mudem entre a verificação e a persistência.

## 2. Decisões aprovadas

- Utilizar transações nativas do Dexie.
- Executar inserção, atualização e arquivamento dentro de transações de escrita.
- Incluir na transação todas as tabelas consultadas pela validação referencial e todas as tabelas gravadas.
- Disponibilizar uma API central para operações atômicas em múltiplas tabelas.
- Propagar falhas sem ocultar exceções, permitindo rollback.
- Não executar chamadas HTTP, temporizadores ou operações externas dentro da transação.
- Não adicionar regras financeiras à camada de persistência.
- Consultas simples (`buscarPorId` e `listar`) permanecem fora das transações de escrita.

## 3. API central

`app/lib/persistence/transactions.ts` exporta:

```ts
executarTransacaoPersistencia<T>(
  db: TangerinaDatabase,
  tabelas: Table[],
  operacao: () => Promise<T>,
): Promise<T>
```

A função exige pelo menos uma tabela, remove referências duplicadas e abre uma transação `rw` do Dexie. Erros são propagados para que a transação seja revertida.

Quem chama a API é responsável por declarar todas as tabelas lidas ou escritas pela operação. Não se deve tentar ampliar o conjunto de tabelas por meio de transações aninhadas.

## 4. Tabelas por entidade

| Entidade | Tabelas incluídas |
|---|---|
| contas | contas |
| caixinhas | caixinhas |
| movimentos | movimentos, contas, caixinhas |
| efeitosSaldo | efeitosSaldo, movimentos, contas, caixinhas |
| alocacoes | alocacoes, movimentos, caixinhas, regrasDistribuicao |
| regrasDistribuicao | regrasDistribuicao, caixinhas |
| recorrencias | recorrencias, contas |
| contasPagar | contasPagar, recorrencias, movimentos |
| metas | metas, caixinhas |
| aportesMeta | aportesMeta, metas, movimentos |
| auditorias | auditorias e todas as tabelas de entidades que podem ser referenciadas |

A tabela `metadados` permanece disponível para transações explícitas futuras, embora não integre o CRUD genérico por possuir chave primária `chave`.

## 5. Integração CRUD

- `inserir`: valida estrutura e referências e executa `add` na mesma transação.
- `atualizar`: busca o registro, aplica alterações, preserva `id` e `createdAt`, atualiza `updatedAt` quando aplicável, valida e executa `put` na mesma transação.
- `arquivar`: busca o registro, aplica `ativa: false), atualiza `updatedAt) quando aplicável, valida e executa `put` na mesma transação.
- Atualização ou arquivamento de registro inexistente retorna `false`, sem gravação.
- `buscarPorId` e `listar` continuam como consultas simples.

## 6. Testes de aceitação

- Operação multi-tabela bem-sucedida confirma todas as gravações.
- Erro após gravações em mais de uma tabela reverte todas elas.
- Lista vazia de tabelas é rejeitada.
- Os testes CRUD existentes continuam cobrindo validação estrutural e referencial.
- Falhas de validação durante atualização não alteram o registro anterior.

## 7. Arquivos da implementação

- `app/lib/persistence/transactions.ts`
- `app/lib/persistence/validation/persistence.ts`
- `app/lib/persistence/repositories/base.ts`
- `app/tests/persistence-transactions.test.mjs`
- `app/lib/persistence/README.md`

## 8. Histórico

- T14-14-01 — contrato aprovado pelo usuário.
- T14-14-02 — especificação técnica aprovada pelo usuário.
- Implementação inicial criada na branch `feat/t14-14-transacoes-atomicidade`.
- Status: aguardando execução dos testes e revisão técnica. A tarefa não está concluída.
