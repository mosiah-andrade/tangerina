# UX1 — Inventário de telas e estados do MVP

- **Projeto:** Tangerina Financeiro
- **Tarefa:** UX1 — Inventariar telas e estados do MVP
- **Área:** UX
- **Status:** Concluída
- **Base:** Briefing funcional, T1 — Escopo do MVP, T2 — Regras financeiras, T3 — Critérios de aceitação, T4 — Mapa de navegação e fluxos e ADR-001 — Stack tecnológica.
- **Objetivo:** definir o conjunto de telas e estados que deverá orientar a prototipação de baixa fidelidade (UX2) e a validação dos fluxos (UX3).

## 1. Escopo e princípios

Este inventário descreve a experiência esperada, não uma implementação de interface. A presença de uma tela ou estado nesta lista não significa que já exista no aplicativo.

Princípios herdados dos documentos do produto:

- Mobile-first; priorizar navegação inferior para Início, Caixinhas, Movimentações e Contas a pagar. No desktop, a hierarquia pode ser apresentada em menu lateral.
- Interface em português do Brasil.
- Operações financeiras mostram uma revisão explícita antes de salvar.
- Exibir separadamente saldo bancário, saldos das caixinhas e saldo não alocado, evitando dupla contagem.
- Informar sucesso somente após persistência confirmada; falhas não podem deixar a interface afirmando que uma operação foi concluída.
- Dados locais e funcionamento offline devem ser comunicados com clareza.
- Estados não devem depender somente de cor; manter rótulos, mensagens, foco visível e controles acessíveis.
- Regras de negócio existentes são a fonte de verdade. Questões ainda pendentes devem permanecer identificadas, sem serem transformadas em decisões silenciosas de UX.

## 2. Inventário de telas

| ID | Tela/fluxo | Objetivo e conteúdo essencial | Ações principais |
|---|---|---|---|
| UX-S01 | Boas-vindas | Explicar brevemente a proposta do Tangerina e apresentar a ação de início. | Começar; continuar configuração existente, quando aplicável. |
| UX-S02 | Aviso de armazenamento local | Explicar que os dados ficam no dispositivo, que não há sincronização automática entre dispositivos e que o usuário deve cuidar de seus backups. | Continuar; voltar. |
| UX-S03 | Contas bancárias e saldos iniciais | Cadastrar uma ou mais contas e informar saldo inicial de cada uma. | Adicionar/editar conta; revisar valores; continuar. |
| UX-S04 | Caixinhas e saldos iniciais | Criar caixinhas globais e informar os saldos iniciais, sem vínculo exclusivo com uma conta bancária. | Adicionar/editar caixinha; revisar valores; continuar. |
| UX-S05 | Regras de distribuição inicial | Configurar regras ordenadas por valor fixo, percentual da receita bruta ou percentual do saldo restante. | Adicionar, remover e reordenar regras; editar base; continuar. |
| UX-S06 | Revisão e conclusão da configuração | Resumir contas, saldos, caixinhas, regras, total alocado e saldo não alocado. | Voltar para corrigir; confirmar configuração. |
| UX-S07 | Início / painel | Apresentar o contexto selecionado, saldo bancário consolidado, total das caixinhas, saldo não alocado, próximos vencimentos e atalhos para ações frequentes. | Novo recebimento; nova despesa; transferir; consultar áreas. |
| UX-S08 | Contas bancárias | Listar contas e respectivos saldos; disponibilizar cadastro, edição/arquivamento conforme escopo e acesso a transferência e conciliação. | Abrir conta; adicionar/editar; transferir; conciliar. |
| UX-S09 | Lista e detalhe de caixinha | Mostrar nome, saldo e movimentações relacionadas à caixinha; disponibilizar criação, edição, arquivamento e transferência entre caixinhas. | Criar/editar; abrir detalhes; transferir. |
| UX-S10 | Recebimento — formulário | Capturar valor, descrição, data e conta bancária de destino; permitir escolher regras de distribuição. | Informar dados; calcular prévia; cancelar. |
| UX-S11 | Recebimento — revisão da distribuição | Mostrar cada destinação, ordem e base de cálculo, total distribuído e valor não alocado. | Ajustar distribuição pontual; voltar; confirmar. |
| UX-S12 | Despesa ou retirada — formulário | Capturar valor, descrição, data, origem do pagamento e caixinha associada quando aplicável. Diferenciar despesa paga por conta bancária de despesa paga pela carteira física. | Informar dados; validar; revisar; cancelar. |
| UX-S13 | Transferência | Selecionar tipo de transferência, origem, destino, valor, data e justificativa opcional quando aplicável. Mostrar os dois lados do efeito. | Revisar; confirmar; editar; cancelar. |
| UX-S14 | Contas a pagar — lista e formulário | Listar contas pendentes, vencidas e próximas; cadastrar valor, descrição, vencimento e recorrência. | Criar/editar conta; abrir ocorrência; revisar recorrência. |
| UX-S15 | Revisão e confirmação de pagamento | Mostrar a conta/ocorrência, valor e data efetiva antes de registrar pagamento e movimentação associada. | Confirmar pagamento; cancelar. |
| UX-S16 | Metas financeiras | Listar metas, valor-alvo, prazo opcional e progresso; permitir criação e consulta. | Criar/editar meta; abrir detalhes. |
| UX-S17 | Histórico de movimentações | Listar movimentações com filtros por período, tipo, conta, caixinha e categoria; distinguir receitas, despesas, transferências, saques e ajustes. | Pesquisar; filtrar; abrir detalhes. |
| UX-S18 | Detalhe de movimentação e auditoria | Exibir dados da operação, estado, efeitos financeiros e histórico de alterações; disponibilizar ações permitidas. | Editar; cancelar com confirmação; consultar auditoria. |
| UX-S19 | Conciliação | Mostrar saldo registrado, saldo observado, diferença e justificativa; apresentar a prévia do ajuste. | Informar saldo; revisar; confirmar ajuste; cancelar. |
| UX-S20 | Relatórios | Apresentar resumos por período, categorias e caixinhas sem contabilizar transferências internas como receitas/despesas. | Escolher período; filtrar; consultar resumo. |
| UX-S21 | Exportação de dados | Avisar sobre a sensibilidade dos dados e orientar a salvar o arquivo em local seguro. | Gerar e salvar arquivo; tentar novamente em caso de falha. |
| UX-S22 | Importação de dados | Selecionar arquivo, validar formato/versão/conteúdo, mostrar prévia e impacto antes de aplicar. | Selecionar arquivo; revisar; confirmar ou cancelar. |
| UX-S23 | Configurações e informações do aplicativo | Acessar regras padrão de distribuição, preferências, dados locais, informações de offline e ajuda. | Ajustar configurações; acessar exportação/importação. |

### 2.1. Navegação principal

**Celular:** Início, Caixinhas, Movimentações e Contas a pagar na navegação principal. Contas bancárias, Metas, Histórico, Relatórios e Configurações devem estar acessíveis por navegação secundária, sem profundidade excessiva.

**Desktop:** manter as mesmas áreas e hierarquia, podendo usar menu lateral. A adaptação desktop não deve alterar regras ou nomes de domínio.

## 3. Catálogo de estados transversais

Estes estados devem ser considerados em todas as telas em que se aplicam, não tratados como telas independentes necessariamente.

| Código | Estado | Quando aparece | Comportamento esperado |
|---|---|---|---|
| ST-01 | Inicial/carregando | Leitura, cálculo ou preparação de uma operação. | Indicar que a ação está em andamento e evitar submissões repetidas. |
| ST-02 | Vazio | Lista sem registros ou primeiro uso. | Explicar o que ainda não existe e oferecer uma próxima ação clara, sem inventar dados. |
| ST-03 | Validação de campo | Campo obrigatório ausente, valor inválido ou formato incorreto. | Identificar o campo e explicar como corrigir; preservar os dados já digitados quando possível. |
| ST-04 | Revisão antes de salvar | Antes de confirmar operação financeira ou configuração relevante. | Resumir dados e efeitos financeiros antes da confirmação. |
| ST-05 | Sucesso persistido | A gravação foi concluída. | Confirmar o resultado e atualizar os saldos/listas afetados. |
| ST-06 | Falha de gravação | Persistência falhou ou resultado não pôde ser confirmado. | Não mostrar sucesso; informar a falha, preservar estado consistente e orientar a próxima ação. |
| ST-07 | Cancelado | Usuário cancela antes de confirmar. | Retornar ao ponto apropriado sem persistir efeitos financeiros não confirmados. |
| ST-08 | Offline | Sem conexão de internet. | Identificar o estado quando relevante e manter disponíveis os fluxos locais que suportem offline; não prometer sincronização. |
| ST-09 | Armazenamento indisponível | O armazenamento local não pode ser acessado ou gravado. | Bloquear a confirmação de operações que não podem ser persistidas e explicar o problema. |
| ST-10 | Dados locais existentes | Aplicação atualizada ou abertura posterior com dados já registrados. | Preservar os dados; não apresentar a configuração inicial como se fosse a primeira execução nem sobrescrever registros. |
| ST-11 | Confirmação destrutiva ou sensível | Cancelar movimentação confirmada, importar dados ou executar ação com efeito importante. | Explicar claramente o impacto e exigir decisão explícita. |
| ST-12 | Operação bloqueada por regra | A operação viola uma regra financeira. | Informar motivo e valores relevantes; não aplicar alteração parcial. |
| ST-13 | Filtro sem resultados | A busca/filtros não encontram registros. | Explicar que não há resultados para os filtros atuais e permitir limpar filtros. |

## 4. Estados e validações financeiras críticas

| Contexto | Condição | Resultado obrigatório na interface |
|---|---|---|
| Configuração inicial | Total das caixinhas maior que saldo bancário consolidado. | Bloquear conclusão; mostrar total, saldo e diferença exata; permitir corrigir os valores. |
| Configuração inicial | Total das caixinhas menor que saldo bancário consolidado. | Permitir continuar e mostrar a diferença como saldo não alocado. |
| Distribuição de recebimento | Destinações excedem o valor disponível. | Bloquear confirmação e mostrar o excesso; não reduzir valores silenciosamente. |
| Distribuição de recebimento | Destinações abaixo do recebimento. | Manter o restante visível como saldo não alocado. |
| Despesa | Despesa ultrapassa saldo da caixinha, mas a origem de pagamento tem saldo suficiente. | Informar que a caixinha ficará negativa e exigir confirmação explícita. |
| Despesa bancária | Valor excede saldo disponível da conta. | Bloquear por padrão; mostrar valor da despesa, saldo disponível e quanto falta. |
| Despesa em dinheiro | Valor excede saldo da carteira física. | Bloquear por padrão e mostrar a diferença. |
| Transferência entre caixinhas | Origem igual ao destino ou valor maior que o saldo disponível da origem. | Impedir confirmação e indicar o problema. |
| Transferência entre contas | Origem igual ao destino ou saldo insuficiente na origem. | Impedir confirmação e indicar o problema. |
| Saque para carteira física | Valor excede saldo bancário disponível. | Bloquear; não registrar saque nem despesa parcial. |
| Conta a pagar | Conta vencida, mas pagamento não confirmado. | Manter pendente; vencimento não equivale a pagamento. |
| Recorrência | Data mensal escolhida não existe no mês de ocorrência. | Exibir a regra de calendário já definida nos critérios da T3; se houver ambiguidade documental, não inventar comportamento no protótipo. |
| Conciliação | Há diferença entre saldo observado e registrado. | Mostrar ambos os valores, diferença e justificativa obrigatória antes de confirmar ajuste. |
| Importação | Arquivo inválido ou incompatível. | Recusar sem alterar dados atuais e explicar o motivo. |
| Importação | Arquivo válido. | Mostrar prévia e impacto; explicar a política de substituição/mesclagem assim que for aprovada; só aplicar após confirmação. |
| Edição/cancelamento | Movimentação já confirmada. | Mostrar impacto e preservar auditoria; não apagar silenciosamente o histórico. |
| Confirmação repetida | Usuário tenta confirmar a mesma operação novamente. | Evitar duplicidade; a interface não deve induzir criação de uma segunda operação. |

## 5. Requisitos transversais de conteúdo e acessibilidade

- Usar rótulos explícitos para valores, datas, origem, destino, conta e caixinha.
- Formatar valores monetários em real brasileiro (R$) e exibir precisão até centavos.
- Mensagens de erro devem dizer o que ocorreu e como corrigir, não depender apenas de cor ou ícone.
- Controles principais devem ter nomes compreensíveis, foco visível e ordem de navegação coerente.
- Confirmações devem descrever o efeito real da operação, evitando mensagens vagas como “Tem certeza?” sem contexto.
- Distinguir saldo bancário, saldo das caixinhas, saldo não alocado e carteira física.
- Transferências internas não podem aparecer visualmente como novas receitas ou despesas de consumo.
- Estados vazios devem orientar a próxima ação, mas não criar automaticamente dados financeiros fictícios.
- Evitar linguagem que sugira backup automático ou sincronização em nuvem quando o fluxo é local.

## 6. Pendências que devem permanecer explícitas

1. **Importação:** a T4 registra que a política final entre substituir e mesclar dados precisa ser definida antes da implementação. Não decidir isso no protótipo sem aprovação.
2. **Recorrências em dias inexistentes:** usar a regra aprovada na T3; se o documento não a expressar claramente, registrar a divergência antes de desenhar um comportamento definitivo.
3. **PIN/senha local e criptografia do arquivo exportado:** estão como questões futuras/pós-MVP ou pendentes, não como telas obrigatórias de autenticação do MVP.
4. **Fidelidade visual:** cores finais, espaçamentos e componentes refinados serão definidos após o protótipo de baixa fidelidade; este inventário não substitui o manual de identidade.
5. **Metas:** o método de cálculo do progresso deve permanecer explícito na interface e na configuração, conforme o briefing; não presumir um método único.

## 7. Critérios de conclusão da UX1

- [x] As telas principais do MVP foram inventariadas com objetivo e ações.
- [x] Os estados transversais de carregamento, vazio, validação, confirmação, sucesso, falha, offline e armazenamento indisponível foram catalogados.
- [x] Os casos financeiros críticos foram ligados aos comportamentos de interface esperados.
- [x] As áreas e os fluxos mantêm alinhamento com a T4 e com as regras da T2.
- [x] As pendências de produto foram preservadas como pendências, sem criar decisões novas.
- [x] O documento está pronto para servir de entrada à UX2 — protótipo de baixa fidelidade no Figma.

## 8. Relação com outros documentos

- `briefing_app_financeiro.md` — briefing funcional.
- `docs/requisitos/T1-escopo-mvp.md` — escopo e premissas.
- `docs/requisitos/T2-regras-financeiras.md` — regras financeiras.
- `docs/requisitos/T3-criterio-aceitacao.md` — critérios de aceitação.
- `docs/ux/T4-mapa-navegacao-fluxos.md` — mapa de navegação e fluxos.
- `docs/decisoes/ADR-001-stack.md` — decisões técnicas aprovadas.
- `tangerina_roadmap.html` — acompanhamento das tarefas.

## 9. Histórico de versão

| Versão | Alteração |
|---|---|
| 1.0 | Inventário inicial de telas, estados transversais e validações financeiras para orientar UX2. |
