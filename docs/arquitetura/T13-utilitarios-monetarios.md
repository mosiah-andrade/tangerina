# T13 — Utilitários monetários

**Projeto:** Tangerina Financeiro  
**Marco:** M3 — Modelo de dados e persistência local  
**Tarefa:** T13 — Criar utilitários monetários  
**Versão:** 1.0  
**Status:** Especificação aprovada pelo usuário  
**Escopo:** Conversão, validação, operações e formatação de valores monetários.

## 1. Objetivo

Criar uma camada confiável de utilitários monetários. Todos os valores financeiros devem ser representados internamente como números inteiros em centavos. A camada deve evitar erros de precisão, validar entradas e manter as operações previsíveis.

## 2. Princípios

1. Valores monetários são armazenados como inteiros em centavos.
2. Cálculos financeiros não devem depender de operações imprecisas com `number` decimal.
3. Valores monetários devem respeitar `Number.MAX_SAFE_INTEGER`.
4. Entradas inválidas devem gerar erros explícitos.
5. Nenhuma entrada deve ser corrigida silenciosamente.
6. Formatação visual e regras financeiras devem permanecer separadas.
7. Arredondamentos internos seguem a regra comercial definida nesta especificação.

## 3. Organização dos arquivos

```text
app/
├── domain/
│   └── finance/
│       └── money.ts
├── lib/
│   └── format-money.ts
└── tests/
    └── money.test.mjs
```

- `lib/format-money.ts`: formatação visual de valores em reais.
- `domain/finance/money.ts`: conversão, validação e operações financeiras.
- `tests/money.test.mjs`: testes automatizados das regras monetárias.

As regras financeiras permanecem na camada de domínio, sem dependência de componentes visuais.

## 4. Representação monetária

O tipo `Centavos` será representado por `number`, com as seguintes condições:

- Deve ser inteiro seguro.
- Deve aceitar valores positivos, negativos e zero.
- Não deve aceitar `NaN` ou `Infinity`.

| Valor exibido | Representação |
|---|---:|
| R$ 10,00 | 1000 |
| R$ 10,50 | 1050 |
| R$ 0,01 | 1 |
| R$ 0,00 | 0 |
| -R$ 10,50 | -1050 |

## 5. Contratos das funções

### 5.1. `parseMoneyToCents(value)`

Converte uma string monetária no padrão brasileiro para centavos inteiros.

**Entrada:** `string`  
**Saída:** `number` — centavos inteiros.

Entradas aceitas:

| Entrada | Resultado |
|---|---:|
| `"10"` | 1000 |
| `"10,5"` | 1050 |
| `"10,50"` | 1050 |
| `"1.234,56"` | 123456 |
| `"0,01"` | 1 |
| `"-10,50"` | -1050 |

Entradas rejeitadas:

- `"10,123"` — mais de duas casas decimais.
- `"1.2.3"` — separadores inválidos.
- `"10,50,30"` — formato inválido.
- `"R$ abc"` — conteúdo não monetário.
- String vazia ou nula.
- Valores cujo resultado exceda o limite de inteiro seguro.

A função não deve utilizar `parseFloat` para interpretar parcialmente a entrada. A conversão deve ser exata, sem arredondar valores digitados pelo usuário.

### 5.2. `addCents(a, b)`

Soma dois valores em centavos. Recebe valores monetários válidos, retorna centavos inteiros e verifica se o resultado permanece dentro do limite seguro.

### 5.3. `subtractCents(a, b)`

Subtrai dois valores em centavos. Recebe valores monetários válidos, retorna centavos inteiros e verifica se o resultado permanece dentro do limite seguro.

### 5.4. `compareCents(a, b)`

Compara dois valores monetários:

- `-1`: primeiro valor menor que o segundo.
- `0`: valores iguais.
- `1`: primeiro valor maior que o segundo.

### 5.5. `multiplyAndRoundCents(value, multiplierBps)`

Multiplica um valor em centavos por um multiplicador representado em pontos-base e arredonda o resultado.

| Percentual | Pontos-base |
|---|---:|
| 1% | 100 |
| 5% | 500 |
| 10% | 1000 |
| 50% | 5000 |
| 100% | 10000 |

O cálculo deve utilizar intermediários `BigInt`, evitando perda de precisão.

**Regra de arredondamento:** comercial, com metade para longe de zero.

| Resultado intermediário em centavos | Resultado final |
|---|---:|
| 1000,4 | 1000 |
| 1000,5 | 1001 |
| 1000,6 | 1001 |
| -1000,5 | -1001 |

O resultado final deve ser convertido para `number` somente depois da validação do limite seguro.

### 5.6. `assertValidCents(value)`

Valida se um valor representa centavos inteiros válidos. Retorna `void` quando válido e lança erro quando inválido.

## 6. Tratamento de erros

| Situação | Erro esperado |
|---|---|
| Centavos não inteiros | `TypeError` |
| Valor acima do limite seguro | `RangeError` |
| Texto monetário inválido | `TypeError` |
| Soma fora do limite seguro | `RangeError` |
| Subtração fora do limite seguro | `RangeError` |
| Pontos-base inválidos | `RangeError` |
| Entrada vazia ou nula | `TypeError` |
| `NaN` ou `Infinity` | `TypeError` |

Não será permitido corrigir automaticamente entradas inválidas, arredondar valores digitados com mais de duas casas decimais, retornar resultados parciais ou permitir operações que ultrapassem o limite seguro.

## 7. Formatação visual

A função existente `formatMoneyFromCents(cents)` permanecerá em `lib/format-money.ts`.

Responsabilidades:

- Receber centavos inteiros.
- Validar o valor recebido.
- Converter para apresentação em reais.
- Utilizar `Intl.NumberFormat` com localidade `pt-BR` e moeda `BRL`.

A formatação não deverá realizar cálculos financeiros nem substituir as funções da camada de domínio.

## 8. Plano de testes automatizados

A implementação deverá incluir testes para:

### Conversão
- Inteiros e valores decimais brasileiros.
- Separadores de milhar.
- Valores negativos e zero.
- Valores com uma ou duas casas decimais.

### Entradas inválidas
- Texto malformado.
- Campos vazios ou nulos.
- Mais de duas casas decimais.
- Valores fora do limite seguro.
- Entradas que não sejam strings.

### Operações
- Soma e subtração com valores positivos.
- Operações com valores negativos.
- Operações com zero.
- Comparação menor, igual e maior.

### Arredondamento
- Valores abaixo da metade de um centavo.
- Valores exatamente na metade.
- Valores acima da metade.
- Arredondamento positivo e negativo.

### Percentuais
- Cálculos com pontos-base.
- Percentuais usuais e extremos.
- Validação de pontos-base inválidos.

### Limites e segurança
- `Number.MAX_SAFE_INTEGER`.
- Resultados que excedam o limite seguro.
- `NaN` e `Infinity`.
- Operações que produzam resultados inválidos.

### Casos adicionais
- Erros de um centavo em operações de fronteira.
- Distribuições cuja soma nunca ultrapasse o valor de origem.
- Entradas inválidas que nunca produzam resultados parciais.
- Ausência de duplicação ou perda de centavos por imprecisão.

## 9. Critérios de conclusão

A T13 somente poderá ser considerada concluída quando:

- Todas as funções previstas estiverem implementadas.
- Os contratos estiverem respeitados.
- Os testes automatizados cobrirem os cenários definidos.
- Os testes passarem.
- O TypeScript passar na verificação de tipos.
- O ESLint passar.
- O Prettier passar.
- O build de produção passar.
- A separação entre domínio financeiro e formatação visual estiver preservada.
- A documentação estiver registrada e revisada.

## 10. Pontos de atenção para implementação

1. **Limites de pontos-base:** a validação técnica deverá exigir inteiro seguro; os limites de negócio permitidos para cada percentual deverão seguir as regras específicas de distribuição e alocação.
2. **Distribuição de valores:** a garantia de que a soma das alocações nunca ultrapasse o valor de origem deverá ser aplicada também na regra de distribuição do domínio, não apenas nos utilitários monetários.
3. **Recorrência:** frequências e regras permanecem vinculadas à validação das decisões anteriores da T3, sem serem alteradas por esta especificação.

## 11. Limite do status

Esta especificação define contratos e critérios de qualidade. Ela não representa a implementação concluída nem autoriza alterações na branch principal.
