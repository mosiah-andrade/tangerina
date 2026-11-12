# T20 — Motor de distribuição

## Objetivo

Calcular a distribuição de uma receita usando regras persistidas, sem alterar dados e sem criar efeitos financeiros. A persistência da receita e das alocações pertence às tasks posteriores.

## Ordem de aplicação

1. Valor fixo.
2. Percentual da receita bruta.
3. Percentual do saldo restante.

Dentro de cada categoria, a ordem explícita da regra é respeitada.

## Regras de integridade

- Todos os valores são centavos inteiros.
- Percentuais usam pontos-base.
- O arredondamento ocorre ao centavo mais próximo; meio centavo é arredondado para cima.
- Nenhuma alocação pode ultrapassar o saldo disponível.
- Uma regra que excede o disponível gera excedente e bloqueia a confirmação.
- O valor não alocado permanece explícito.
- Regras inativas não participam do cálculo.
- O motor é determinístico e não grava dados.

## Critérios de aceite

- Combina regras fixas e percentuais.
- Aplica bases de cálculo corretas.
- Respeita a ordem aprovada.
- Mantém sobra não alocada.
- Detecta excesso sem gravar silenciosamente.
- Possui testes para ordem, arredondamento, regra inativa, excesso e sobra.
