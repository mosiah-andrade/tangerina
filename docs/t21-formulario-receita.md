# T21 — Formulário de receita

## Objetivo

Permitir iniciar o fluxo de registro de uma receita sem persistir efeitos financeiros antes da revisão.

## Campos

- Descrição obrigatória.
- Valor obrigatório e maior que zero.
- Data obrigatória.

## Fluxo

1. Usuário informa os dados.
2. O valor é convertido para centavos inteiros.
3. Um rascunho temporário é criado no navegador.
4. O usuário segue para a revisão da distribuição.
5. Nenhuma movimentação, efeito de saldo ou alocação é persistido nesta task.

## Critérios de aceite

- Registro acessível pelo botão central **Registrar**.
- Validação de campos obrigatórios.
- Valor monetário convertido com a função oficial do domínio.
- Erros aparecem no próprio formulário.
- Layout responsivo e consistente com a marca.
- Nenhuma alteração financeira ocorre antes da confirmação posterior.


## Implementação concluída

A T21 foi concluída e integrada à main.

- Formulário implementado em `/receitas` com descrição, valor e data.
- Valor validado e convertido para centavos inteiros com `parseMoneyToCents`.
- Rascunho temporário armazenado no navegador para continuidade do fluxo em `/receitas/revisar`.
- Nenhuma movimentação, saldo ou alocação é persistido nesta etapa.
- Interface alinhada à identidade visual Tangerina, responsiva e com composição Bento em telas maiores.
- Corrigido o hydration mismatch relacionado ao valor inicial da data.
- Corrigido o lint substituindo a navegação direta do navegador pelo roteamento interno do Next.js.
- Validação manual aprovada e checks de qualidade executados antes do merge.
