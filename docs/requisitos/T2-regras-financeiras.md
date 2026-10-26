# T2 — Regras de negócio financeiras

**Projeto:** Tangerina Financeiro  
**Documento:** T2 — Regras de negócio financeiras  
**Versão:** 1.0  
**Status:** Regras aprovadas para orientar o desenvolvimento  
**Objetivo:** Definir as regras de negócio, os invariantes financeiros e os comportamentos esperados das movimentações do sistema.

---

## 1. Objetivo

Este documento especifica o comportamento financeiro esperado do Tangerina Financeiro para:

- Contas bancárias e saldos.
- Caixinhas.
- Configuração inicial.
- Receitas e distribuição automática.
- Despesas.
- Transferências.
- Carteira de dinheiro físico.
- Conciliação de saldos.
- Arredondamento.
- Edição e cancelamento de movimentações.
- Auditoria e prevenção de duplicidade.

Toda implementação deverá preservar as regras aqui definidas. Caso uma necessidade futura exija comportamento diferente, a alteração deverá ser documentada e aprovada antes de modificar a regra.

## 2. Conceitos e definições

### 2.1. Conta bancária

Representa uma conta na qual o usuário acompanha o saldo bancário registrado.

### 2.2. Saldo bancário consolidado

É a soma dos saldos registrados de todas as contas bancárias ativas consideradas no cálculo.

**Fórmula:**

`Saldo bancário consolidado = soma dos saldos das contas bancárias`

### 2.3. Caixinha

É uma alocação virtual de dinheiro destinada a uma finalidade, como reserva, lazer ou despesas da casa.

Uma caixinha não é uma conta bancária e não representa dinheiro adicional.

### 2.4. Saldo total das caixinhas

É a soma dos saldos de todas as caixinhas.

Uma caixinha pode apresentar saldo negativo quando uma despesa autorizada ultrapassar seu saldo disponível.

### 2.5. Saldo não alocado

É a diferença entre o saldo bancário consolidado e o total alocado nas caixinhas.

`Saldo não alocado = saldo bancário consolidado − saldo total das caixinhas`

O saldo não alocado não deve ser apresentado isoladamente como garantia de dinheiro disponível para gastar. Caixinhas negativas podem alterar a interpretação do valor.

### 2.6. Carteira física

Representa o dinheiro em espécie que o usuário retirou de uma conta bancária e ainda não gastou.

A carteira física é controlada separadamente dos saldos bancários.

### 2.7. Movimentação

É uma operação financeira registrada, como receita, despesa, transferência, saque ou ajuste de conciliação.

### 2.8. Auditoria

É o registro histórico das alterações relevantes feitas em movimentações, incluindo valores anteriores e novos, data e hora e efeitos financeiros.

## 3. Invariantes financeiros

### RN-001 — Representação monetária

Os valores financeiros persistidos devem ser representados em centavos inteiros.

O sistema deve validar os valores digitados e convertê-los de forma consistente. Valores inválidos não podem ser aceitos como movimentações financeiras.

### RN-002 — Saldo bancário consolidado

O saldo bancário consolidado é calculado pela soma dos saldos das contas bancárias.

Uma transferência entre contas bancárias reduz o saldo de uma conta e aumenta o da outra pelo mesmo valor, sem alterar o total consolidado.

### RN-003 — Caixinhas são alocações virtuais

As caixinhas representam destinações do dinheiro e não aumentam o patrimônio nem o saldo bancário.

Uma transferência entre caixinhas altera somente os saldos das caixinhas envolvidas.

### RN-004 — Saldo não alocado

O saldo não alocado deve ser calculado conforme a fórmula definida neste documento.

O sistema deve deixar claro que esse valor não substitui a visualização dos saldos bancários, das caixinhas negativas e dos compromissos financeiros.

### RN-005 — Contabilização única

Cada receita ou despesa deve produzir seus efeitos financeiros uma única vez.

Transferências internas não podem ser contabilizadas como receitas ou despesas de consumo.

### RN-006 — Consistência da operação

A movimentação, os registros de auditoria aplicáveis e os efeitos nos saldos devem ser persistidos de forma consistente.

Se uma operação falhar, o sistema não deve deixar apenas parte de seus efeitos financeiros aplicada.

## 4. Configuração inicial

### RN-007 — Cadastro dos saldos iniciais

Durante a configuração inicial, o usuário pode registrar:

- Contas bancárias.
- Saldos iniciais das contas.
- Caixinhas.
- Saldos iniciais das caixinhas.

### RN-008 — Total das caixinhas superior ao saldo bancário

Se o total inicial das caixinhas for maior que o saldo bancário consolidado, o sistema deve bloquear a conclusão da configuração.

A interface deve apresentar a diferença exata e solicitar a correção dos valores.

### RN-009 — Total das caixinhas inferior ao saldo bancário

Se o total das caixinhas for menor que o saldo bancário consolidado, o sistema pode concluir a configuração.

A diferença deve ser apresentada como saldo não alocado.

### RN-010 — Totais iguais e valores zero

A configuração pode ser concluída quando o saldo bancário consolidado for igual ao total das caixinhas.

Saldos iniciais iguais a zero são válidos. Valores negativos ou inválidos na configuração inicial devem ser tratados conforme as validações definidas para cada tipo de saldo.

### RN-011 — Não criar movimentações fictícias

O sistema não deve gerar receitas ou despesas fictícias apenas para fazer os saldos coincidirem.

Divergências posteriores devem ser tratadas por procedimentos explícitos de ajuste ou conciliação, preservando o histórico original.

## 5. Receitas e distribuição

### RN-012 — Dados obrigatórios da receita

Uma receita deve conter, no mínimo:

- Valor.
- Descrição.
- Data.
- Conta bancária de destino.

Quando houver distribuição entre caixinhas, o usuário deve poder revisar os valores calculados antes de confirmar.

### RN-013 — Tipos de regra de distribuição

O sistema deve suportar três tipos de regra:

1. **Valor fixo:** destina um valor definido para uma caixinha.
2. **Percentual da receita bruta:** calcula um percentual sobre o valor total da receita.
3. **Percentual do saldo restante:** calcula um percentual sobre o valor ainda disponível depois da execução das regras anteriores.

### RN-014 — Ordem de execução

As regras devem ser executadas na ordem configurada pelo usuário.

A base de cálculo de cada regra deve estar explícita e ser aplicada de forma consistente.

Regras posteriores que utilizem o saldo restante devem considerar o saldo atualizado após as regras anteriores.

### RN-015 — Distribuição superior ao valor disponível

Se a soma das destinações ultrapassar o valor disponível, o sistema deve bloquear a confirmação e informar o excesso.

O sistema não pode reduzir automaticamente as destinações sem consentimento do usuário.

### RN-016 — Valor não distribuído

Se a distribuição total for inferior à receita, a diferença deve permanecer como saldo não alocado.

O sistema não deve distribuir automaticamente o restante sem uma regra explícita.

### RN-017 — Alteração pontual da distribuição

Uma alteração realizada apenas em determinada receita não deve modificar as regras padrão de distribuição.

### RN-018 — Confirmação e persistência

A receita e suas alocações devem ser salvas de forma consistente.

Cancelar antes da confirmação não deve produzir efeitos financeiros.

Repetir a confirmação da mesma operação não pode duplicar a receita nem suas alocações.

### RN-019 — Efeito financeiro da receita

Ao confirmar uma receita:

- O saldo da conta bancária de destino aumenta pelo valor recebido.
- As caixinhas aumentam conforme a distribuição confirmada.
- O sistema não registra a distribuição como uma segunda movimentação de saída bancária.

### Exemplo de distribuição

Considere uma receita de R$ 1.000,00 com duas regras:

| Ordem | Regra | Base de cálculo | Destinação |
|---|---|---:|---:|
| 1 | 50% para Reserva | R$ 1.000,00 | R$ 500,00 |
| 2 | 30% do saldo restante para Lazer | R$ 500,00 | R$ 150,00 |
| — | Saldo não alocado | — | R$ 350,00 |

A segunda regra utiliza o saldo restante após a execução da primeira regra.

## 6. Despesas

### RN-020 — Dados obrigatórios da despesa

Uma despesa deve conter, no mínimo:

- Valor.
- Descrição.
- Data.
- Origem do pagamento: conta bancária ou carteira física.

A despesa pode ser associada a uma caixinha, quando aplicável.

### RN-021 — Despesa superior ao saldo da caixinha

Se uma despesa ultrapassar o saldo da caixinha, mas a origem do pagamento tiver saldo suficiente, o sistema deve avisar que a caixinha ficará negativa e solicitar confirmação explícita.

**Exemplo:**

- Saldo bancário: R$ 500,00.
- Saldo da caixinha: R$ 100,00.
- Despesa: R$ 130,00.

Após a confirmação:

- Saldo bancário: R$ 370,00.
- Saldo da caixinha: −R$ 30,00.
- Despesa registrada: R$ 130,00, uma única vez.

### RN-022 — Cancelamento da confirmação

Se o usuário cancelar a confirmação de uma despesa que deixaria a caixinha negativa, nenhum saldo deve ser alterado e nenhuma movimentação confirmada deve ser criada.

### RN-023 — Saldo bancário insuficiente

Por padrão, o sistema deve bloquear uma despesa cujo valor seja superior ao saldo disponível da conta bancária escolhida.

A mensagem deve informar:

- Valor da despesa.
- Saldo disponível.
- Valor que falta.

O sistema não deve permitir saldo bancário negativo por meio de uma confirmação comum de despesa no MVP.

### RN-024 — Saldo insuficiente na carteira física

Por padrão, o sistema deve bloquear uma despesa paga pela carteira física quando o saldo disponível da carteira for insuficiente.

A possibilidade de caixinha negativa não autoriza saldo negativo na carteira física.

### RN-025 — Efeito da despesa

Uma despesa confirmada deve reduzir a origem do pagamento e atualizar a caixinha associada, quando aplicável, sem duplicar o efeito financeiro.

## 7. Transferências

### RN-026 — Transferência entre caixinhas

Uma transferência entre caixinhas deve:

- Reduzir o saldo da caixinha de origem.
- Aumentar o saldo da caixinha de destino pelo mesmo valor.
- Preservar o saldo bancário consolidado.
- Não gerar receita ou despesa.
- Impedir que a origem e o destino sejam a mesma caixinha.

### RN-027 — Limite da transferência entre caixinhas

O valor transferido não pode exceder o saldo disponível da caixinha de origem.

Uma caixinha negativa pode receber uma transferência para reduzir seu déficit. A transferência não pode aprofundar o saldo negativo da origem.

### RN-028 — Transferência entre contas bancárias

Uma transferência entre contas bancárias deve:

- Reduzir o saldo da conta de origem.
- Aumentar o saldo da conta de destino pelo mesmo valor.
- Preservar o saldo bancário consolidado.
- Não gerar receita ou despesa.
- Impedir transferências para a mesma conta.
- Impedir transferências superiores ao saldo disponível da origem.

### RN-029 — Caixinhas globais

As caixinhas são globais e não pertencem exclusivamente a uma conta bancária.

Uma transferência entre contas bancárias não deve movimentar automaticamente os saldos das caixinhas.

## 8. Saque e carteira física

### RN-030 — Saque como transferência

Um saque deve ser registrado como transferência da conta bancária para a carteira física.

Para um saque de R$ 200,00:

- A conta bancária diminui R$ 200,00.
- A carteira física aumenta R$ 200,00.
- O saldo bancário consolidado diminui R$ 200,00.
- Nenhuma despesa de consumo é registrada pelo saque.

### RN-031 — Despesas pagas em dinheiro

Quando o usuário gastar dinheiro da carteira física, o sistema deve registrar a despesa e reduzir o saldo da carteira.

O saque original não pode ser contado novamente como despesa.

### RN-032 — Validação de saque

O sistema deve impedir saques superiores ao saldo disponível da conta bancária de origem.

A operação deve ser confirmada e persistida sem deixar apenas um dos lados da transferência registrado.

## 9. Conciliação de saldos

### RN-033 — Comparação do saldo observado

O usuário pode informar o saldo que observou em uma conta ou carteira.

O sistema deve apresentar:

- Saldo registrado.
- Saldo observado.
- Diferença calculada.

### RN-034 — Confirmação do ajuste

Antes de aplicar um ajuste, o sistema deve solicitar uma justificativa e apresentar uma prévia do impacto financeiro.

Depois da confirmação, o ajuste deve ser registrado com data, valor e justificativa.

### RN-035 — Preservação do histórico

A conciliação não deve reescrever silenciosamente as movimentações anteriores.

Como as caixinhas são globais, o sistema não deve escolher automaticamente uma caixinha para absorver uma diferença. Qualquer impacto sobre as alocações deve ser apresentado ao usuário para decisão explícita.

## 10. Arredondamento e precisão

### RN-036 — Arredondamento para centavos

Todos os cálculos devem terminar em valores expressos em centavos inteiros.

Para valores positivos com fração de centavo, utilizar arredondamento para o centavo mais próximo:

- Fração inferior a meio centavo: arredondar para baixo.
- Fração igual ou superior a meio centavo: arredondar para cima.

O mesmo critério deve ser utilizado de forma consistente nas operações equivalentes.

### RN-037 — Nunca exceder o valor disponível

A soma das destinações não pode ultrapassar o valor disponível para distribuição.

Se o arredondamento fizer uma destinação exceder o saldo restante, o sistema deve limitar a destinação ao valor restante e manter qualquer diferença visível.

O sistema não pode criar nem perder dinheiro por causa de arredondamentos.

### RN-038 — Base de cálculo atualizada

Cada regra deve usar a base de cálculo correspondente ao seu tipo. Regras de percentual sobre saldo restante devem utilizar o valor atualizado após as regras anteriores.

## 11. Edição, cancelamento e auditoria

### RN-039 — Edição de movimentação confirmada

O usuário pode editar diretamente uma movimentação confirmada.

A edição deve registrar, no mínimo:

- Identificador da movimentação.
- Data e hora da alteração.
- Valores anteriores.
- Valores novos.
- Campos financeiros alterados.
- Efeitos financeiros anteriores e recalculados.

### RN-040 — Recalcular sem duplicar

Ao editar uma movimentação, o sistema deve substituir seus efeitos anteriores pelos efeitos recalculados.

A edição não pode aplicar novamente a movimentação inteira e duplicar os efeitos nos saldos.

Se os novos dados violarem uma regra financeira — por exemplo, deixarem uma conta bancária negativa — a edição deve ser bloqueada ou exigir correção antes de ser salva.

### RN-041 — Cancelamento rastreável

O cancelamento de uma movimentação confirmada deve reverter seus efeitos financeiros e preservar o histórico de auditoria.

O histórico deve distinguir movimentações ativas, editadas e canceladas.

O cancelamento não deve apagar silenciosamente o registro original.

### RN-042 — Identificador único e idempotência

Cada operação deve possuir identificador único.

Cliques repetidos, reenvios ou tentativas de confirmação após falhas não podem duplicar movimentações.

### RN-043 — Consistência do histórico e dos saldos

A movimentação, o histórico de auditoria e os efeitos financeiros devem permanecer consistentes.

Uma falha não pode deixar a operação parcialmente aplicada.

### RN-044 — Relatórios sem dupla contagem

Relatórios de receitas e despesas devem excluir transferências internas.

Transferências entre contas, entre caixinhas e da conta bancária para a carteira física não são receitas nem despesas de consumo.

## 12. Casos de teste essenciais

| ID | Cenário | Resultado esperado |
|---|---|---|
| CT-001 | Registrar R$ 0,01 | Valor persistido corretamente em centavos |
| CT-002 | Total das caixinhas supera saldo bancário inicial | Bloquear configuração e mostrar diferença |
| CT-003 | Distribuição menor que a receita | Manter diferença não alocada |
| CT-004 | Distribuição maior que o valor disponível | Bloquear confirmação |
| CT-005 | Percentual sobre saldo restante | Calcular sobre o saldo atualizado |
| CT-006 | Despesa excede a caixinha, mas cabe no saldo bancário | Solicitar confirmação e permitir caixinha negativa |
| CT-007 | Despesa excede saldo bancário | Bloquear e preservar os saldos |
| CT-008 | Transferência entre caixinhas | Preservar saldo bancário consolidado |
| CT-009 | Transferência entre contas bancárias | Preservar saldo bancário consolidado |
| CT-010 | Saque para carteira física | Reduzir banco e aumentar carteira sem gerar despesa |
| CT-011 | Despesa paga em dinheiro | Reduzir carteira e registrar a despesa uma única vez |
| CT-012 | Carteira física insuficiente | Bloquear a despesa por padrão |
| CT-013 | Conciliação com diferença | Solicitar justificativa, mostrar prévia e registrar ajuste |
| CT-014 | Cancelamento antes da confirmação | Não aplicar efeitos financeiros |
| CT-015 | Edição de movimentação confirmada | Registrar valores antigos/novos e recalcular efeitos |
| CT-016 | Repetição de confirmação | Não duplicar a operação |
| CT-017 | Cálculo com fração de centavo | Aplicar arredondamento sem exceder o disponível |
| CT-018 | Importação repetida de backup | Validar dados e evitar duplicação de operações |

## 13. Critérios de qualidade da implementação

A implementação das regras deverá assegurar:

- Valores monetários tratados em centavos inteiros.
- Validação dos dados antes de confirmar operações.
- Ausência de duplicidade em confirmações repetidas.
- Consistência entre movimentações e saldos.
- Histórico de auditoria para edição e cancelamento.
- Mensagens claras para operações bloqueadas.
- Testes para casos normais, limites e falhas.
- Importação de backup validada antes de alterar os dados atuais.

## 14. Registro de decisões aprovadas

| ID | Decisão | Estado |
|---|---|---|
| T2-D01 | Caixinhas globais, sem vínculo exclusivo com uma conta bancária | Aprovada |
| T2-D02 | Bloquear configuração inicial se o total das caixinhas superar o saldo bancário | Aprovada |
| T2-D03 | Executar regras de distribuição na ordem configurada e bloquear excesso | Aprovada |
| T2-D04 | Permitir caixinha negativa após confirmação explícita de despesa | Aprovada |
| T2-D05 | Bloquear despesas que excedam o saldo bancário por padrão | Aprovada |
| T2-D06 | Registrar saque como transferência para carteira física | Aprovada |
| T2-D07 | Arredondar para o centavo mais próximo sem exceder o disponível | Aprovada |
| T2-D08 | Permitir edição direta de movimentações confirmadas com auditoria | Aprovada |
| T2-D09 | Não permitir que transferências aprofundem o saldo negativo da caixinha de origem | Aprovada |

## 15. Critério de conclusão do T2

O T2 é considerado concluído quando as regras financeiras estiverem documentadas, as decisões relevantes estiverem aprovadas e houver uma base suficiente para desenvolver os critérios de aceitação e os testes da etapa T3.

## 16. Relação com outros documentos

- `briefing_app_financeiro.md`: briefing original do produto.
- `T1-escopo-mvp.md`: escopo e premissas do MVP.
- `tangerina_roadmap.html`: acompanhamento das tarefas.
- `T3-criterios-aceitacao.md`: critérios de aceitação a serem elaborados na próxima etapa.

## 17. Histórico de versão

| Versão | Alteração |
|---|---|
| 1.0 | Consolidação das regras financeiras aprovadas para o MVP |
