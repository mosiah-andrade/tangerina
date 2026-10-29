# T3 — Critérios de Aceitação e Casos-Limite

**Projeto:** Tangerina Financeiro  
**Etapa:** M1 — Escopo e decisões do produto  
**Tarefa:** T3 — Definir critérios de aceitação e casos-limite  
**Versão:** 1.0  
**Status:** Elaborado para revisão

**Referências:** `briefing_app_financeiro.html`, `briefing_app_financeiro.md`, `docs/requisitos/T1-escopo-mvp.md`, `docs/requisitos/T2-regras-financeiras.md` e `tangerina_roadmap.html`.

> **Importante:** este documento define como o MVP deverá se comportar e como validar esse comportamento. A existência dos critérios não significa que as funcionalidades já estejam implementadas ou testadas.

## 1. Objetivo

Definir resultados observáveis e verificáveis para os principais fluxos do MVP, incluindo casos normais, limites financeiros, recorrências, cancelamentos, dados ausentes, persistência e recuperação de dados.

Os critérios abaixo complementam o briefing e devem orientar a implementação, os testes manuais e os testes automatizados das regras críticas.

## 2. Critérios de aceitação funcionais

- **CA01 — Distribuição de recebimento:** ao registrar um recebimento de R$ 1.000,00, selecionar caixinhas e revisar a sugestão, o sistema deve aumentar o saldo bancário em R$ 1.000,00, atualizar as alocações e exibir como não alocada a diferença entre o recebimento e o total distribuído.
- **CA02 — Regra pontual:** alterar percentual ou valor de uma distribuição somente para o recebimento atual não deve modificar a regra padrão salva na caixinha.
- **CA03 — Excesso de distribuição:** se a soma das destinações ultrapassar o valor disponível, o sistema deve exibir o excesso e impedir a confirmação até que seja corrigido ou resolvido por uma ação explicitamente permitida pelas regras.
- **CA04 — Despesa vinculada:** uma despesa de R$ 100,00 deve reduzir em R$ 100,00 a conta ou carteira de pagamento e a caixinha selecionada, sem registrar duas despesas ou descontar o dinheiro duas vezes.
- **CA05 — Saldo insuficiente:** quando uma despesa ultrapassar o saldo da caixinha, o sistema deve informar o impacto e exigir decisão explícita antes de permitir saldo negativo ou registrar diferença pendente. Uma conta bancária insuficiente deve ser bloqueada por padrão, conforme T2.
- **CA06 — Transferência entre caixinhas:** uma transferência de R$ 50,00 deve reduzir a caixinha de origem e aumentar a de destino em igual valor, sem alterar o saldo bancário consolidado nem receitas ou despesas.
- **CA07 — Transferência entre contas:** uma transferência deve reduzir a conta de origem e aumentar a conta de destino pelo mesmo valor, sem gerar receita ou despesa e sem alterar o saldo bancário consolidado.
- **CA08 — Boleto pago:** confirmar manualmente o pagamento deve atualizar o status e preservar a ocorrência no histórico. A confirmação do boleto não deve lançar automaticamente uma segunda despesa nem descontar a conta bancária.
- **CA09 — Boleto vencido:** um compromisso vencido deve permanecer pendente até que o usuário o regularize manualmente.
- **CA10 — Recorrência:** o sistema deve gerar ocorrências individualizadas, respeitar a data final e preservar as ocorrências anteriores quando a regra for alterada.
- **CA11 — Metas:** o usuário deve poder escolher progresso por saldo atual ou por aportes acumulados. O sistema deve exibir corretamente valor atual, valor-alvo, valor restante e percentual

## 3. Critérios adicionais de aceitação — cobertura T2

Os critérios abaixo complementam CA01–CA11 para cobrir regras financeiras já definidas em T2. Eles especificam comportamentos verificáveis e não alteram as decisões de negócio aprovadas.

- **CA12 — Configuração inicial inconsistente:** quando o total das caixinhas superar o saldo bancário consolidado, o sistema deve bloquear a conclusão, mostrar a diferença exata e exigir correção; não deve criar receita ou despesa fictícia.
- **CA13 — Precisão e arredondamento:** valores devem ser persistidos em centavos inteiros. Cálculos com frações de centavo devem seguir uma regra consistente de arredondamento e nenhuma distribuição pode exceder o valor disponível. Testar valores mínimos e múltiplas regras encadeadas.
- **CA14 — Saque e carteira física:** registrar um saque deve reduzir a conta bancária e aumentar a carteira física pelo mesmo valor, sem gerar despesa de consumo. Despesa paga em dinheiro deve reduzir a carteira e ser contabilizada uma única vez; saque ou despesa acima do saldo de origem deve ser bloqueado por padrão.
- **CA15 — Conciliação com diferença:** antes de confirmar, apresentar saldo registrado, saldo observado e diferença calculada. Ao confirmar um ajuste, exigir justificativa quando aplicável, preservar a movimentação original e registrar a alteração no histórico; cancelar não deve alterar saldos.
- **CA16 — Edição e auditoria:** editar uma movimentação confirmada deve recalcular os efeitos financeiros sem duplicar a operação e registrar valores anteriores e novos, data/hora e efeitos relevantes. O histórico anterior deve permanecer consultável.
- **CA17 — Cancelamento sem efeitos parciais:** cancelar antes da confirmação não deve alterar saldos nem criar movimentação confirmada. Se ocorrer falha durante a gravação, o sistema não deve persistir apenas parte dos efeitos financeiros.
- **CA18 — Confirmação repetida/idempotência:** repetir a confirmação da mesma operação não pode duplicar receita, despesa, transferência, alocações ou ajustes. Transferências internas não podem ser classificadas como receita ou despesa de consumo.
- **CA19 — Exportação e restauração:** a exportação deve gerar arquivo legível e íntegro. Antes da restauração, validar o arquivo e apresentar uma prévia; arquivo inválido deve ser rejeitado sem alterar os dados atuais. Cancelar deve preservar os dados; confirmar deve restaurar os dados de forma consistente e evitar duplicações em importações repetidas.

## 4. Relação com casos de teste T2

| Critério | Casos T2 relacionados |
|---|---|
| CA12 | CT-002 |
| CA13 | CT-001, CT-017 |
| CA14 | CT-010, CT-011, CT-012 |
| CA15 | CT-013 |
| CA16 | CT-015 |
| CA17 | CT-014 |
| CA18 | CT-016 |
| CA19 | CT-018 |

Os critérios CA12–CA19 complementam CA01–CA11. A validação final deve confirmar a correspondência de todos os casos CT-001–CT-018 e das regras RN-001–RN-044 antes de considerar a cobertura documental concluída.
