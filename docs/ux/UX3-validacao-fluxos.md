# UX3 — Validação dos fluxos do protótipo

- **Projeto:** Tangerina Financeiro
- **Tarefa:** UX3 — Validar e aprovar os fluxos do protótipo
- **Status:** Em andamento — primeira revisão realizada; aprovação final pendente
- **Data:** 29/10/2026
- **Figma:** https://www.figma.com/design/3g1tk0uRUD3cNv96U0gXeN/Tangerina-Financeiro-Wireframes-Mobile
- **Base:** `docs/ux/UX1-inventario-telas-estados.md`, T1, T2, T3 e T4, além dos 23 frames criados na UX2.

## 1. Objetivo

Revisar a coerência dos principais fluxos com o inventário de UX1 e as regras financeiras, organizar uma visão de jornada e registrar o que falta antes de aprovar a experiência para implementação.

## 2. Trabalho realizado

Foi criada no arquivo Figma uma página adicional **“UX3 — Fluxos e validação”** contendo um mapa visual dos seguintes percursos:

1. **Configuração inicial:** boas-vindas → aviso de armazenamento → contas → caixinhas → regras de distribuição → revisão.
2. **Receita:** formulário → revisão da distribuição → painel atualizado após confirmação.
3. **Despesa, transferência e auditoria:** formulário de despesa/transferência → histórico → detalhe e auditoria.
4. **Contas a pagar:** lista de contas → revisão/confirmar pagamento → histórico.

A página inclui checklist para revisar separação de saldos, revisão antes de confirmar, limites de distribuição, saldo insuficiente, transferências, pagamentos e estados transversais.

## 3. Resultado da primeira revisão

### Coerências identificadas

- O inventário prevê revisão explícita antes de salvar operações financeiras.
- O painel deve manter separados saldo bancário, total das caixinhas e saldo não alocado.
- As caixinhas são globais.
- As regras de distribuição precisam mostrar ordem e base de cálculo.
- Transferências internas não podem ser contabilizadas como receita ou despesa.
- O pagamento de uma conta não pode produzir um lançamento financeiro duplicado.
- Falhas de persistência não podem ser apresentadas como sucesso.

### Pendências encontradas no protótipo

- **Navegação:** os frames são telas isoladas; a navegação inferior mobile e os destinos clicáveis ainda precisam ser configurados/validados.
- **Estados transversais:** faltam representações visuais dedicadas para vazio, carregamento, erro de campo, falha de gravação, armazenamento indisponível, offline, operação bloqueada e cancelamento.
- **Conciliação:** a tela deve mostrar a diferença e uma prévia do ajuste antes de confirmar.
- **Importação:** a jornada deve incluir seleção, validação do arquivo, prévia do impacto e confirmação/cancelamento.
- **Receita:** a revisão deve demonstrar claramente as opções de valor fixo, percentual da receita bruta e percentual do saldo restante, respeitando a ordem das regras.
- **Despesa:** precisa ficar claro quando o saldo da caixinha poderá ficar negativo após confirmação e que saldo bancário insuficiente é bloqueado por padrão.
- **Dashboard:** incluir próximos vencimentos e atalhos coerentes com a navegação principal prevista em UX1.
- **Conteúdo ilustrativo:** todos os valores de exemplo devem permanecer identificáveis como dados fictícios.

## 4. Limitação técnica e status da navegação

O mapa adicionado ao Figma usa conectores visuais para mostrar a ordem das etapas; esses conectores **não são interações clicáveis**. A tentativa de definir ações de protótipo diretamente pela API disponível não foi suportada. Portanto, não afirmamos que o arquivo já seja um protótipo interativo navegável.

A conexão clicável entre frames precisa ser concluída e testada no editor do Figma, ou por outro mecanismo compatível. A validação visual e a aprovação final também ainda não ocorreram.

## 5. Próximas ações

- [ ] Ajustar o dashboard com próximos vencimentos e navegação principal.
- [ ] Criar estados visuais críticos, especialmente erro, vazio, falha de gravação e operação bloqueada.
- [ ] Detalhar conciliação e importação com revisão antes da confirmação.
- [ ] Revisar telas de receita e despesa contra T2 e T3.
- [ ] Configurar e testar conexões clicáveis no Figma.
- [ ] Fazer revisão final com o usuário e registrar aprovação.

## 6. Critério de conclusão da UX3

UX3 só deve ser marcada como concluída após as pendências acima serem tratadas, os principais fluxos serem testados e o usuário aprovar o protótipo. Esta entrega registra a primeira revisão e não representa aprovação final.


## 7. Segunda iteração — estados críticos e dashboard

Em 29/10/2026, foi feita uma segunda iteração visual no arquivo Figma:

- Dashboard: adicionados os blocos **Próximos vencimentos** e **Navegação principal**.
- Estado vazio do histórico: explica o que aparecerá na lista e oferece ação para registrar a primeira movimentação.
- Erro de validação: informa como corrigir o campo inválido sem apagar o formulário.
- Confirmação de saldo negativo na caixinha: mostra saldo atual, despesa e saldo projetado negativo, com confirmação explícita.
- Prévia de restauração: mostra resumo do backup e alerta para exportar os dados atuais antes de substituir.
- Falha ao salvar: esclarece que a operação não foi confirmada e oferece nova tentativa.
- Armazenamento indisponível: impede que a interface sugira que os dados foram salvos.
- Transferência bloqueada por saldo: mostra saldo disponível, valor solicitado e diferença, sem permitir confirmar.

Esses frames são especificações visuais de estados; não comprovam comportamento implementado no aplicativo.

## 8. Estado atualizado das pendências

- [x] Ajustar o dashboard com próximos vencimentos e navegação principal — representação visual adicionada.
- [x] Criar representações visuais de erro, vazio, falha de gravação, armazenamento indisponível e operação bloqueada.
- [x] Detalhar a confirmação de caixinha negativa e a prévia de restauração.
- [ ] Revisar as telas de receita, despesa, conciliação e importação com todos os critérios T2/T3.
- [ ] Configurar e testar conexões clicáveis no Figma.
- [ ] Fazer revisão final com o usuário e registrar aprovação.

**Status permanece: em andamento.** A UX3 só deve ser concluída após as jornadas clicáveis e a revisão final.

## 9. Terceira iteração — revisão financeira e navegação clicável

Em 29/10/2026, o protótipo recebeu novos detalhes e ligações de navegação:

### Receita e distribuição

A tela de revisão agora explicita a ordem das regras e a base restante. Exemplo ilustrativo com receita de R$ 2.500,00:
- Regra 1: 10% da receita total = R$ 250,00.
- Regra 2: 20% do saldo restante de R$ 2.250,00 = R$ 450,00.
- Não alocado: R$ 1.800,00.

A distribuição é arredondada ao centavo e não pode exceder o valor disponível. Os valores são dados de exemplo, não entradas reais.

### Despesa e transferência

- A tela de despesa explicita que uma caixinha pode ficar negativa apenas após confirmação explícita e que saldo bancário insuficiente bloqueia a operação por padrão.
- Foi criada uma tela de revisão da despesa com resumo da origem, caixinha, valor e saldo projetado.
- Foi criada uma tela de revisão da transferência com origem, destino, valor e efeito previsto no saldo. A transferência não deve ser contabilizada como receita ou despesa.

### Conciliação e restauração

- A tela de conciliação inclui um exemplo de diferença entre saldo do app e saldo real.
- Foi criada uma prévia da conciliação com a diferença e o efeito proposto; nenhuma alteração deve ocorrer antes da confirmação.
- A jornada de importação agora aponta para a prévia de restauração existente, que mostra o resumo do arquivo e alerta sobre substituição dos dados.

### Interações do protótipo

Foram adicionadas 38 conexões de navegação por clique, cobrindo configuração inicial, atalhos do dashboard, receita e revisão da distribuição, despesa e sua revisão, transferência e revisão, conciliação e prévia, importação/restauração, pagamento e retorno do detalhe ao histórico.

O frame de boas-vindas foi identificado como início pretendido do fluxo. A configuração de início do protótipo no arquivo pode depender de ajuste no editor do Figma, pois a propriedade da página não é gravável pela API usada.

## 10. Resultado da revisão e pendências restantes

- [x] Conferir e explicitar ordem das regras e base de cálculo restante em exemplo de distribuição.
- [x] Representar revisão da despesa com saldo projetado e confirmação.
- [x] Representar revisão da transferência com validação de saldo.
- [x] Criar prévia da conciliação com diferença e confirmação.
- [x] Ligar jornadas principais por cliques entre frames.
- [ ] Testar manualmente todos os caminhos no modo Present do Figma.
- [ ] Conferir se todas as telas e estados refletem integralmente os critérios T2/T3, incluindo regras fixas, percentuais da receita bruta e percentuais do saldo restante, casos de arredondamento e limites.
- [ ] Ajustar visualmente eventuais problemas identificados no teste.
- [ ] Revisão final com o usuário e aprovação explícita.

**Status permanece: em andamento.** As conexões foram criadas via API e contadas estruturalmente, mas não foi possível concluir um teste interativo completo no modo Present nesta sessão. A UX3 não deve ser considerada aprovada até o teste manual e a aprovação do usuário.


## 11. Quarta iteração — correção de jornadas e auditoria estrutural

Em 29/10/2026, foi realizada uma auditoria estrutural dos frames e reações do protótipo. A página contém 262 frames no total, incluindo as telas UX3 adicionadas anteriormente. Foram encontrados destinos existentes para as conexões verificadas.

A auditoria identificou que a revisão de uma despesa com saldo projetado negativo encaminhava diretamente ao dashboard. O caminho foi corrigido para exigir a tela **Confirmar saldo negativo?** antes de retornar ao dashboard. A opção de voltar nessa confirmação retorna ao formulário da despesa.

Também foram conectados:
- As quatro linhas de movimentação do histórico ao detalhe/auditoria.
- As contas pendentes Internet e Energia à tela de confirmação de pagamento; a conta já paga retorna ao dashboard.
- O atalho de backup/restauração nas configurações à exportação.
- O botão de geração de arquivo à tela de importação como sequência demonstrativa de navegação.
- O atalho de regras de distribuição nas configurações à tela de regras.

Foram criadas ou substituídas 14 reações nesta iteração. Isso é uma verificação estrutural das conexões, não uma confirmação de que todos os percursos foram executados com sucesso no modo Present.

## 12. Pendências após auditoria

- [x] Garantir que despesa com saldo negativo passe por confirmação explícita antes de concluir o caminho demonstrativo.
- [x] Conectar linhas do histórico ao detalhe/auditoria.
- [x] Conectar contas pendentes à tela de pagamento.
- [x] Conectar atalhos de configurações para backup e regras de distribuição.
- [ ] Testar manualmente no modo Present todos os caminhos, incluindo voltar/cancelar e cenários de erro.
- [ ] Revisar o fluxo demonstrativo de exportação/importação para que fique semanticamente claro; gerar arquivo e importar arquivo são ações distintas.
- [ ] Validar todas as regras T2/T3 contra casos de teste, incluindo distribuição fixa/percentual, bases de cálculo, arredondamento, excesso, saldo bancário insuficiente e auditoria de edição.
- [ ] Confirmar o início do protótipo no editor do Figma e revisar o layout de cada frame.
- [ ] Receber aprovação explícita do usuário.

**Status: em andamento.** A auditoria estrutural ajudou a corrigir conexões e a completar jornadas, mas não substitui teste manual de interação, conferência integral dos requisitos nem aprovação final.
