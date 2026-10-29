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