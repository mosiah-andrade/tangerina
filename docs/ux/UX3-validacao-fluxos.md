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

## 17. Nona iteração — registro dos testes manuais no protótipo

**Data do registro:** 29/10/2026  
**Status da UX3:** EM ANDAMENTO — aprovação final pendente  
**Ambiente:** Protótipo do Figma  
**Resultado informado pelo responsável:** Todos os fluxos se comportaram como esperado no protótipo.

### 17.1. Resultado por jornada

O responsável informou que todos os cenários abaixo foram executados e se comportaram como esperado no protótipo.

#### Receitas e distribuição — T2
- [x] Registrar receita e conferir a tela de sucesso.
- [x] Conferir a ordem das regras e a base de cálculo de cada percentual.
- [x] Testar arredondamento para centavos e bloqueio de distribuição acima do limite.
- [x] Cancelar a operação e confirmar que não se chega à tela de sucesso.

#### Despesas e caixinhas — T2/T3
- [x] Tentar uma despesa acima do saldo da caixinha e verificar a confirmação de saldo negativo.
- [x] Cancelar a confirmação e conferir o retorno ao fluxo de revisão.
- [x] Confirmar a despesa e verificar o caminho para o histórico/detalhe.
- [x] Editar um movimento e conferir se o histórico de auditoria é apresentado.

#### Transferência e conciliação
- [x] Tentar transferir mais que o saldo bancário disponível.
- [x] Cancelar e editar uma transferência bloqueada.
- [x] Conferir a prévia da conciliação antes de confirmar.
- [x] Conferir o estado de sucesso e o tratamento da diferença de saldo.

#### Exportação e restauração
- [x] Gerar um arquivo de exportação e verificar o caminho de retorno.
- [x] Validar um arquivo para restauração e conferir a prévia.
- [x] Cancelar a restauração e conferir o retorno.
- [x] Confirmar a restauração e conferir o estado final.

#### Pagamentos e navegação
- [x] Confirmar pagamento e verificar se não há duplicação da despesa.
- [x] Testar voltar, cancelar e confirmar nos fluxos principais.
- [x] Verificar se os botões levam à tela correspondente, sem atalhos para jornadas diferentes.

### 17.2. Falhas observadas

Nenhuma falha específica foi relatada pelo responsável durante o registro dos resultados. Isso significa que não há ocorrências documentadas até o momento; não constitui comprovação de ausência absoluta de defeitos.

Caso uma falha seja identificada posteriormente, registrar o fluxo afetado, comportamento esperado e observado, passos para reprodução e evidência disponível.

### 17.3. Limitações técnicas e pendências

Os testes ocorreram no protótipo do Figma. Permanecem pendentes de validação na implementação:

- [ ] Cálculo dinâmico da distribuição para diferentes valores, regras e bases de cálculo.
- [ ] Ordem de execução, arredondamento a centavos e bloqueio de distribuição excedente.
- [ ] Persistência e atualização de saldos após receitas, despesas e transferências.
- [ ] Persistência da auditoria com valores anteriores e novos.
- [ ] Conciliação com diferenças positivas e negativas, cancelamento e preservação do histórico.
- [ ] Geração de arquivos reais de exportação e validação da integridade dos dados.
- [ ] Restauração efetiva de backup e tratamento de arquivos inválidos.
- [ ] Pagamentos sem lançamento de despesa duplicado ou desconto indevido.
- [ ] Testes automatizados ou manuais sobre a implementação das regras críticas de T2/T3.

Essas são limitações de validação técnica, não falhas comprovadas no protótipo.

### 17.4. Situação e próximos passos

- **Testes manuais no protótipo:** execução informada como satisfatória.
- **Falhas específicas relatadas:** nenhuma.
- **Validação técnica da implementação:** pendente.
- **Revisão integral dos critérios T2/T3:** pendente.
- **Revisão visual completa de todos os frames:** pendente.
- **Aprovação explícita da UX3:** pendente.

Próximos passos:
1. Preservar o resultado informado dos testes manuais.
2. Conferir a cobertura individual dos critérios T2/T3 e registrar eventuais lacunas.
3. Manter as limitações técnicas como pendências para a implementação.
4. Realizar a revisão visual completa e consolidar a documentação.
5. Solicitar aprovação explícita antes de concluir a UX3 ou iniciar formalmente a próxima etapa.

**Status final desta iteração: EM ANDAMENTO.** A execução manual informada não implica aprovação final nem comprovação funcional do aplicativo.

## 18. Décima iteração — revisão de cobertura T2/T3 e auditoria estrutural

**Data:** 29/10/2026  
**Status:** EM ANDAMENTO — sem aprovação final.

### 18.1. Revisão técnica da documentação

Foi feita leitura dos documentos `docs/requisitos/T2-regras-financeiras.md` e `docs/requisitos/T3-criterio-aceitacao.md` na branch de trabalho.

**T2 — regras financeiras:** o documento especifica invariantes RN-001 a RN-044 e inclui casos de teste essenciais CT-001 a CT-018. Os grupos cobrem representação monetária em centavos, consistência de saldos, configuração inicial, tipos e ordem das regras de distribuição, limites, despesas, transferências, carteira física, conciliação, arredondamento, edição, auditoria, idempotência e relatórios sem dupla contagem. A existência dessas regras e casos não comprova implementação nem execução dos testes contra código.

**T3 — critérios de aceitação:** o arquivo atual contém os critérios CA01 a CA11, cobrindo distribuição de recebimento, regra pontual, excesso de distribuição, despesa vinculada, saldo insuficiente, transferências, boleto pago/vencido, recorrência e metas. A revisão identificou que o documento termina no CA11 e não apresenta, no conteúdo atual, uma matriz de rastreabilidade para todos os casos CT-001 a CT-018 do T2. Portanto, a cobertura integral T2/T3 ainda não pode ser declarada concluída.

### 18.2. Estado da implementação

O arquivo `app/app/page.tsx` consultado na branch contém a página inicial padrão do Next.js, com conteúdo de boas-vindas e links de template. Não foram encontradas nessa página implementações das regras financeiras do Tangerina. Isso confirma que a validação funcional real das regras não pode ser feita a partir dessa página; não equivale a uma auditoria de todos os arquivos da aplicação.

### 18.3. Auditoria estrutural do Figma

A leitura estrutural do arquivo Figma retornou:

- `UX2 — Wireframes mobile`: 39 elementos de nível superior e 286 frames descendentes.
- `UX3 — Fluxos e validação`: 0 elementos filhos.
- Foram identificados frames de tela com dimensões de 390 × 844 px, incluindo boas-vindas, configuração, dashboard e formulário de receita.

**Achado de organização:** a página chamada `UX3 — Fluxos e validação` está vazia no estado atual consultado. Isso não invalida automaticamente os frames e conexões que estão na página UX2, mas contradiz a expectativa de que o mapa de fluxos esteja organizado dentro da página UX3. É necessário decidir se os artefatos devem ser movidos/organizados nessa página ou se o nome/descrição da página deve ser ajustado. Nenhuma alteração visual foi feita nesta auditoria.

A contagem e os nomes dos frames permitem auditoria estrutural inicial, mas não certificam a inspeção visual tela a tela de todos os 286 frames, nem substituem o modo Present.

### 18.4. Pendências atualizadas

- [ ] Criar matriz de rastreabilidade entre RN-001–RN-044, CT-001–CT-018, CA01–CA11 e telas/fluxos relevantes.
- [ ] Identificar explicitamente critérios T3 ausentes para os casos do T2 que não possuem critério de aceitação correspondente.
- [ ] Validar as regras financeiras em código executável após a implementação; a página inicial atual ainda é o template padrão do Next.js.
- [ ] Resolver a organização da página vazia `UX3 — Fluxos e validação` no Figma, sem mover ou apagar frames sem revisão.
- [ ] Executar revisão visual completa de todos os frames relevantes, incluindo cortes, hierarquia, espaçamento, consistência e estados de erro/vazio.
- [ ] Manter os testes manuais previamente relatados como satisfatórios no protótipo, sem convertê-los em evidência de funcionamento do código.
- [ ] Solicitar aprovação explícita do responsável antes de encerrar a UX3.

**Resultado desta iteração:** revisão documental e estrutural parcial realizada; cobertura integral T2/T3 e revisão visual completa ainda pendentes. **UX3 permanece EM ANDAMENTO.**

## 19. Décima primeira iteração — matriz de rastreabilidade e revisão visual amostral

**Data:** 29/10/2026  
**Status:** EM ANDAMENTO — aprovação final pendente.

### 19.1. Matriz inicial de rastreabilidade T2/T3

A matriz abaixo relaciona os casos de teste essenciais CT-001–CT-018 às regras RN-001–RN-044 e aos critérios de aceitação CA01–CA11 existentes. A associação é temática e documental; não significa que o critério tenha sido executado no aplicativo.

| Caso T2 | Regras relacionadas | Critério T3 relacionado | Cobertura documental |
|---|---|---|---|
| CT-001 — valor de R$ 0,01 | RN-001, RN-036 | Lacuna | Parcial: falta critério explícito de precisão monetária mínima |
| CT-002 — caixinhas acima do saldo inicial | RN-007–RN-011 | Lacuna | Falta critério explícito de configuração inicial inconsistente |
| CT-003 — distribuição menor que a receita | RN-016, RN-019 | CA01 | Coberto em nível funcional |
| CT-004 — distribuição excedente | RN-015, RN-037 | CA03 | Coberto em nível funcional; teste de limite permanece necessário na implementação |
| CT-005 — percentual sobre saldo restante | RN-013, RN-014, RN-038 | CA01, CA03 | Parcial: falta exemplo explícito com múltiplas bases e ordem |
| CT-006 — despesa acima da caixinha | RN-021, RN-022, RN-025 | CA04, CA05 | Coberto em nível funcional |
| CT-007 — despesa acima do saldo bancário | RN-023, RN-025 | CA05 | Coberto em nível funcional |
| CT-008 — transferência entre caixinhas | RN-003, RN-026, RN-027 | CA06 | Coberto em nível funcional |
| CT-009 — transferência entre contas | RN-002, RN-028, RN-029 | CA07 | Coberto em nível funcional |
| CT-010 — saque para carteira física | RN-030, RN-032 | Lacuna | Falta critério de aceitação explícito para saque/carteira |
| CT-011 — despesa em dinheiro | RN-024, RN-031 | CA04 | Parcial: CA04 não explicita carteira física |
| CT-012 — carteira insuficiente | RN-024 | Lacuna | Falta critério de aceitação explícito |
| CT-013 — conciliação com diferença | RN-033–RN-035 | Lacuna | Falta critério de aceitação explícito para prévia, justificativa e auditoria |
| CT-014 — cancelamento antes da confirmação | RN-018, RN-022, RN-032 | Parcial: CA02, CA05 | Falta critério transversal explícito de cancelamento sem efeitos |
| CT-015 — edição de movimento confirmado | RN-039–RN-043 | Lacuna | Falta critério explícito de auditoria com valores anteriores/novos e recálculo |
| CT-016 — repetição de confirmação | RN-005, RN-018, RN-042 | CA04, CA08 | Parcial: falta critério geral de idempotência para receita e transferência |
| CT-017 — fração de centavo | RN-001, RN-036–RN-038 | Lacuna | Falta critério explícito de arredondamento e proibição de exceder disponível |
| CT-018 — importação repetida de backup | RN-006, RN-042, RN-043 | Lacuna | Falta critério explícito de validação, prévia, cancelamento e importação sem duplicação |

### 19.2. Cobertura T3 que ainda precisa ser ampliada

O documento T3 agora contém CA01–CA19. Os critérios adicionais CA12–CA19 foram incluídos para cobrir as lacunas identificadas. A matriz inicial acima precisa ser lida junto à relação atualizada de CA12–CA19 na seção 3 do documento T3. A cobertura documental foi ampliada, mas a revisão de correspondência integral de todas as RN ainda não foi certificada.

- Conciliação de saldos e ajuste com justificativa.
- Saque e carteira física, incluindo saldo insuficiente.
- Edição, cancelamento rastreável e auditoria dos valores anteriores/novos.
- Arredondamento para centavos e preservação do limite disponível.
- Importação/restauração de backup, arquivo inválido e prevenção de duplicidade.
- Configuração inicial inconsistente e valores mínimos.
- Persistência consistente e ausência de efeitos parciais em falhas.

Esses itens são lacunas documentais a resolver em T3; não são falhas observadas no protótipo.

### 19.3. Revisão visual amostral

Foi feita inspeção estrutural e captura amostral de cinco frames: Boas-vindas (390 × 844), Dashboard (390 × 844), Formulário de receita (390 × 844), Revisão da distribuição (390 × 844) e Receita registrada (390 × 844).

A amostra confirma o uso consistente do frame mobile 390 × 844 nas telas selecionadas. A contagem estrutural continua indicando 286 frames descendentes na página `UX2 — Wireframes mobile` e nenhum elemento de nível superior na página `UX3 — Fluxos e validação`.

**Limite desta revisão:** a amostra não comprova que todos os 286 frames foram inspecionados visualmente. Não foram registradas falhas visuais específicas a partir desta revisão amostral, e não foram feitas alterações no Figma. A revisão visual completa permanece pendente.

### 19.4. Próximas ações para encerrar a UX3

- [ ] Revisar a matriz após inclusão de CA12–CA19 e certificar a correspondência de RN-001–RN-044, CT-001–CT-018 e CA01–CA19.
- [ ] Organizar ou renomear a página vazia `UX3 — Fluxos e validação` após decidir a organização desejada; não mover frames sem revisão.
- [ ] Concluir a inspeção visual de todos os frames relevantes e registrar achados concretos.
- [ ] Validar regras financeiras no aplicativo executável após sua implementação; o template atual em `app/app/page.tsx` não permite comprovar essa funcionalidade.
- [ ] Submeter relatório, matriz e revisão visual ao responsável para aprovação explícita.

**Resultado:** matriz inicial criada, critérios adicionais CA12–CA19 incluídos em T3 e revisão visual amostral registrada. A certificação integral da rastreabilidade T2/T3, a revisão visual completa e a validação da implementação permanecem pendentes. **UX3 permanece EM ANDAMENTO.**
## 20. Décima segunda iteração — certificação individual da matriz T2/T3

**Data:** 29/10/2026  
**Escopo:** revisão documental de RN-001–RN-044, CT-001–CT-018 e CA01–CA19.  
**Status:** rastreabilidade documental revisada; execução no aplicativo e cobertura completa dos critérios ainda pendentes.

### 20.1. Matriz por regra de negócio

A coluna “Cobertura” avalia se há ligação documental plausível entre a regra, um caso de teste T2 e um critério de aceitação T3. “Coberto” não significa que o teste foi executado no código; “Parcial” indica que o cenário relacionado existe, mas falta explicitar um limite, resultado ou verificação importante.

| Regra T2 | Caso(s) T2 | Critério(s) T3 | Cobertura documental / lacuna |
|---|---|---|---|
| RN-001 | CT-001, CT-017 | CA13 | Cobertura documental; execução no código pendente |
| RN-002 | CT-009 | CA07 | Coberto em nível de critério |
| RN-003 | CT-008 | CA06 | Coberto em nível de critério |
| RN-004 | CT-003 | CA01 | Parcial: interpretação de saldo não alocado com caixinhas negativas não explicitada |
| RN-005 | CT-016 | CA18 | Coberto em nível de critério |
| RN-006 | CT-014, CT-018 | CA17, CA19 | Parcial: atomicidade em falha de persistência exige teste técnico |
| RN-007 | CT-002 | CA12 | Coberto em nível de critério |
| RN-008 | CT-002 | CA12 | Coberto em nível de critério |
| RN-009 | CT-003 | CA01 | Parcial: caso de configuração com saldo não alocado não testado explicitamente |
| RN-010 | CT-001, CT-002 | CA12, CA13 | Parcial: saldo zero e valores inválidos precisam de casos próprios |
| RN-011 | CT-002, CT-013 | CA12, CA15 | Coberto em nível de critério |
| RN-012 | CT-003 | CA01 | Parcial: descrição, data e conta de destino não têm teste individual |
| RN-013 | CT-005 | CA01, CA03 | Parcial: falta cobertura explícita dos três tipos de regra |
| RN-014 | CT-005 | CA01, CA13 | Parcial: ordem configurável e bases variadas precisam de exemplos específicos |
| RN-015 | CT-004 | CA03 | Coberto em nível de critério |
| RN-016 | CT-003 | CA01 | Coberto em nível de critério |
| RN-017 | — | CA02 | Parcial: critério existe, falta caso de regressão que compare regra padrão antes/depois |
| RN-018 | CT-014, CT-016 | CA17, CA18 | Coberto em nível de critério |
| RN-019 | CT-003, CT-005 | CA01 | Parcial: falta verificar saldo da conta e alocações conjuntamente |
| RN-020 | CT-006, CT-011 | CA04, CA14 | Parcial: validação de campos obrigatórios sem caso individual |
| RN-021 | CT-006 | CA05 | Coberto em nível de critério |
| RN-022 | CT-014 | CA17 | Coberto em nível de critério |
| RN-023 | CT-007 | CA05 | Coberto em nível de critério |
| RN-024 | CT-012 | CA14 | Coberto em nível de critério |
| RN-025 | CT-006, CT-007, CT-011 | CA04, CA05, CA14 | Parcial: conferir origens diferentes e atualização única em cada origem |
| RN-026 | CT-008 | CA06 | Coberto em nível de critério |
| RN-027 | CT-008 | CA06 | Parcial: falta cenário de origem negativa/limite disponível |
| RN-028 | CT-009 | CA07 | Parcial: falta cenário explícito de insuficiência e mesma conta |
| RN-029 | CT-009 | CA07 | Parcial: critério não afirma diretamente que caixinhas globais não mudam |
| RN-030 | CT-010 | CA14 | Coberto em nível de critério |
| RN-031 | CT-011 | CA14 | Coberto em nível de critério |
| RN-032 | CT-010 | CA14, CA17 | Parcial: falha entre os dois lados do saque requer teste técnico de atomicidade |
| RN-033 | CT-013 | CA15 | Coberto em nível de critério |
| RN-034 | CT-013 | CA15 | Coberto em nível de critério |
| RN-035 | CT-013 | CA15 | Parcial: impacto em alocações globais deve ser verificado explicitamente |
| RN-036 | CT-001, CT-017 | CA13 | Coberto em nível de critério |
| RN-037 | CT-004, CT-017 | CA03, CA13 | Coberto em nível de critério |
| RN-038 | CT-005, CT-017 | CA13 | Parcial: sequência com várias bases de cálculo precisa de caso detalhado |
| RN-039 | CT-015 | CA16 | Coberto em nível de critério |
| RN-040 | CT-015 | CA16 | Parcial: bloqueio de edição que violaria saldo ainda precisa de caso próprio |
| RN-041 | CT-014, CT-015 | CA16, CA17 | Parcial: CT-014 cobre cancelamento antes da confirmação, não cancelamento de movimento confirmado |
| RN-042 | CT-016, CT-018 | CA18, CA19 | Coberto em nível de critério |
| RN-043 | CT-015, CT-018 | CA16, CA17, CA19 | Parcial: consistência entre saldo, movimento e auditoria exige testes de falha |
| RN-044 | CT-008, CT-009, CT-010 | CA06, CA07, CA14, CA18 | Parcial: relatório agregado sem transferências precisa de caso de teste específico |

### 20.2. Verificação dos identificadores

- **RN-001–RN-044:** todos os 44 identificadores foram percorridos individualmente na matriz acima.
- **CT-001–CT-018:** todos os 18 casos aparecem ao menos uma vez na matriz; isso confirma rastreabilidade temática, não execução automatizada.
- **CA01–CA19:** todos os 19 critérios foram consultados. CA01–CA11 cobrem fluxos de receita, despesas, transferências, boletos, recorrência e metas; CA12–CA19 complementam configuração inicial, precisão, carteira física, conciliação, auditoria, cancelamento, idempotência e backup.

### 20.3. Lacunas que impedem certificação integral

A rastreabilidade documental foi preenchida, mas a cobertura não deve ser declarada integral enquanto faltarem casos explícitos para:

1. RN-004: interpretação do saldo não alocado quando existem caixinhas negativas.
2. RN-010: configuração com saldos zero e entradas inválidas/negativas.
3. RN-012 e RN-020: validação individual dos campos obrigatórios.
4. RN-013–RN-014 e RN-038: comparação dos três tipos de regra, ordem configurada e bases diferentes em uma mesma receita.
5. RN-017: provar que alteração pontual não altera a regra padrão salva.
6. RN-027–RN-029: limites de transferência, origem negativa e preservação das caixinhas globais ao transferir entre contas.
7. RN-032 e RN-040–RN-043: falha parcial, edição que viola limites, cancelamento de movimento confirmado e consistência entre saldo, movimento e auditoria.
8. RN-044: relatório que exclui todas as modalidades de transferência dos totais de receitas/despesas.

### 20.4. Conclusão da certificação

**Resultado: rastreabilidade documental individualizada concluída nesta revisão; certificação integral de cobertura ainda não aprovada.** A matriz liga cada RN a casos e critérios quando aplicável e explicita as lacunas restantes. Não foi executada uma suíte de testes contra o aplicativo, pois a página consultada app/app/page.tsx ainda corresponde ao template padrão do Next.js. Os testes manuais relatados anteriormente continuam válidos apenas como resultado informado do protótipo Figma.

Próximo passo: decidir se as lacunas listadas devem ser adicionadas ao documento T3 como novos casos de aceitação, e depois prosseguir com a revisão visual e a organização do Figma. **UX3 permanece EM ANDAMENTO.**

## 21. Décima terceira iteração — revisão visual de fluxos críticos e prontidão técnica

**Data:** 29/10/2026  
**Status:** EM ANDAMENTO — aprovação final pendente.

### 21.1. Escopo visual inspecionado

Foram capturadas e inspecionadas visualmente as telas de Boas-vindas, Dashboard, Formulário de receita, Revisão da distribuição, Revisão da despesa, Falha ao salvar movimento, Estado vazio do histórico, Erro de validação e Prévia de restauração. Também foram selecionadas para inspeção as telas de Revisão da transferência, Conciliação registrada e Receita registrada. As telas inspecionadas têm frame de 390 × 844 px.

### 21.2. Achado visual — inconsistência aritmética no Dashboard

Na tela `06 — Início / Dashboard` (node `1:120`), os valores ilustrativos visíveis são:

- Saldo total: R$ 4.250,00.
- Caixinhas: R$ 2.100,00.
- Não alocado: R$ 350,00.

Esses números não fecham com a fórmula definida em T2: R$ 4.250,00 − R$ 2.100,00 = R$ 2.150,00, e não R$ 350,00. Registrar como **inconsistência de dados ilustrativos a corrigir**. Não é possível concluir pela captura se a causa está no texto do card, no valor total ou no total das caixinhas. Corrigir os valores do exemplo para que saldo bancário consolidado − total das caixinhas = saldo não alocado, sem alterar as regras aprovadas.

### 21.3. Outros achados da amostra

- A tela de Revisão da distribuição apresenta receita de R$ 2.500,00, reserva de R$ 250,00, despesas do mês de R$ 450,00 e não alocado de R$ 1.800,00. Os valores somam R$ 2.500,00; a segunda regra usa 20% de R$ 2.250,00 após a primeira destinação, coerente com o exemplo de base restante.
- A tela de Falha ao salvar movimento informa que a movimentação não foi confirmada e oferece tentar novamente, voltar ao formulário ou cancelar; a mensagem deixa claro que os dados anteriores permanecem disponíveis.
- O Estado vazio do histórico explica a ausência de movimentos e oferece ações para registrar uma movimentação ou voltar ao início.
- O Erro de validação mostra o campo de valor inválido e oferece corrigir ou cancelar. A prévia de restauração avisa sobre a substituição dos dados e oferece confirmar ou manter os dados atuais.
- A hierarquia visual amostrada mantém títulos, blocos de informação e ações principais em sequência vertical. Esta observação não certifica todos os frames ou todos os estados.

### 21.4. Organização da página UX3 no Figma

A página `UX2 — Wireframes mobile` deve continuar sendo a fonte dos frames/telas. A página `UX3 — Fluxos e validação` deve ser usada como área de documentação visual da etapa: mapa de jornadas, checklist de validação, referências aos frames existentes e resumo de achados, sem duplicar nem mover as telas de origem. A página estava vazia na inspeção. **Nenhuma alteração foi feita no Figma nesta iteração**; criar esse conteúdo exige uma edição separada e verificável.

### 21.5. Validação do aplicativo executável

A inspeção anterior de `app/app/page.tsx` encontrou o template padrão do Next.js. Não há base nessa página para executar testes de cálculo financeiro, persistência, auditoria, pagamento ou backup. Portanto:

- **Protótipo Figma:** resultados manuais foram informados pelo responsável como satisfatórios.
- **Implementação executável:** não validada; não declarar aprovada nem reprovada funcionalmente com base apenas na página inicial.
- **Próxima ação técnica:** localizar os módulos implementados e testes existentes no repositório; se não existirem, a validação funcional fica bloqueada até implementar o MVP.

### 21.6. Situação após a revisão

- [x] Inspeção visual amostral dos fluxos principais e estados críticos.
- [x] Inconsistência aritmética do Dashboard documentada.
- [x] Definida recomendação de organização para a página UX3, sem alterar o Figma.
- [ ] Corrigir e validar os valores ilustrativos do Dashboard.
- [ ] Revisar visualmente todos os frames relevantes restantes; a inspeção completa dos 286 frames não está concluída.
- [ ] Criar o mapa/checklist na página UX3, após a edição visual ser autorizada/executada.
- [ ] Localizar e validar a implementação financeira real e os testes automatizados.
- [ ] Obter aprovação explícita do responsável.

**Conclusão:** revisão visual amostral avançou e identificou uma inconsistência concreta no Dashboard. A organização recomendada para UX3 está definida, mas não aplicada. A validação técnica real continua bloqueada pela ausência de funcionalidades financeiras verificadas no arquivo inicial. **UX3 permanece EM ANDAMENTO.**
