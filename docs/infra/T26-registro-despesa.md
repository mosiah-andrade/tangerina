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

## Validação final

Em 22/11/2026, o usuário confirmou que os testes manuais da T26 foram aprovados. O check de deployment Vercel associado ao commit final da branch também retornou sucesso. Esta validação manual é registrada conforme confirmação do usuário; não representa execução manual realizada pelo assistente.

Os testes automatizados da suíte, typecheck, lint e build devem ser considerados conforme os checks efetivamente disponíveis no GitHub/Vercel. A integração à `main` será registrada após o merge do Pull Request.

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

O primeiro deployment após a inclusão da nova tela revelou um erro de sintaxe na consolidação das alocações; esse erro foi corrigido em `8207db6`. O deployment final da branch alcançou `READY` e o check Vercel do commit final retornou sucesso.


## Decisão aprovada relacionada a retiradas de caixinhas

A decisão de retirada foi aprovada em 22/11/2026 e documentada normativamente em `docs/requisitos/T2-regras-financeiras.md` (RN-045, RN-046, CT-019, CT-020 e T2-D10).

A retirada não faz parte do fluxo de registro de despesas da T26 e não deve ser implementada como despesa: o usuário selecionará uma caixinha e informará um valor manual; o valor será liberado para o saldo não alocado, sem executar regras de distribuição e sem alterar conta/carteira ou saldo bancário consolidado. O valor não poderá exceder o saldo disponível. A implementação da interface/operação de retirada deverá ser planejada em tarefa própria do roadmap, sem ampliar retroativamente o escopo da T26.

## Situação da T26

A implementação está na branch `feat/t26-registro-despesa` e o preview Vercel associado ao commit `3dc2ccf` chegou ao estado `READY`, indicando que o deployment de preview foi concluído. Não há execução de GitHub Actions registrada para esta branch no momento desta atualização. A validação manual dos cenários descritos na documentação permanece necessária antes de integrar à `main`.


## Correções de consistência e experiência — 24/11/2026

Após validação do usuário, foram identificadas três falhas e aplicadas correções na branch `fix/t26-saldos-caixinhas-despesas`:

1. **Saldo zerado nas caixinhas após carregar demonstração:** a listagem consultava `efeitosSaldo`, enquanto o saldo funcional e a confirmação usam o livro de `alocacoes`. A listagem agora calcula o saldo pelo mesmo livro de alocações. O conjunto de demonstração também passa a incluir os efeitos virtuais de crédito das três caixinhas e o débito da despesa demonstrativa, mantendo os registros de saldo coerentes.
2. **Distribuição de despesas:** cada caixinha participante passa a exibir seu saldo atual na própria seleção da segunda etapa. O painel lateral repetia o valor total da despesa, a distribuição e o não alocado, já apresentados na tela; foi removido e substituído por uma linha compacta com distribuído e não alocado.
3. **Confirmação idempotente sem débito visível:** a chave idempotente anteriormente aceitava uma despesa existente sem comparar as alocações registradas com a distribuição revisada. Agora, antes de retornar sucesso para uma operação já existente, compara os débitos persistidos por caixinha com os débitos esperados. Se houver divergência, interrompe a confirmação com erro explícito em vez de exibir sucesso sem garantir a distribuição.

Arquivos alterados nesta correção:
- `app/lib/persistence/caixinhas/listar.ts`
- `app/lib/persistence/demo/seed.ts`
- `app/components/revisar-distribuicao-despesa.tsx`
- `app/lib/persistence/despesas/confirmar-despesa.ts`
- `app/app/styles/receitas.css`

**Atenção sobre dados de demonstração já carregados:** a atualização do gerador corrige novas cargas do conjunto demonstrativo. Se a rotina de demonstração não sobrescrever dados existentes, os registros antigos do IndexedDB precisarão ser atualizados pela própria rotina de carga/reconciliação, sem limpar os dados do usuário.


## Simplificação da distribuição e conferência — 24/11/2026

Aprovada pelo usuário a simplificação das etapas de distribuição e confirmação:

- A lista de caixinhas tornou-se o próprio checklist de participação e distribuição. Cada item mostra saldo atual, seleção e campo único para informar o valor destinado àquela caixinha.
- As regras ativas continuam servindo como sugestão inicial agregada por caixinha; a edição do valor é pontual e não altera regras salvas.
- A distribuição é consolidada por caixinha antes de avançar para a confirmação, preservando uma única alocação/débito por caixinha.
- A tela final foi enxugada: categoria, origem e data aparecem em uma linha compacta; a distribuição é listada sem painel lateral repetitivo.
- A conferência de saldo negativo mostra somente as caixinhas que ficarão negativas, com saldo atual, saldo projetado e confirmação individual.
- Totais distribuído/não alocado e botão de confirmação ficam em um rodapé único.

Arquivos:
- `app/components/revisar-distribuicao-despesa.tsx`
- `app/components/confirmar-despesa.tsx`
- `app/app/styles/receitas.css`

A confirmação individual de saldo negativo, a gravação somente após confirmação final e a idempotência da operação permanecem preservadas.
