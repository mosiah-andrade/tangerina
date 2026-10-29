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


## 13. Quinta iteração — auditoria de exportação/importação, estados e critérios T2/T3

**Data:** 29/10/2026  
**Status:** em andamento; não aprovada.

### 13.1 Correções no Figma

- Criado o frame **UX3 — Exportação concluída**, com retorno às opções de exportação e atalho para configurações.
- Criado o frame **UX3 — Restauração concluída**, separado da exportação, com retorno ao dashboard ou configurações.
- O botão **Gerar arquivo** agora navega para o estado de exportação concluída, e não para a tela de importação.
- O botão **Validar arquivo** leva à prévia de restauração; a confirmação leva ao estado de restauração concluída; cancelar mantém o usuário na importação e preserva os dados atuais no fluxo demonstrativo.
- O estado **Transferência bloqueada por saldo** agora permite editar a transferência ou cancelar, sem caminho de confirmação.
- Revalidei o estado de confirmação de saldo negativo: confirmar continua para o dashboard no protótipo e voltar retorna ao formulário da despesa.

Essas telas representam navegação demonstrativa. Os cliques não geram downloads reais, não validam arquivos nem modificam dados financeiros.

### 13.2 Auditoria estrutural e visual

A página examinada é UX2 — Wireframes mobile e contém 262 frames. Na leitura estrutural foram identificados 51 nós com reações e 51 conexões, sem destinos inexistentes entre as conexões contabilizadas. Isso confirma a existência dos destinos, mas não prova que os percursos foram executados corretamente no modo Present.

As novas telas de exportação e restauração mantêm dimensões de 390 × 844 px e usam Auto Layout. Foram identificadas as dimensões e hierarquias dos frames-chave. **A revisão visual completa de todos os frames não está certificada:** não foi possível executar uma sessão interativa completa no modo Present nem concluir uma inspeção visual tela a tela nesta iteração.

### 13.3 Matriz de verificação contra T2 e T3

| Regra / critério | Evidência no protótipo | Situação |
|---|---|---|
| T2 RN-013/RN-014, bases e ordem de distribuição; T3 CA01/CA02 | Revisão de receita apresenta ordem e exemplo de cálculo com saldo restante; formulário permite editar regras | Representação parcial; testar bases fixa/percentual e alteração pontual |
| T2 RN-015/RN-016/RN-036 a RN-038; T3 CA03 | Textos indicam bloqueio de excesso e arredondamento ao centavo | Falta percorrer casos de excesso, empate de arredondamento e soma dos centavos |
| T2 RN-021 a RN-025; T3 CA04/CA05 | Formulário de despesa, revisão de saldo projetado e confirmação explícita | Caminho visual representado; testar cancelamento e bloqueio bancário |
| T2 RN-026 a RN-032; T3 CA06/CA07 | Tela de transferência, prévia de saldo e estado de bloqueio | Testar transferência entre caixinhas, entre contas e para carteira física |
| T2 RN-033 a RN-035 | Conciliação apresenta diferença e prévia do efeito antes de confirmar | Testar diferença positiva/negativa, cancelamento e preservação do histórico |
| T2 RN-039 a RN-044; T3 auditoria/histórico | Detalhe do movimento mostra valor anterior e novo | Testar edição, recálculo sem duplicidade, cancelamento rastreável e idempotência |
| T3 CA08/CA09 | Tela de confirmação de pagamento e lista de contas | Revisar o requisito: T3 diz que confirmar boleto não deve lançar segunda despesa nem descontar novamente a conta; a jornada deve demonstrar isso explicitamente |
| T3 CA10/CA11 e demais critérios | Inventário de telas inclui recorrência e metas | Não coberto suficientemente por esta rodada; revisar cada critério T3 individualmente |

### 13.4 Riscos e decisões pendentes

1. **O protótipo não é a implementação:** reações de clique apenas navegam entre frames; não calculam valores, persistem movimentos, fazem download, validam JSON nem restauram dados.
2. **Pagamento de conta:** o protótipo deve deixar claro como a confirmação atualiza o status sem duplicar a despesa nem descontar a conta duas vezes, conforme T3 CA08.
3. **Bases da distribuição:** os textos da tela devem distinguir regra por valor fixo, percentual da receita total e percentual do saldo restante. Ainda falta testar casos com múltiplas regras e arredondamento acumulado.
4. **Revisão visual:** é necessário abrir o arquivo no editor/Present, conferir todos os caminhos e verificar textos cortados, sobreposição, áreas de clique e retorno/cancelamento.
5. **Aprovação:** nenhum aceite final foi presumido. A UX3 só poderá ser concluída após a validação manual e aprovação explícita do usuário.

### 13.5 Checklist restante

- [ ] Executar todos os fluxos no modo Present: configuração, receita, despesa, transferência, pagamento, conciliação, exportação e restauração.
- [ ] Testar casos T2/T3 de bases, ordem, arredondamento, excesso, saldo insuficiente, movimentos duplicados, auditoria e conciliação.
- [ ] Ajustar o fluxo de pagamento para evidenciar a regra T3 CA08.
- [ ] Inspecionar visualmente todos os frames e corrigir eventuais cortes/sobreposições.
- [ ] Registrar resultados observados dos testes, incluindo falhas e correções.
- [ ] Obter aprovação explícita do usuário.

**Conclusão desta iteração:** exportação e importação agora têm caminhos semanticamente separados e estados de sucesso distintos; o estado de transferência bloqueada tem ações coerentes. A validação manual e a aprovação permanecem pendentes. UX3 continua **EM ANDAMENTO**.


## 15. Sétima iteração — validação dos estados de transferência e conciliação

**Data:** 29/10/2026  
**Status:** em andamento; não aprovada.

### Inspeção e correções no Figma

- A tela de revisão da transferência informa que a movimentação não é receita nem despesa e apresenta saldo disponível e saldo projetado.
- O botão de confirmar transferência agora leva a um estado de sucesso explícito, com origem, destino, valor e orientação de auditoria; o retorno permite voltar ao formulário.
- A prévia da conciliação foi ajustada para dizer que a diferença será registrada como ajuste auditável e que o histórico anterior será preservado. A confirmação só navega para o estado de sucesso.
- Criado o estado **UX3 — Conciliação registrada**, com saldo calculado, saldo real informado, diferença registrada e retorno ao dashboard ou à lista de contas.
- O novo estado de conciliação foi inspecionado por screenshot em 390 × 844 px após a correção de hierarquia e rótulos. Os campos ficaram legíveis e não foi observado corte no texto dessa tela.

### Evidência de auditoria estrutural

A página de wireframes mobile contém agora 274 frames. A inspeção das telas selecionadas confirmou que os destinos das ações examinadas existem, incluindo revisão de despesa, confirmação de saldo negativo, revisão de transferência, prévia de conciliação, prévia de restauração e confirmação de pagamento.

### Limites e riscos remanescentes

- As ações continuam sendo navegação entre frames; não executam cálculos, persistência, ajuste contábil, transferência real nem restauração.
- A revisão de receita apresenta um exemplo consistente com as regras descritas (10% de R$ 2.500 = R$ 250; depois 20% de R$ 2.250 = R$ 450; saldo restante R$ 1.800). Isso é apenas um exemplo visual, não teste de todos os tipos de regra.
- T2 RN-033 a RN-035 exige comparação, confirmação e preservação do histórico; a nova tela representa esses conceitos, mas falta testar diferenças positivas e negativas, cancelamento e registro único do ajuste.
- T2 RN-021 a RN-025 exige confirmação explícita para caixinha negativa e bloqueio se a origem bancária não tiver saldo. A jornada visual existe, mas o protótipo não calcula nem impõe esses limites.
- T2 RN-026 a RN-032 cobre transferência entre caixinhas, contas e carteira física; nesta iteração foi inspecionado o exemplo conta principal → carteira física, sem percorrer todos os pares de origem/destino.
- T2 RN-036 a RN-044 (arredondamento, limite, recálculo, cancelamento rastreável, idempotência, histórico e relatórios) e todos os critérios T3 ainda precisam de execução manual/casos de teste.

### Checklist atualizado

- [x] Separar os estados de sucesso de exportação e restauração.
- [x] Explicitar pagamento sem despesa duplicada ou novo desconto.
- [x] Criar estado de sucesso para transferência e conciliação.
- [x] Inspecionar screenshot do estado de conciliação após correção visual.
- [ ] Executar manualmente os fluxos no modo Present e anotar resultados reais.
- [ ] Testar bases/ordem de distribuição, arredondamento, excesso e alteração pontual.
- [ ] Testar despesas e transferências com saldo insuficiente, incluindo cancelamento.
- [ ] Testar conciliação com diferença positiva e negativa, cancelamento e preservação do histórico.
- [ ] Testar restauração cancelada e confirmada, sem assumir operação real no protótipo.
- [ ] Conferir todos os critérios T3 individualmente e corrigir os pontos divergentes.
- [ ] Inspecionar todos os frames e registrar defeitos visuais encontrados.
- [ ] Obter aprovação explícita do usuário.

**Conclusão:** foram adicionados estados de sucesso e clarificada a semântica de conciliação. A UX3 continua **EM ANDAMENTO** porque o teste manual no modo Present, a revisão integral T2/T3 e a aprovação não foram realizados.


## 16. Oitava iteração — fluxo de sucesso de receita e revisão de branches

**Data:** 29/10/2026  
**Status:** em andamento; não aprovada.

### Correção no Figma

- O botão Confirmar receita agora leva ao novo frame UX3 — Receita registrada, em vez de saltar diretamente ao dashboard.
- A tela resume a receita de R$ 2.500,00, a distribuição de R$ 250,00 para Reserva (10% da receita), R$ 450,00 para Despesas do mês (20% do saldo restante de R$ 2.250,00) e R$ 1.800,00 não alocados.
- A tela oferece retorno ao dashboard ou ao formulário de receita.
- O primeiro screenshot revelou sobreposição entre linhas do resumo. A altura do card e o espaçamento foram corrigidos. A inspeção visual inicial foi realizada; o comportamento clicável ainda requer execução manual no modo Present.

### Revisão do GitHub

- Consulta ao repositório não encontrou pull requests abertos.
- As PRs recentes de UX3 (#6 a #11) estão integradas à main; as PRs #10 e #11 cobrem, respectivamente, exportação/restauração e transferência/conciliação.
- Há branches antigas ainda listadas, mas elas correspondem a PRs já integradas ou a entregas históricas. A comparação entre referências aparece como divergente por causa do histórico de squash/merge; isso, isoladamente, não justifica novo merge.
- Não foi possível excluir branches remotas pela integração disponível nesta sessão, que não expõe uma operação de exclusão de branch. Portanto, nenhuma branch foi apagada nem foi feito merge duplicado. Elas podem ser removidas no GitHub após confirmar que cada uma está associada a PR já integrado e que não contém trabalho posterior exclusivo.

### Checklist

- [x] Verificar PRs abertos: nenhum encontrado.
- [x] Conferir o estado das PRs recentes de UX3: #6, #7, #8, #9, #10 e #11 integradas.
- [x] Corrigir o fluxo de sucesso de receita e inspecionar visualmente o resumo.
- [ ] Executar manualmente no modo Present todos os caminhos, inclusive retorno e cancelamento.
- [ ] Testar os critérios T2/T3 com casos-limite e registrar resultados.
- [ ] Inspecionar visualmente todos os frames.
- [ ] Obter aprovação explícita do usuário.

**Conclusão:** a jornada de receita tem agora um estado de sucesso próprio e o card foi corrigido após inspeção visual. A UX3 permanece EM ANDAMENTO. O teste manual e a aprovação não foram simulados nem presumidos.
