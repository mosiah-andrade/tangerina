# T28 — Transferências entre caixinhas

- **Projeto:** Tangerina Financeiro
- **Tarefa:** T28 — Implementar transferências entre caixinhas
- **Área:** Financeiro
- **Status:** Regras e casos de teste aprovados; implementação pendente
- **Data da aprovação:** 24/11/2026
- **Base:** RN-003, RN-026, RN-027, RN-039 a RN-044 e decisões específicas aprovadas nesta tarefa

## 1. Objetivo e escopo

Definir o comportamento de transferências entre caixinhas, incluindo criação, edição, cancelamento, histórico, metas e exclusão de caixinhas.

A transferência altera somente alocações virtuais. Não movimenta contas bancárias ou carteira física, não altera o saldo bancário consolidado e não gera receita ou despesa.

## 2. Regras aprovadas

### 2.1. Seleção e valor

1. O fluxo seleciona primeiro a caixinha de origem.
2. Depois da seleção da origem, o sistema apresenta as demais caixinhas como destinos; a própria origem não pode ser destino.
3. O campo de valor inicia em R$ 0,00.
4. Um link discreto, “Transferir todo o saldo disponível”, preenche o campo com o saldo disponível da origem.
5. Depois do preenchimento automático, o valor continua editável.
6. O valor deve ser maior que zero e representado em centavos inteiros.

### 2.2. Limites de saldo

1. A origem deve possuir saldo positivo e disponível para transferência.
2. O valor não pode exceder o saldo disponível da origem.
3. Origem com saldo zero ou negativo não pode realizar transferência de saída.
4. A transferência nunca pode deixar a origem negativa nem aprofundar saldo negativo.
5. Caixinha negativa pode receber transferência.
6. O valor recebido pode ultrapassar o déficit do destino e deixá-lo com saldo positivo, sem confirmação especial.

### 2.3. Efeitos e histórico

1. A transferência reduz a origem e aumenta o destino pelo mesmo valor.
2. O saldo bancário consolidado permanece inalterado.
3. Não são geradas receitas nem despesas.
4. Cada transferência gera dois registros vinculados: saída na origem e entrada no destino.
5. Os dois registros compartilham identificador da transferência.
6. Os dois registros e seus efeitos devem ser persistidos atomicamente. Falha não pode deixar apenas um lado gravado.
7. A operação deve ser idempotente para impedir duplicidade em reenvios ou confirmações repetidas.

### 2.4. Edição

1. O usuário pode iniciar a edição a partir do registro da origem ou do destino.
2. Editar qualquer lado altera a mesma transferência e mantém os dois registros vinculados.
3. É permitido alterar valor e caixinha de destino, desde que a origem seja diferente do destino.
4. A validação do novo valor considera o saldo atual da origem após reverter conceitualmente o efeito da transferência original.
5. A edição é bloqueada se o novo valor exceder o saldo disponível recalculado.
6. Os efeitos anteriores são substituídos pelos novos sem duplicidade.
7. Alterações preservam auditoria dos valores e vínculos anteriores e novos.
8. Metas associadas às caixinhas afetadas devem ser recalculadas.

### 2.5. Cancelamento

1. O usuário pode cancelar a partir do registro da origem ou do destino.
2. Cancelar qualquer lado cancela a transferência inteira, incluindo os dois registros.
3. A reversão deve calcular o saldo projetado do destino.
4. Se a reversão deixar o destino negativo, o sistema deve solicitar confirmação explícita, exibindo o saldo projetado.
5. Se o usuário recusar, a transferência permanece intacta.
6. Se confirmar, os dois registros são cancelados e os efeitos revertidos atomicamente.
7. O cancelamento preserva os registros originais e a auditoria; não apaga silenciosamente o histórico.
8. Metas associadas às caixinhas afetadas devem ser recalculadas após o cancelamento.

### 2.6. Metas

Quando o progresso de uma meta for baseado no saldo da caixinha associada:
- Transferência de saída reduz o progresso.
- Transferência de entrada aumenta o progresso.
- Edição, troca de destino e cancelamento recalculam o progresso das metas das caixinhas envolvidas.
- A transferência não é aporte de receita nem despesa; o progresso reflete o saldo atualizado da caixinha.

### 2.7. Exclusão de caixinhas

1. Caixinha com saldo positivo deve ter o saldo disponível transferido para outra caixinha antes da exclusão.
2. Caixinha com saldo negativo deve ter o déficit regularizado antes da exclusão.
3. Depois de zerada, a caixinha pode ser excluída mesmo que possua movimentações no histórico.
4. A exclusão não apaga registros financeiros antigos.
5. Registros antigos continuam identificando a caixinha excluída e mantendo os vínculos das transferências.
6. Caixinha sem movimentações e sem saldo pode ser excluída normalmente.

## 3. Casos de teste aprovados

### 3.1. Iniciar uma transferência

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT01 | Abrir o fluxo de transferência | Exibir primeiro a seleção da caixinha de origem |
| T28-CT02 | Selecionar uma origem | Exibir as demais caixinhas como destinos |
| T28-CT03 | Tentar selecionar a própria origem como destino | A origem não aparece como opção |
| T28-CT04 | Abrir o campo de valor | Campo começa em R$ 0,00 |
| T28-CT05 | Clicar em “Transferir todo o saldo disponível” | Campo recebe o saldo disponível da origem |
| T28-CT06 | Editar o valor preenchido automaticamente | Permitir alteração manual |
| T28-CT07 | Informar zero, valor negativo ou valor inválido | Impedir confirmação |

### 3.2. Validar saldo da origem

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT08 | Transferir valor inferior ao saldo disponível | Permitir |
| T28-CT09 | Transferir exatamente o saldo disponível | Permitir; origem fica zerada |
| T28-CT10 | Transferir valor superior ao saldo disponível | Bloquear |
| T28-CT11 | Tentar transferir de caixinha zerada | Bloquear |
| T28-CT12 | Tentar transferir de caixinha negativa | Bloquear |
| T28-CT13 | Receber transferência em caixinha negativa | Permitir |

### 3.3. Resultado financeiro

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT14 | Transferir R$ 100,00 entre caixinhas | Debitar R$ 100,00 da origem e creditar R$ 100,00 no destino |
| T28-CT15 | Consultar saldo bancário consolidado após transferência | Permanecer inalterado |
| T28-CT16 | Consultar receitas e despesas após transferência | Não gerar receita nem despesa |
| T28-CT17 | Transferir para destino com saldo negativo | Permitir que o destino fique negativo, zerado ou positivo conforme o cálculo |

### 3.4. Histórico e integridade

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT18 | Realizar uma transferência | Criar dois registros vinculados |
| T28-CT19 | Consultar histórico da origem | Exibir saída |
| T28-CT20 | Consultar histórico do destino | Exibir entrada |
| T28-CT21 | Verificar vínculo entre os registros | Ambos possuem o mesmo identificador de transferência |
| T28-CT22 | Simular falha durante a gravação | Não permitir registro parcial |
| T28-CT23 | Tentar processar a mesma operação novamente | Não duplicar a transferência |

### 3.5. Edição

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT24 | Editar pela origem | Permitir alteração da transferência |
| T28-CT25 | Editar pelo destino | Produzir o mesmo resultado da edição pela origem |
| T28-CT26 | Alterar o valor | Atualizar os dois registros vinculados |
| T28-CT27 | Alterar o destino | Atualizar os dois lados da transferência |
| T28-CT28 | Origem não possui saldo suficiente para o novo valor | Bloquear edição |
| T28-CT29 | Editar transferência cuja origem teve saldo alterado após a operação | Validar o saldo atual após reverter o efeito original |
| T28-CT30 | Editar uma transferência | Preservar auditoria dos valores anteriores e novos |
| T28-CT31 | Trocar destino para caixinha diferente | Permitir se a origem for diferente e tiver saldo suficiente; recalcular metas envolvidas |

### 3.6. Cancelamento

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT32 | Cancelar pela origem | Cancelar os dois registros |
| T28-CT33 | Cancelar pelo destino | Cancelar os dois registros |
| T28-CT34 | Cancelar quando o destino possui saldo suficiente | Reverter normalmente |
| T28-CT35 | Cancelar quando a reversão deixa o destino negativo | Exibir confirmação explícita |
| T28-CT36 | Recusar confirmação de saldo negativo | Manter transferência intacta |
| T28-CT37 | Confirmar saldo negativo | Cancelar os dois registros atomicamente |
| T28-CT38 | Cancelar uma transferência | Preservar histórico e auditoria |

### 3.7. Metas e exclusão

| ID | Cenário | Resultado esperado |
|---|---|---|
| T28-CT39 | Transferir de caixinha vinculada a uma meta | Reduzir o progresso da meta |
| T28-CT40 | Transferir para caixinha vinculada a uma meta | Aumentar o progresso da meta |
| T28-CT41 | Cancelar transferência envolvendo meta | Recalcular o progresso |
| T28-CT42 | Excluir caixinha com saldo positivo | Exigir transferência do saldo antes da exclusão |
| T28-CT43 | Excluir caixinha com saldo negativo | Exigir regularização do saldo |
| T28-CT44 | Excluir caixinha zerada com histórico | Permitir exclusão preservando o histórico |
| T28-CT45 | Consultar transferência antiga de caixinha excluída | Manter identificação e vínculo histórico |
| T28-CT46 | Excluir caixinha sem movimentações e sem saldo | Permitir exclusão |

## 4. Critérios gerais de aceitação

- [ ] Valores financeiros persistidos em centavos inteiros.
- [ ] Operações atômicas, sem efeitos financeiros parciais.
- [ ] Idempotência para evitar duplicidade.
- [ ] Atualização consistente dos saldos e históricos.
- [ ] Histórico e auditoria preservados após edição, cancelamento e exclusão lógica.
- [ ] Nenhuma transferência pode aprofundar saldo negativo da origem.
- [ ] Nenhuma transferência altera o saldo bancário consolidado.
- [ ] Nenhuma transferência é contabilizada como receita ou despesa.
- [ ] Metas baseadas em saldo refletem os saldos atualizados das caixinhas.

## 5. Registro de aprovação

Em 24/11/2026, o usuário aprovou as regras de negócio e os 46 casos de teste desta especificação. A aprovação é documental: não significa que a funcionalidade esteja implementada, testada ou integrada à main.

## 6. Histórico de versão

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 24/11/2026 | Primeira versão com regras e casos de teste aprovados para T28 |
