# T14-13 — Integração das validações à persistência

**Projeto:** Tangerina Financeiro  
**Tarefa:** T14-13 — Integrar validações aos repositórios  
**Subtarefa:** T14-13-01 — Contrato de integração  
**Status:** CONCLUÍDA E INTEGRADA À MAIN  
**PR:** #29 — https://github.com/mosiah-andrade/tangerina/pull/29  
**Merge squash:** `1a0887771e1c2aacb96bcd47b89fb77abdad38e6`  
**Base:** T14 — Camada de Persistência Local

## 1. Objetivo

Garantir que inserções, atualizações e arquivamentos realizados pelos repositórios passem pelas validações estruturais e referenciais já implementadas, antes de qualquer gravação no IndexedDB.

A validação é centralizada na camada de persistência e não substitui as regras financeiras da camada de domínio.

## 2. Fluxo obrigatório

1. Receber o registro.
2. Executar o validador estrutural correspondente à tabela.
3. Se a estrutura for válida, verificar as referências no IndexedDB.
4. Persistir somente quando ambas as validações forem aprovadas.

Se uma validação falhar, lançar `ValidationError` com a lista de problemas. Nenhum registro deve ser gravado naquela operação.

## 3. Comportamento por operação

| Operação | Regra |
|---|---|
| `inserir` | Validar o registro completo e suas referências antes de inserir. |
| `atualizar` | Buscar o registro, aplicar alterações em memória, preservar `id` e `createdAt`, atualizar `updatedAt` quando existente, validar o registro completo e persistir. |
| `arquivar` | Criar a versão com `ativa: false`, atualizar `updatedAt` quando existente, validar e persistir. |
| `buscarPorId` | Somente consulta. |
| `listar` | Somente consulta. |

Atualizações de registros inexistentes retornam `false`. O ID e a data de criação não podem ser alterados por atualização.

## 4. Organização técnica

- `validation/persistence.ts`: mapa central entre tabelas e validadores estruturais, seguido da verificação referencial.
- `repositories/base.ts`: executa a validação antes de inserir, atualizar ou arquivar.
- Repositórios específicos: informam a tabela e o tipo de entidade ao repositório base.

O mapa de validadores cobre as 12 tabelas do contrato `PersistedEntities`. A integração CRUD desta subtarefa se aplica aos oito repositórios existentes com chave `id`. A tabela `metadados` usa `chave` como chave primária e não integra o repositório base genérico de entidades com `id`.

## 5. Limites desta entrega

- Não adiciona regras financeiras de negócio.
- Não altera o contrato das entidades.
- Não implementa transações compostas nem garante atomicidade entre a consulta de referências e a gravação; isso pertence à T14-14.
- Não padroniza todos os erros nativos do IndexedDB; isso pertence à T14-15.
- Não implementa migrações ou backup/restauração.

## 6. Testes e verificações

- 82 testes automatizados aprovados em `npm test`.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- Prettier direcionado aos dois arquivos da task: aprovado.
- A verificação global `npm run format:check` ainda aponta arquivos preexistentes fora do escopo desta entrega.

## 7. Histórico

- Contrato T14-13-01 aprovado pelo usuário em 03/11/2026.
- Implementação integrada aos oito repositórios com chave `id`, com mapa estrutural cobrindo as 12 tabelas.
- PR #29 integrado à `main) via squash em 03/11/2026.
- Commit de merge: `1a0887771e1c2aacb96bcd47b89fb77abdad38e6`.
- T14-13 concluída. A T14 — camada de persistência — permanece em andamento; as demais subtarefas não são concluídas por este merge.
