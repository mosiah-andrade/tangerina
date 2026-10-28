# Briefing técnico: Aplicativo de gestão financeira por caixinhas

**Versão:** 1.0  
**Idioma:** Português do Brasil  
**Moeda padrão:** Real brasileiro (BRL)  
**Tipo de produto:** Aplicativo web instalável (PWA), offline-first e com armazenamento local

---

## 1. Visão geral do produto

Desenvolver um aplicativo de gestão financeira pessoal e empresarial baseado no conceito de **caixinhas**: valores separados virtualmente para finalidades específicas, como investimentos, dízimo, contas, pró-labore e despesas da empresa.

O aplicativo deve permitir registrar entradas e saídas, sugerir a distribuição dos recebimentos de acordo com regras configuráveis, acompanhar contas a pagar, controlar contas bancárias, registrar transferências entre caixinhas, definir metas e consultar relatórios.

A experiência deve ser simples, previsível, clara e acessível. Todas as movimentações financeiras devem ser revisadas e confirmadas pelo usuário antes de serem salvas.

## 2. Objetivos principais

- Registrar recebimentos manualmente.
- Sugerir a distribuição de cada recebimento entre caixinhas.
- Permitir revisar e ajustar a distribuição antes de confirmar.
- Controlar saldos de contas bancárias e saldos virtuais das caixinhas.
- Registrar despesas e retiradas.
- Controlar contas a pagar, recorrências e vencimentos.
- Exibir lembretes visuais dentro do aplicativo.
- Acompanhar metas financeiras.
- Consultar histórico, filtros e relatórios básicos.
- Fazer conciliação manual de saldos.
- Exportar e importar dados manualmente para transporte ou recuperação.

## 3. Escopo do MVP

### Incluído no MVP

1. Configuração inicial guiada.
2. Cadastro de contas bancárias e saldos iniciais.
3. Cadastro de caixinhas e saldos iniciais.
4. Regras padrão de distribuição por caixinha.
5. Registro de recebimentos e distribuição assistida.
6. Registro de despesas e retiradas.
7. Transferências entre caixinhas.
8. Transferências entre contas bancárias.
9. Contas a pagar avulsas e recorrentes.
10. Lista de vencimentos com contagem regressiva.
11. Histórico com filtros.
12. Metas financeiras.
13. Ajustes e conciliação de saldo.
14. Relatórios básicos.
15. Registro de alterações relevantes.
16. Exportação e importação manual dos dados.

### Fora do escopo inicial

- Login ou criação de conta em servidor.
- Sincronização automática entre dispositivos.
- Armazenamento em nuvem.
- Backup automático.
- Notificações push.
- Integração automática com bancos.
- Open Finance.
- Importação automática de extratos.
- Funcionalidades avançadas de contabilidade ou emissão fiscal.

## 4. Usuários, dispositivos e privacidade

O aplicativo poderá ser utilizado por uma pessoa, casal, família ou empreendedor, mas **cada dispositivo manterá seus próprios dados locais**. Não haverá sincronização automática entre pessoas ou dispositivos.

Requisitos:

- O aplicativo deve funcionar sem conexão após ser carregado e instalado.
- O armazenamento principal será local no dispositivo.
- Não será exigido login.
- Não haverá envio automático dos dados financeiros para um servidor.
- A transferência de dados entre dispositivos será feita por exportação e importação manual.
- A interface deverá explicar claramente que dados locais podem ser perdidos se o dispositivo ou os dados do navegador forem apagados.
- A possibilidade de bloqueio local por senha/PIN e criptografia do arquivo exportado deve ser avaliada como medida adicional de segurança.

## 5. Plataforma e experiência de uso

### Plataforma

- Aplicativo web progressivo (PWA).
- Instalável em dispositivos compatíveis.
- Layout responsivo para celular e computador.
- Funcionamento offline para consulta e movimentações.
- Interface em português do Brasil.
- Formatação de valores em reais.
- Datas em formato brasileiro.

### Navegação sugerida

No celular, utilizar navegação inferior. No computador, adaptar para menu lateral ou navegação equivalente.

Seções principais:

1. Início
2. Recebimentos
3. Caixinhas
4. Despesas
5. Contas a pagar
6. Contas bancárias
7. Metas
8. Histórico
9. Relatórios
10. Configurações e dados

### Princípios de UX

- Fluxos curtos e previsíveis.
- Uma ação principal claramente destacada por tela.
- Confirmação antes de gravar movimentações.
- Mensagens de erro objetivas, com indicação de como corrigir.
- Evitar excesso de informação visual.
- Não depender apenas de cores para comunicar status.
- Permitir revisar os dados antes de concluir.
- Considerar necessidades de acessibilidade e previsibilidade sem presumir que todas as pessoas tenham as mesmas preferências.

A identidade visual existente será fornecida posteriormente. Não criar uma marca nova sem autorização.

## 6. Conceito financeiro: contas bancárias e caixinhas

### Contas bancárias

Representam contas reais ou fontes de dinheiro disponíveis, cadastradas manualmente pelo usuário.

O saldo calculado de uma conta é:

`Saldo calculado = saldo inicial + entradas - saídas + ajustes de conciliação`

Cada recebimento e cada despesa deverá indicar a conta bancária envolvida. Transferências bancárias deverão indicar conta de origem e conta de destino.

### Caixinhas

São destinos virtuais para reservar e organizar dinheiro. Exemplos:

- Investimentos
- Dízimo
- Contas
- Pró-labore
- Empresa
- Reserva de emergência
- Objetivos pessoais

A distribuição de um recebimento entre caixinhas **não representa uma saída bancária**. O dinheiro continua na conta bancária, mas passa a estar reservado virtualmente para finalidades específicas.

### Regra essencial para o painel

O painel deve distinguir:

- **Saldo bancário:** dinheiro registrado nas contas bancárias.
- **Valor reservado em caixinhas:** parte do saldo bancário destinada a finalidades específicas.
- **Valor não alocado:** parte do saldo ainda não distribuída.

O valor reservado nas caixinhas já está incluído no saldo bancário. Portanto, o painel não deve somar saldo bancário e saldo das caixinhas como se fossem patrimônios separados, pois isso duplicaria o dinheiro.

## 7. Recebimentos e distribuição

### Fluxo esperado

1. O usuário inicia um novo recebimento.
2. Informa valor, descrição, data e conta bancária de destino.
3. O sistema apresenta as caixinhas disponíveis.
4. O usuário escolhe quais regras padrão deseja aplicar.
5. O aplicativo calcula uma sugestão de distribuição.
6. O usuário revisa e pode alterar os valores apenas para aquele recebimento.
7. O aplicativo informa o total distribuído e o valor não alocado.
8. Se a distribuição superar o recebimento, o aplicativo apresenta um alerta e exige correção ou decisão explícita.
9. O usuário confirma.
10. O sistema grava a entrada, as alocações e o histórico correspondente.

A descrição do recebimento será texto livre. Não haverá, inicialmente, um cadastro obrigatório de tipos de recebimento. Caso seja necessário que as regras mudem automaticamente conforme o tipo de entrada, essa decisão deverá ser revista antes da implementação.

### Modelos de regra por caixinha

Cada caixinha poderá ter um modelo padrão:

- **Percentual:** calcula uma porcentagem da base definida.
- **Valor fixo:** reserva um valor definido em reais.

Para regras percentuais, a base poderá ser:

- **Valor bruto do recebimento:** percentual calculado sobre o valor total recebido.
- **Saldo restante:** percentual calculado sobre o valor que ainda não foi distribuído pelas regras anteriores.

O usuário poderá selecionar quais regras aplicar em cada recebimento. Uma alteração pontual não deverá modificar a regra padrão salva na caixinha.

### Exemplo ilustrativo

Para um recebimento de R$ 1.000,00:

| Caixinha | Regra aplicada | Valor |
|---|---|---:|
| Investimentos | 20% do valor bruto | R$ 200,00 |
| Dízimo | 10% do valor bruto | R$ 100,00 |
| Contas | Valor fixo | R$ 300,00 |
| Pró-labore | 25% do saldo restante após as regras anteriores | R$ 100,00 |
| **Total distribuído** |  | **R$ 700,00** |
| **Não alocado** |  | **R$ 300,00** |

Este exemplo serve apenas para demonstrar o cálculo. A ordem das regras baseadas no saldo restante precisa ser explícita e consistente.

### Regras de integridade

- Nunca ajustar silenciosamente uma distribuição que exceda o recebimento.
- Nunca eliminar automaticamente um valor não alocado.
- Mostrar os cálculos antes da confirmação.
- Arredondar valores monetários para centavos segundo uma regra uniforme.
- Evitar erros de ponto flutuante usando uma representação monetária segura, preferencialmente inteiros em centavos.
- Preservar a regra padrão quando houver uma alteração temporária para um único recebimento.
- Permitir distribuição manual quando nenhuma regra for aplicada.

## 8. Despesas e retiradas

O usuário deverá selecionar a caixinha e a conta bancária envolvidas.

Uma despesa normalmente reduz:

- O saldo da conta bancária selecionada.
- O saldo da caixinha selecionada.

A despesa deverá guardar valor, descrição, data, categoria, contexto (pessoal ou empresarial), conta bancária, caixinha e observações opcionais.

O sistema deverá diferenciar despesa de retirada, mesmo que ambas possam reduzir os saldos envolvidos.

### Saldo insuficiente na caixinha

Se uma despesa exceder o saldo da caixinha, mostrar o valor disponível e a diferença. O usuário deverá escolher explicitamente entre:

- Permitir saldo negativo na caixinha.
- Registrar a diferença como pendente, sem contabilizá-la novamente como uma segunda despesa.

A aplicação não deve duplicar a saída bancária nem a despesa ao registrar uma diferença pendente.

## 9. Transferências

### Entre caixinhas

Campos:

- Caixinha de origem.
- Caixinha de destino.
- Valor.
- Data.
- Justificativa opcional.

Uma transferência entre caixinhas reduz uma caixinha e aumenta outra. Não deve alterar o saldo bancário nem ser contabilizada como novo recebimento ou nova despesa.

### Entre contas bancárias

Campos:

- Conta de origem.
- Conta de destino.
- Valor.
- Data.
- Descrição opcional.

A transferência reduz o saldo da conta de origem e aumenta o saldo da conta de destino. Não deve ser contabilizada como receita ou despesa consolidada.

Todas as transferências exigem confirmação e devem aparecer no histórico.

## 10. Contas a pagar e vencimentos

O aplicativo deverá permitir cadastrar contas avulsas e recorrentes.

### Campos

- Nome ou descrição.
- Valor previsto.
- Data de vencimento.
- Recorrência.
- Data final opcional da recorrência.
- Categoria.
- Contexto pessoal ou empresarial.
- Observações opcionais.

### Recorrências

Devem ser consideradas recorrências semanais, mensais, anuais e personalizadas. As regras para datas inexistentes ou meses mais curtos, como uma conta que vence no dia 31, precisam ser definidas e testadas.

### Lista de contas

Exibir, no mínimo:

- Nome da conta.
- Valor.
- Vencimento.
- Dias restantes ou dias de atraso.
- Recorrência.
- Status.

A lista deverá priorizar as contas com vencimento mais próximo.

### Pagamento

- O pagamento será confirmado manualmente pelo usuário.
- Chegar à data de vencimento não significa que a conta foi paga.
- Contas vencidas permanecem pendentes até a confirmação.
- Ao confirmar, guardar o valor pago, vencimento original e data efetiva de pagamento.
- Cada ocorrência recorrente paga deverá permanecer no histórico.

### Lembretes

- Lembretes visuais dentro do aplicativo.
- Antecedência configurável, por exemplo, 3 ou 7 dias.
- Destaque para contas vencidas.
- Sem notificações push no MVP.

## 11. Metas financeiras

O usuário poderá criar metas com:

- Nome.
- Valor-alvo.
- Valor atual calculado.
- Valor restante para atingir a meta.
- Método de cálculo do progresso.
- Prazo opcional, a confirmar.

Métodos de progresso:

1. **Saldo atual:** progresso calculado pelo valor atualmente reservado para a meta.
2. **Contribuições acumuladas:** progresso calculado pela soma das contribuições registradas, mesmo que tenham ocorrido retiradas posteriores.

O método escolhido deve ser apresentado claramente para evitar interpretações equivocadas.

## 12. Categorias e contextos

As categorias poderão ser sugeridas pelo aplicativo, mas deverão ser editáveis. O usuário poderá criar, renomear, arquivar e excluir categorias quando não houver impedimento de integridade histórica.

O contexto de uma movimentação poderá ser pessoal ou empresarial. A interface e os relatórios deverão permitir filtrar por contexto.

Ainda é necessário decidir se contas bancárias e caixinhas poderão ser compartilhadas entre os contextos pessoal e empresarial ou se cada item pertencerá exclusivamente a um deles.

## 13. Histórico e auditoria

O histórico deverá ser cronológico e permitir filtros por:

- Período.
- Tipo de movimentação.
- Caixinha.
- Conta bancária.
- Categoria.
- Contexto pessoal ou empresarial.

Deverão ser registradas alterações relevantes, incluindo:

- Criação e edição de movimentações.
- Transferências.
- Ajustes de saldo.
- Conciliações.
- Confirmação de pagamento.
- Alterações relevantes em regras de distribuição.

O registro de auditoria deverá guardar, quando aplicável, data e hora, tipo de ação, referência à movimentação e resumo da alteração.

Sempre que possível, preferir arquivar ou cancelar registros em vez de apagá-los definitivamente quando a exclusão puder prejudicar o histórico financeiro.

## 14. Conciliação bancária e ajustes

O usuário deverá poder comparar o saldo calculado pelo aplicativo com o saldo real informado pelo banco.

Fluxo:

1. Selecionar a conta bancária.
2. Informar o saldo real observado.
3. Visualizar o saldo calculado e a diferença.
4. Informar uma justificativa.
5. Revisar o ajuste.
6. Confirmar.

O ajuste deverá ficar registrado no histórico de auditoria. O aplicativo não deverá alterar movimentações antigas silenciosamente para forçar a coincidência dos saldos.

## 15. Exportação e importação de dados

A exportação será manual e deverá produzir um arquivo que permita transportar os dados para outro dispositivo ou guardá-los pelo próprio usuário.

A importação deverá validar a estrutura do arquivo antes de alterar os dados locais.

Pontos a decidir antes da implementação:

- Se a importação substituirá os dados atuais, mesclará os registros ou oferecerá as duas opções.
- Como detectar registros duplicados durante uma mesclagem.
- Como tratar versões antigas do formato exportado.
- Se o arquivo poderá ser protegido por senha ou criptografia.

A interface deve alertar que a importação pode modificar os dados existentes e solicitar confirmação antes de prosseguir.

## 16. Modelo de dados sugerido

O modelo abaixo é conceitual. Os campos e relacionamentos definitivos deverão ser detalhados durante a arquitetura e implementação.

### `BankAccount`

- Identificador.
- Nome.
- Instituição opcional.
- Saldo inicial.
- Data do saldo inicial.
- Status ativo/arquivado.
- Contexto ou finalidade, se definido.

### `Caixinha`

- Identificador.
- Nome.
- Descrição opcional.
- Saldo inicial.
- Categoria ou finalidade.
- Contexto, se definido.
- Status ativo/arquivado.

### `DistributionRule`

- Identificador.
- Caixinha associada.
- Tipo: percentual ou valor fixo.
- Valor da regra.
- Base percentual: valor bruto ou saldo restante.
- Ordem de execução.
- Status ativo/inativo.

### `Transaction`

Registro principal da movimentação.

- Identificador.
- Tipo: recebimento, despesa, retirada, transferência, ajuste ou outro tipo definido.
- Valor.
- Descrição.
- Data efetiva.
- Conta bancária ou contas envolvidas.
- Categoria.
- Contexto.
- Observações.
- Status.
- Datas de criação e alteração.

### `Allocation`

- Identificador.
- Movimentação de origem.
- Caixinha.
- Valor alocado.
- Regra utilizada, quando houver.
- Cópia dos parâmetros aplicados no momento da distribuição, quando necessário para auditoria.

### `Bill`

- Identificador.
- Nome.
- Valor previsto.
- Regra de recorrência.
- Próximo vencimento.
- Data final opcional.
- Categoria.
- Contexto.
- Antecedência do lembrete.
- Status.

### `BillOccurrence`

- Identificador.
- Conta recorrente de origem.
- Data de vencimento.
- Valor previsto.
- Valor pago.
- Data de pagamento.
- Status pendente/paga/cancelada.
- Movimentação financeira associada, quando paga.

### `Goal`

- Identificador.
- Nome.
- Valor-alvo.
- Método de progresso.
- Prazo opcional.
- Caixinha ou contribuições associadas, conforme decisão de implementação.

### `Category`

- Identificador.
- Nome.
- Tipo de uso.
- Contexto opcional.
- Status ativo/arquivado.

### `AuditLog`

- Identificador.
- Data e hora.
- Tipo de ação.
- Tipo e identificador do registro afetado.
- Resumo da alteração.
- Valores anteriores e novos, quando apropriado.

### `Reconciliation`

- Identificador.
- Conta bancária.
- Data da conciliação.
- Saldo calculado.
- Saldo real informado.
- Diferença.
- Justificativa.
- Ajuste associado.

## 17. Requisitos funcionais

- **RF01:** O sistema deve permitir configurar contas, caixinhas e saldos iniciais.
- **RF02:** O sistema deve permitir cadastrar, editar e arquivar caixinhas.
- **RF03:** O sistema deve permitir definir uma regra padrão de distribuição por caixinha.
- **RF04:** O sistema deve aceitar regras percentuais sobre o valor bruto ou sobre o saldo restante.
- **RF05:** O sistema deve aceitar regras de valor fixo.
- **RF06:** O sistema deve sugerir a distribuição de um recebimento conforme as regras selecionadas.
- **RF07:** O sistema deve permitir ajustes pontuais sem alterar a regra padrão.
- **RF08:** O sistema deve exigir revisão e confirmação antes de gravar movimentações.
- **RF09:** O sistema deve alertar quando a distribuição superar o valor recebido.
- **RF10:** O sistema deve manter valores não alocados quando a distribuição ficar abaixo do recebimento.
- **RF11:** O sistema deve registrar despesas e retiradas vinculadas a caixinhas e contas bancárias.
- **RF12:** O sistema deve permitir transferências entre caixinhas sem afetar o saldo bancário consolidado.
- **RF13:** O sistema deve permitir transferências entre contas sem classificá-las como receita ou despesa.
- **RF14:** O sistema deve cadastrar contas a pagar avulsas e recorrentes.
- **RF15:** O sistema deve exibir vencimentos, contagem regressiva e atrasos.
- **RF16:** O sistema deve exigir confirmação manual do pagamento e manter o histórico de ocorrências.
- **RF17:** O sistema deve permitir criar metas e selecionar o método de cálculo do progresso.
- **RF18:** O sistema deve manter histórico pesquisável e filtrável.
- **RF19:** O sistema deve permitir conciliação e ajustes justificados.
- **RF20:** O sistema deve exibir saldos bancários, valores reservados e valores não alocados sem duplicar dinheiro.
- **RF21:** O sistema deve permitir exportar e importar os dados manualmente.
- **RF22:** O sistema deve funcionar offline após a instalação e disponibilização inicial dos recursos.

## 18. Requisitos não funcionais

### Usabilidade e acessibilidade

- Interface responsiva.
- Textos claros e objetivos.
- Hierarquia visual consistente.
- Navegação previsível.
- Feedback visível para erros, confirmações e estados.
- Uso de teclado e foco acessível, quando aplicável.
- Status não comunicados somente por cor.

### Integridade financeira

- Valores armazenados com precisão monetária.
- Operações consistentes e sem duplicidade.
- Transferências separadas de receitas e despesas.
- Confirmação antes de salvar.
- Histórico para ajustes e alterações relevantes.
- Regras de cálculo centralizadas e testáveis.

### Offline e persistência

- Consulta e movimentações principais disponíveis sem conexão.
- Tratamento de falhas de armazenamento local.
- Aviso claro sobre os limites de recuperação dos dados locais.
- Exportação e importação verificadas.

### Privacidade e segurança

- Nenhuma sincronização ou transmissão financeira automática no MVP.
- Nenhuma conta remota obrigatória.
- Evitar expor valores financeiros em mensagens de erro ou logs desnecessários.
- Avaliar bloqueio local e criptografia dos arquivos exportados.

### Compatibilidade e manutenção

- Compatibilidade com navegadores modernos.
- Estrutura modular.
- Testes automatizados para cálculos financeiros e recorrências.
- Versionamento do formato de exportação.
- Migrações de dados locais quando a estrutura mudar.

## 19. Critérios de aceitação

- **CA01:** O usuário consegue configurar uma conta bancária, uma caixinha e seus saldos iniciais.
- **CA02:** Um recebimento pode ser cadastrado e distribuído entre caixinhas.
- **CA03:** O sistema calcula corretamente percentuais sobre o valor bruto.
- **CA04:** O sistema calcula corretamente percentuais sobre o saldo restante, respeitando a ordem definida.
- **CA05:** Regras fixas e percentuais podem ser combinadas no mesmo recebimento.
- **CA06:** Uma alteração pontual não modifica a regra padrão da caixinha.
- **CA07:** Distribuição superior ao recebimento gera alerta e não é gravada silenciosamente.
- **CA08:** Valores não alocados permanecem visíveis.
- **CA09:** Uma despesa atualiza corretamente a conta bancária e a caixinha associadas.
- **CA10:** Transferências entre caixinhas não alteram o saldo bancário nem os totais de receita/despesa.
- **CA11:** Contas vencidas continuam pendentes até confirmação manual.
- **CA12:** O pagamento de uma ocorrência recorrente fica disponível no histórico.
- **CA13:** Ajustes de conciliação exigem justificativa e deixam registro.
- **CA14:** O painel não soma novamente os valores reservados nas caixinhas ao saldo bancário.
- **CA15:** Exportação e importação preservam os dados e validam o arquivo antes de aplicar alterações.

## 20. Decisões pendentes antes da implementação

1. **Ordem das regras:** definir como ordenar regras percentuais sobre o saldo restante e se o usuário poderá reordená-las.
2. **Arredondamento:** definir o comportamento para diferenças de centavos.
3. **Distribuição excedente:** definir as opções apresentadas ao usuário quando as regras somarem mais do que o recebimento.
4. **Saldo negativo:** definir se caixinhas podem ficar negativas e como tratar diferenças pendentes.
5. **Contexto pessoal/empresarial:** decidir se contas e caixinhas podem ser compartilhadas entre contextos.
6. **Metas:** decidir se toda meta exige uma caixinha vinculada ou se pode acompanhar contribuições de várias origens.
7. **Prazo das metas:** confirmar se a data-alvo será opcional.
8. **Recorrência mensal:** definir o comportamento para vencimentos em dias inexistentes, como dia 31.
9. **Importação:** decidir entre substituir, mesclar ou oferecer as duas opções.
10. **Exclusão:** definir quando um registro pode ser apagado e quando deve ser arquivado ou cancelado.
11. **Proteção local:** decidir se o MVP terá PIN/senha de acesso e criptografia de exportação.
12. **Tipos de recebimento:** confirmar se descrição livre é suficiente ou se futuramente haverá regras específicas por tipo de entrada.

## 21. UX, prototipação e validação visual

A prototipação visual é uma etapa explícita do projeto e deve ocorrer antes da implementação detalhada das telas. O objetivo é validar navegação, conteúdo, hierarquia e estados principais sem confundir o protótipo com uma interface já implementada.

### Entregas de UX

1. Inventário das telas do MVP e dos estados relevantes (carregamento, vazio, erro, confirmação e saldo insuficiente).
2. Fluxos principais atualizados a partir do mapa de navegação da T4.
3. Protótipo de baixa fidelidade editável no Figma, com um frame por tela, sem colagens de várias telas.
4. Frames mobile de referência em 390 × 844 px; priorizar celular e considerar adaptações para computador nas etapas posteriores.
5. Interface em português do Brasil, com fundo branco, tons de cinza e uso pontual de verde-escuro; componentes simples, bordas discretas e sem gradientes ou sombras complexas.
6. Uso de Auto Layout e componentes editáveis para campos, botões, cards, listas e ícones básicos.
7. Fluxos clicáveis para configuração inicial, painel, recebimento e distribuição, despesa, transferência e consulta do histórico.
8. Revisão do protótipo contra os requisitos funcionais, critérios de aceitação e regras de integridade financeira antes de iniciar a construção das telas.

### Telas mínimas a cobrir

- Boas-vindas e configuração inicial.
- Painel com contexto selecionado, saldo bancário, caixinhas e valor não alocado.
- Contas bancárias e caixinhas.
- Cadastro e revisão de recebimento/distribuição.
- Cadastro de despesa e retirada para carteira física.
- Transferências entre caixinhas e entre contas.
- Contas a pagar, vencimentos e recorrências.
- Metas financeiras.
- Histórico e detalhes de movimentação.
- Conciliação de saldo.
- Relatórios.
- Exportação/importação e configurações.

### Critério para aprovação do protótipo

O protótipo pode ser considerado aprovado quando os fluxos principais forem navegáveis, os textos e estados estiverem coerentes com o briefing, as regras financeiras críticas forem representadas e não houver dúvidas de navegação que impeçam a implementação. A aprovação do protótipo não substitui testes funcionais nem validação com usuários.

## 22. Plano de desenvolvimento recomendado

### Fase 1: Requisitos e decisões

- Concluir requisitos, critérios de aceitação, regras financeiras e modelo conceitual.
- Manter decisões aprovadas registradas em `docs/decisoes/` e documentos de tarefa.
- Resolver decisões pendentes que bloqueiem a implementação de cada módulo.

### Fase 2: Fundação técnica

- Configurar Next.js, TypeScript, Tailwind CSS, lint e formatação.
- Criar estrutura de pastas, rotas e convenções.
- Configurar checagens e testes básicos.
- Implementar tokens e layout responsivo depois da validação visual.

### Fase 3: UX e prototipação

- Inventariar telas e estados do MVP.
- Atualizar fluxos e navegação.
- Criar o protótipo de baixa fidelidade editável no Figma.
- Revisar e aprovar os fluxos principais antes de implementar a interface completa.

### Fase 4: Modelo de dados e persistência

- Detalhar entidades e relacionamentos.
- Implementar persistência local e migrações.
- Criar utilitários monetários seguros, usando centavos inteiros.
- Validar saldos iniciais, alocações e recuperação de dados.

### Fase 5: Interface base e sistema visual

- Aplicar tokens da identidade Tangerina.
- Criar componentes reutilizáveis e estados de interface.
- Implementar navegação responsiva, painel e estados vazios/erro.
- Conferir fidelidade ao protótipo aprovado.

### Fase 6: Recebimentos e distribuição

- Regras de distribuição, ordem e bases de cálculo.
- Prévia, edição pontual, confirmação e persistência.
- Testes de arredondamento, excesso e valor não alocado.

### Fase 7: Despesas, retiradas e transferências

- Despesas e retiradas para carteira física.
- Transferências entre caixinhas e contas.
- Edição, cancelamento, auditoria e invariantes de saldo.

### Fase 8: Contas a pagar, recorrências e metas

- Contas avulsas/recorrentes e ocorrências.
- Confirmação manual de pagamento.
- Vencimentos, alertas visuais e metas financeiras.

### Fase 9: Histórico, conciliação e relatórios

- Histórico filtrável e auditoria.
- Conciliação e ajustes justificados.
- Painel, relatórios e indicadores sem dupla contagem.

### Fase 10: Portabilidade, qualidade e offline

- Exportação/importação validada e prevenção de duplicidade.
- Testes automatizados, acessibilidade e responsividade.
- Implementação e validação de PWA/offline em dispositivos reais.
- Revisão de privacidade e mensagens sobre armazenamento local.

### Fase 11: Documentação e lançamento

- README, instruções de uso, backup/restauração e limitações.
- Build de produção, smoke tests e checklist de lançamento.
- Publicação e validação do MVP.

## 23. Definição de pronto

Uma funcionalidade estará pronta quando:

- Atender ao requisito funcional correspondente.
- Possuir validações e mensagens de erro claras.
- Exigir confirmação quando alterar dados financeiros.
- Atualizar corretamente os saldos e o histórico.
- Não gerar duplicidade em receitas, despesas ou transferências.
- Funcionar offline quando fizer parte do escopo offline.
- Possuir testes automatizados relevantes.
- Ser utilizável em celular e computador.
- Não contradizer as regras de integridade financeira deste briefing.

---

## Observação final

Este documento consolida o briefing funcional e técnico inicial. As decisões listadas na seção 20 devem ser resolvidas antes ou durante a definição detalhada da arquitetura. Os exemplos de valores são ilustrativos e não representam recomendações financeiras.
