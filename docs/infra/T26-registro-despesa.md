# T26 — Registro e confirmação de despesas

## Objetivo

Implementar o fluxo de registro de despesas sem aplicar efeitos financeiros antes da confirmação explícita do usuário.

## Escopo implementado na branch `feat/t26-registro-despesa`

- Formulário com descrição, categoria, valor, data e origem do pagamento.
- Origem aceita conta bancária ou carteira física ativa.
- Associação opcional a uma caixinha global.
- Rascunho temporário em `sessionStorage`, sem persistência financeira antes da confirmação.
- Revisão dos dados antes da gravação.
- Categoria armazenada no movimento e na auditoria.
- Persistência atômica do movimento, efeitos de saldo, alocação (quando houver) e auditoria.
- Chave de idempotência preservada durante o fluxo de confirmação.
- Validação do saldo disponível da origem de pagamento.
- Confirmação explícita quando a caixinha ficará negativa.

## Regras financeiras aplicadas

### Origem do pagamento

A origem deve ser uma conta ativa do tipo `bancaria` ou `carteira_fisica`.

A despesa é bloqueada quando o valor supera o saldo disponível da origem. A mensagem informa valor da despesa, saldo disponível e diferença faltante.

### Caixinha opcional

Quando nenhuma caixinha é selecionada, a despesa produz somente um efeito negativo na origem do pagamento. Não é criada alocação de caixinha.

Quando uma caixinha é selecionada, a despesa reduz sua alocação virtual. Se o saldo projetado ficar negativo, a confirmação exige uma ação explícita do usuário. O saldo da origem do pagamento continua sujeito ao bloqueio de insuficiência.

### Contabilização única

A origem do pagamento recebe um único efeito negativo pelo valor da despesa. A caixinha, quando selecionada, recebe um efeito virtual e uma alocação de débito. A alocação não representa uma segunda saída bancária.

### Consistência e idempotência

Movimento, efeitos, alocação e auditoria são gravados em uma única transação Dexie. Repetir a mesma chave com os mesmos dados retorna a movimentação existente; reutilizar a chave com dados diferentes é rejeitado.

## Arquivos envolvidos

- `app/components/registrar-despesa.tsx`
- `app/components/confirmar-despesa.tsx`
- `app/lib/persistence/despesas/confirmar-despesa.ts`
- `app/lib/persistence/entities.ts`
- `app/lib/persistence/validation/validators.ts`
- `app/lib/persistence/caixinhas/saldo.ts`
- `app/lib/persistence/dashboard/resumo.ts`
- `app/tests/persistence-despesas.test.mjs`
- `app/tests/persistence-validation-entities.test.mjs`

## Testes automatizados adicionados

- Despesa sem caixinha e contabilização única.
- Categoria persistida no movimento.
- Confirmação explícita para caixinha negativa.
- Bloqueio de saldo insuficiente em conta bancária.
- Bloqueio de saldo insuficiente em carteira física.
- Idempotência em confirmações repetidas.
- Rejeição de data inexistente e valor que não esteja em centavos inteiros.
- Validação da categoria opcional no contrato de movimento.

## Pendências de validação

Esta documentação registra a implementação na branch, mas não declara a T26 concluída.

Antes da conclusão ainda é necessário:

1. Executar `npm run test`, `npm run typecheck`, `npm run lint` e `npm run build` no diretório `app`.
2. Validar manualmente os fluxos em dispositivos/tamanhos mobile e desktop.
3. Conferir o comportamento com dados existentes e caixinhas arquivadas.
4. Revisar os resultados de CI e do preview.
5. Abrir Pull Request para revisão e aguardar aprovação antes do merge.

## Relação com os requisitos

- T2 RN-001, RN-005, RN-006, RN-020 a RN-025, RN-042 e RN-043.
- T2 CT-006, CT-007, CT-011, CT-012, CT-014 e CT-016.
- T3 CA05, CA06, CA17, CA18 e CA21.

## Distribuição de despesas entre caixinhas

A etapa de registro encaminha para `/despesas/revisar`, que reutiliza a lógica de distribuição e a apresentação da revisão de receitas:

- Lista as caixinhas ativas e suas regras ativas.
- Permite marcar quais caixinhas participam somente desta despesa.
- Recalcula as sugestões considerando exclusivamente as regras das caixinhas selecionadas.
- Mostra cada regra como uma linha independente, com sugestão e valor editável sem alterar a regra persistida.
- Impede que o total distribuído ultrapasse o valor da despesa e apresenta o saldo não alocado.
- Na confirmação, calcula o saldo projetado de cada caixinha e exige confirmação individual quando alguma ficar negativa.
- Persiste um único débito na conta/carteira de origem e os débitos virtuais das caixinhas em uma única transação.
- Consolida regras múltiplas da mesma caixinha em uma alocação final por caixinha.

Arquivos adicionais/atualizados:
- `app/components/revisar-distribuicao-despesa.tsx`
- `app/app/despesas/revisar/page.tsx`
- `app/components/registrar-despesa.tsx`
- `app/components/confirmar-despesa.tsx`
- `app/lib/persistence/despesas/confirmar-despesa.ts`
- `app/tests/persistence-despesas.test.mjs`

A compilação e os testes completos desta revisão ainda precisam ser validados. O primeiro deployment após a inclusão da nova tela revelou um erro de sintaxe na consolidação das alocações; esse erro foi corrigido em `8207db6`, e um novo preview está em execução.
