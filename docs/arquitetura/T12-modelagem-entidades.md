# T12 — Modelagem de Entidades e Identificadores

**Projeto:** Tangerina Financeiro  
**Etapa:** M1 — Escopo e decisões do produto  
**Tarefa:** T12 — Modelar entidades e identificadores  
**Versão:** 1.0  
**Status:** Especificação documental aprovada pelo usuário  
**Documento-base:** `docs/arquitetura/T5-modelo-dados.md`

## 1. Objetivo

Definir os identificadores, tipos fundamentais, contratos entre entidades e invariantes necessários para implementar o modelo de dados do Tangerina Financeiro.

Este documento complementa o T5. Não substitui o DER aprovado nem declara concluídas a implementação, as migrações ou os testes automatizados.

## 2. Identificadores

Todas as entidades de domínio devem possuir um identificador estável, gerado localmente por UUID.

```ts
export type Id = string;

export interface EntidadeBase {
  id: Id;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}
```

Regras:

- Gerar IDs localmente, sem depender de conexão com servidor.
- Verificar a disponibilidade de `crypto.randomUUID()` no ambiente de execução e disponibilizar uma alternativa compatível, se necessário.
- Utilizar IDs nas relações entre entidades; nunca utilizar a posição de um registro em uma lista como referência.
- Preservar o ID durante edições e cancelamentos.
- Não remover fisicamente registros que sejam necessários para preservar o histórico financeiro.

## 3. Tipos fundamentais

```ts
export type Id = string;
export type Centavos = number;
export type DataISO = string;
export type DateTimeISO = string;
export type PontosBase = number;
```

| Tipo | Regra |
|---|---|
| `Id` | UUID estável |
| `Centavos` | Inteiro seguro, validado antes de persistir |
| `DataISO` | Data civil `YYYY-MM-DD` |
| `DateTimeISO` | Instante em ISO 8601 |
| `PontosBase` | Inteiro; 100 pontos-base representam 1% |

Os aliases TypeScript não garantem validação em tempo de execução. O domínio deve validar datas, intervalos, valores monetários e percentuais.

Valores financeiros persistidos devem utilizar centavos inteiros. Conversões entre reais e centavos devem ocorrer em funções de domínio testadas.

## 4. Tipos específicos

### 4.1. Contas

```ts
export type TipoConta =
  | "bancaria"
  | "carteira_fisica";
```

A carteira física é representada como uma conta, mas não integra o saldo bancário consolidado. O MVP mantém uma carteira física padrão, conforme decisão já registrada em T5.

### 4.2. Movimentações

```ts
export type TipoMovimento =
  | "receita"
  | "despesa"
  | "transferencia_contas"
  | "transferencia_caixinhas"
  | "saque_carteira"
  | "ajuste_conciliacao";

export type StatusMovimento =
  | "rascunho"
  | "confirmado"
  | "cancelado";
```

O movimento é o registro canônico da operação financeira. Campos obrigatórios e opcionais dependem do tipo de movimento e devem ser validados antes da confirmação.

### 4.3. Efeitos de saldo

```ts
export type TipoAlvoSaldo =
  | "conta"
  | "caixinha";

export type EstadoEfeitoSaldo =
  | "ativo"
  | "revertido";
```

`EfeitoSaldo` registra o impacto financeiro de um movimento sobre uma conta ou caixinha. Créditos são positivos e débitos negativos.

Os efeitos de saldo são a representação persistida dos impactos financeiros. Os saldos exibidos são derivados dos saldos iniciais e dos efeitos válidos; caches, caso existam, devem ser reconstruíveis.

### 4.4. Alocações

```ts
export type TipoAlocacao =
  | "credito_receita"
  | "debito_despesa"
  | "transferencia_entrada"
  | "transferencia_saida"
  | "ajuste";
```

A alocação registra a distribuição financeira destinada a uma caixinha, incluindo, quando aplicável, a regra de origem, a ordem de execução e a base de cálculo utilizada.

A alocação não deve aplicar efeitos financeiros por conta própria em duplicidade. A relação exata entre `Alocacao` e `EfeitoSaldo` deve respeitar o contrato definido na seção 6.

### 4.5. Regras de distribuição

```ts
export type TipoCalculoDistribuicao =
  | "valor_fixo"
  | "percentual_receita_bruta"
  | "percentual_saldo_restante";

export type BaseCalculoDistribuicao =
  | "receita_bruta"
  | "saldo_restante";
```

As regras são executadas na ordem configurada. A base de cálculo efetivamente usada e os valores calculados devem permanecer registrados na alocação histórica, mesmo que a regra padrão seja modificada posteriormente.

Percentuais devem utilizar pontos-base ou outra representação inteira explicitamente documentada. Esta especificação adota pontos-base como padrão.

### 4.6. Contas a pagar e recorrências

```ts
export type StatusContaPagar =
  | "pendente"
  | "paga"
  | "cancelada";

export type FrequenciaRecorrencia =
  | "semanal"
  | "mensal"
  | "anual";
```

A lista de frequências acima é provisória. Deve ser validada contra T3 antes da implementação e não é considerada definitiva nesta versão.

A regra de recorrência e cada ocorrência de conta a pagar devem ser entidades distintas. Alterações na regra não devem reescrever ocorrências antigas. A chave da ocorrência deve impedir geração duplicada.

Alterar o status de uma conta a pagar para paga não deve, por si só, criar uma despesa nem aplicar efeitos financeiros. A ocorrência pode ser associada a uma despesa existente ou a uma nova despesa registrada explicitamente.

### 4.7. Metas e aportes

```ts
export type ModoProgressoMeta =
  | "saldo_atual"
  | "aportes_acumulados";
```

No modo `saldo_atual`, o progresso é derivado do saldo da caixinha vinculada, quando houver. No modo `aportes_acumulados`, cada aporte deve possuir origem identificável quando derivado de uma movimentação, impedindo a contagem simultânea do mesmo valor como aporte manual e automático.

### 4.8. Auditoria

```ts
export type AcaoAuditoria =
  | "criado"
  | "editado"
  | "cancelado"
  | "restaurado"
  | "conciliado";
```

A auditoria deve identificar a entidade alterada, seu ID, a ação, o instante e os dados anteriores e posteriores relevantes. A alteração da movimentação e seu registro de auditoria devem ser persistidos atomicamente.

## 5. Contratos entre entidades

As relações devem utilizar IDs estáveis, respeitando o DER de T5.

| Entidade | Relação e regra |
|---|---|
| `Movimento` | Referencia contas de origem e destino quando aplicável |
| `EfeitoSaldo` | Referencia o movimento que originou o efeito |
| `Alocacao` | Referencia o movimento e a caixinha; pode referenciar a regra utilizada |
| `RegraDistribuicao` | Referencia a caixinha de destino |
| `ContaPagar` | Pode referenciar uma recorrência e uma movimentação de pagamento |
| `Recorrencia` | Pode referenciar a conta prevista |
| `AporteMeta` | Referencia uma meta e, quando aplicável, um movimento |
| `Auditoria` | Identifica o tipo e o ID da entidade alterada |

As referências obrigatórias devem apontar para registros existentes. Referências opcionais devem ser identificadas explicitamente. O arquivamento ou cancelamento não deve invalidar o histórico.

## 6. Invariantes financeiros

### 6.1. Alocação e efeito de saldo

- `Movimento` é o registro canônico da operação.
- `Alocacao` registra a destinação virtual do dinheiro.
- `EfeitoSaldo` representa o impacto persistido sobre o saldo de uma conta ou caixinha.
- Uma alocação não pode produzir um segundo débito ou crédito além dos efeitos previstos para a operação.
- Movimento, alocações, efeitos e auditoria aplicável devem ser persistidos na mesma transação lógica.

### 6.2. Confirmação e cancelamento idempotentes

- Uma operação confirmada não pode ser contabilizada novamente por repetição de clique ou reenvio.
- O cancelamento de um movimento confirmado deve neutralizar seus efeitos financeiros uma única vez.
- O registro original e a auditoria devem ser preservados.
- Repetir o cancelamento não pode aplicar nova reversão.
- Uma falha de persistência não pode deixar apenas parte dos efeitos financeiros gravada.

### 6.3. Limites financeiros

- Valores monetários são inteiros em centavos.
- Distribuições não podem ultrapassar o valor disponível.
- Transferências internas não podem ser contabilizadas como receita ou despesa de consumo.
- Despesas e saques que excedam o saldo bancário disponível são bloqueados por padrão.
- Uma despesa pode deixar a caixinha negativa somente após confirmação explícita, respeitando as regras aprovadas em T2.
- A carteira física não pode ficar negativa por meio de uma despesa comum.
- A edição de uma movimentação confirmada deve recalcular os efeitos sem duplicação e manter a auditoria.

### 6.4. Consistência histórica

- Editar uma regra de distribuição não altera as alocações históricas.
- Alterar uma recorrência não reescreve ocorrências anteriores.
- A associação de pagamento a uma conta a pagar não deve duplicar a despesa.
- Aportes originados de movimentos não podem ser contabilizados novamente como aportes manuais.
- IDs e referências históricas devem ser preservados.

## 7. Decisões e pendências

### Decisões aprovadas nesta revisão

1. UUIDs gerados localmente para todas as entidades.
2. Tipos fundamentais: `Id`, `Centavos`, `DataISO`, `DateTimeISO` e `PontosBase`.
3. Tipos específicos aprovados como base, com ressalva para as frequências de recorrência.
4. Relações entre entidades por ID, com referências válidas e histórico preservado.
5. Validação dos invariantes financeiros conforme T2.
6. Detalhamento da relação entre `Alocacao` e `EfeitoSaldo`.
7. Cancelamento idempotente, com neutralização única dos efeitos financeiros.

### Pendências antes da implementação

- Validar a lista de frequências contra T3.
- Definir o contrato técnico exato entre `Alocacao` e `EfeitoSaldo`.
- Definir e testar a estratégia de neutralização dos efeitos no cancelamento.
- Implementar validações de domínio, persistência atômica, migrações e testes automatizados.

## 8. Critérios de conclusão documental

- [x] Identificadores e tipos fundamentais definidos.
- [x] Tipos específicos documentados como base.
- [x] Relações entre entidades especificadas.
- [x] Invariantes financeiros revisados contra T2.
- [x] Pontos que exigem detalhamento identificados.
- [ ] Frequências de recorrência validadas contra T3.
- [x] Documento consolidado aprovado pelo usuário.
- [ ] Conclusão registrada no roadmap após autorização explícita.

## 9. Referências

- `docs/arquitetura/T5-modelo-dados.md`
- `docs/requisitos/T2-regras-financeiras.md`
- `docs/requisitos/T3-criterio-aceitacao.md`
- `tangerina_roadmap.html`

## 10. Limite do status

Esta especificação consolida decisões documentais e requisitos para orientar a implementação. Não declara que o banco, as migrações, as regras de domínio ou os testes estejam implementados ou concluídos.
