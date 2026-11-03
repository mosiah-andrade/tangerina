# T14-13 — Integração das validações à persistência

**Projeto:** Tangerina Financeiro  
**Tarefa:** T14-13 — Integrar validações aos repositórios  
**Subtarefa:** T14-13-01 — Contrato de integração  
**Status:** Implementação submetida ao PR #29; aguardando revisão e merge  
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

## 6. Testes previstos

- Inserção estruturalmente inválida é rejeitada e não persiste.
- Inserção com referência inexistente é rejeitada e não persiste.
- Inserção com referência válida é aceita.
- Atualização valida o registro completo após aplicar as alterações.
- Atualização inválida preserva o registro anterior.
- Atualização preserva `id` e `createdAt`, atualizando `updatedAt`.
- Arquivamento passa pelas validações.
- Consultas não executam gravações nem validações desnecessárias.
- Testes CRUD e demais testes existentes permanecem aprovados.

## 7. Histórico

- Contrato T14-13-01 aprovado pelo usuário em 03/11/2026.
- Implementação integrada aos oito repositórios e testes ampliados na branch `feat/t14-13-integrar-validacoes`.
- Verificações executadas: `npm test` (82 testes aprovados), `npm run typecheck`, `npm run lint` e `npm run build` (todos aprovados).
- Arquivos alterados da T14-13 verificados com Prettier; a verificação global ainda aponta problemas em arquivos fora do escopo desta task.
- PR #29 aberto para revisão: https://github.com/mosiah-andrade/tangerina/pull/29.
- Status atual: aguardando revisão e merge. A tarefa ainda não está concluída.
