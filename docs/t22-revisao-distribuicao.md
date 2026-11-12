# T22 — Revisão da distribuição

## Status

Concluída e integrada à `main` pelo PR #55 em 12/11/2026.

## Objetivo

Construir a etapa de revisão entre o formulário de receita (T21) e a confirmação/persistência definitiva (T23).

## Implementado

- rota de revisão da receita;
- leitura do rascunho temporário criado na T21;
- carregamento das regras de distribuição;
- cálculo das sugestões pelo motor determinístico da T20;
- exibição das sugestões por caixinha;
- edição manual dos valores sugeridos;
- resumo da receita, total distribuído e valor não alocado;
- bloqueio de continuidade quando houver inconsistência ou excedente;
- layout responsivo alinhado à identidade visual do Tangerina.

## Regra de persistência

A T22 **não cria uma receita definitiva nem altera saldos, caixinhas ou alocações persistidas**. Nesta etapa, os dados permanecem em revisão/rascunho.

A confirmação e a persistência consistente da receita e de suas alocações pertencem à T23.

## Validação

Os testes manuais do fluxo T21 → T22 foram executados e aprovados antes do PR.

Fluxo validado:

1. registrar receita;
2. preencher descrição, valor e data;
3. seguir para a revisão;
4. visualizar as sugestões calculadas;
5. editar sugestões manualmente;
6. conferir total distribuído e valor não alocado;
7. verificar o bloqueio de inconsistências.

## Integração

PR #55 — `Feat/t22 revisao distribuicao`, integrado à `main`.
