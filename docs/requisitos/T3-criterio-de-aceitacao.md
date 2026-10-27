# Critérios de Aceitação — MVP Tangerina Financeiro

## 9. Critérios de aceitação

Todos os cenários abaixo devem passar antes de considerar o MVP pronto para uso.

1. **CA01. Distribuição de recebimento:** registrar R$ 1.000,00, selecionar caixinhas e visualizar a sugestão correta. O saldo bancário aumenta em R$ 1.000,00, as reservas são atualizadas e o restante aparece como não alocado.
2. **CA02. Regra pontual:** alterar o percentual em um recebimento não muda a regra padrão usada depois.
3. **CA03. Excesso de distribuição:** mostrar aviso e impedir que o excesso seja salvo inadvertidamente.
4. **CA04. Despesa vinculada:** uma despesa de R$ 100,00 reduz a conta bancária e a caixinha escolhida em R$ 100,00, sem duplicar a saída.
5. **CA05. Saldo insuficiente:** alertar e exigir decisão explícita antes de aceitar saldo negativo ou diferença pendente.
6. **CA06. Transferência entre caixinhas:** transferir R$ 50,00 reduz a origem e aumenta o destino, sem alterar saldo bancário.
7. **CA07. Boleto pago:** confirmação manual atualiza status e histórico, sem lançar despesa bancária automaticamente.
8. **CA08. Boleto vencido:** continua pendente até regularização manual.
9. **CA09. Recorrência:** gerar ocorrências previstas, respeitar a data final e preservar ocorrências anteriores.
10. **CA10. Metas:** escolher saldo atual ou aportes acumulados e exibir valor atual, alvo e restante corretamente.
11. **CA11. Correção auditável:** edição preserva valores anteriores e recalcula saldos sem duplicação.
12. **CA12. Conciliação:** registrar saldo real diferente do calculado com justificativa e histórico.
13. **CA13. Offline:** consultar, cadastrar e editar registros localmente sem internet, após o app estar disponível no dispositivo.
14. **CA14. Exportação e importação:** recuperar dados de arquivo válido e rejeitar arquivo inválido sem corromper a base existente.
15. **CA15. Contextos:** filtrar pessoal e empresa e confirmar que transferências não são contadas como receita ou despesa.
