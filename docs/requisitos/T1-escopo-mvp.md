# T1 — Escopo do MVP

**Projeto:** Tangerina Financeiro  
**Documento:** T1 — Escopo do MVP  
**Versão:** 1.0  
**Status:** Concluído  
**Objetivo:** Definir os limites funcionais, as premissas técnicas e as decisões de produto que orientam o desenvolvimento do MVP.

---

## 1. Objetivo do produto

O Tangerina Financeiro tem como objetivo ajudar pessoas a organizar suas finanças, acompanhar receitas e despesas, visualizar saldos e distribuir dinheiro entre diferentes objetivos por meio de caixinhas.

O MVP deve priorizar simplicidade, confiabilidade dos cálculos financeiros, facilidade de uso e autonomia do usuário sobre seus dados.

## 2. Público-alvo

O público inicial é composto por:

- Pessoas físicas que desejam organizar as próprias finanças.
- Empreendedores individuais que precisam acompanhar receitas, despesas e a destinação do dinheiro.

A interface deve ser compreensível para usuários sem conhecimento técnico, contábil ou financeiro avançado.

## 3. Escopo funcional

O MVP contempla as áreas funcionais previstas no briefing original, com implementação incremental conforme o roadmap.

### 3.1. Contas e saldos

- Cadastro e gerenciamento de contas bancárias.
- Registro de saldos iniciais.
- Visualização dos saldos por conta e do saldo bancário consolidado.
- Registro e consulta de movimentações financeiras.

### 3.2. Receitas e despesas

- Cadastro de receitas e despesas.
- Registro de descrição, valor, data e origem ou destino do dinheiro.
- Associação de movimentações às caixinhas quando aplicável.
- Histórico de movimentações.
- Edição e cancelamento rastreáveis de operações confirmadas.

### 3.3. Caixinhas

- Criação e gerenciamento de caixinhas financeiras.
- Definição de saldos iniciais.
- Distribuição de receitas entre caixinhas.
- Regras de distribuição por valor fixo e percentual.
- Transferências entre caixinhas.
- Visualização de saldos positivos e negativos.

### 3.4. Transferências e dinheiro físico

- Transferências entre contas bancárias.
- Transferências entre caixinhas.
- Registro de saques como transferências para uma carteira física.
- Registro de despesas pagas em dinheiro físico.

### 3.5. Acompanhamento financeiro

Conforme a sequência definida no roadmap e o briefing do produto, o MVP poderá incluir:

- Resumos e indicadores financeiros.
- Contas a pagar e recorrências.
- Metas financeiras.
- Conciliação de saldos.
- Relatórios simples.
- Exportação e importação de dados.

A inclusão dessas áreas no escopo não significa que todas devam ser desenvolvidas simultaneamente. Cada etapa deverá possuir regras e critérios de aceitação próprios.

## 4. Premissas técnicas

### 4.1. Mobile-first

A interface será projetada prioritariamente para dispositivos móveis e adaptada para telas maiores.

Os componentes devem considerar:

- Campos e botões adequados para toque.
- Navegação clara em telas pequenas.
- Formulários e listas responsivos.
- Mensagens de erro e confirmação compreensíveis.
- Boa legibilidade e hierarquia visual.

### 4.2. Offline-first

O aplicativo deverá priorizar o funcionamento local, sem depender de conexão constante com a internet.

No MVP:

- O uso básico não dependerá de login.
- Os dados serão armazenados localmente.
- Não haverá sincronização em nuvem.
- Não haverá integração com Open Finance.
- Não haverá importação automática de extratos bancários.
- A exportação e a importação manuais serão os mecanismos iniciais de portabilidade dos dados.

A implementação deverá considerar as limitações do armazenamento local da plataforma escolhida.

### 4.3. Proteção e portabilidade dos dados

O usuário deverá ser informado de que o armazenamento local não equivale a um backup.

A limpeza dos dados do navegador, a perda do dispositivo ou a remoção dos dados do aplicativo poderão causar perda de informações.

A exportação e a importação deverão ser tratadas como funcionalidades importantes para permitir cópias de segurança e migração de dados.

### 4.4. Segurança local

A implementação deverá evitar exposição desnecessária de informações financeiras e documentar as limitações de segurança do armazenamento local.

O uso de PIN ou senha local ficará para avaliação posterior, não sendo requisito obrigatório do MVP até que exista uma nova decisão formal.

### 4.5. Precisão monetária

Os cálculos financeiros deverão utilizar valores inteiros em centavos como representação monetária persistida.

Não se deve depender de operações de ponto flutuante como fonte definitiva dos valores financeiros.

As regras de arredondamento e distribuição serão detalhadas no documento T2.

### 4.6. Acessibilidade

A interface deverá considerar:

- Contraste adequado.
- Foco visível.
- Navegação por teclado quando aplicável.
- Rótulos claros nos campos.
- Mensagens de erro compreensíveis.
- Áreas de interação adequadas para dispositivos móveis.

## 5. Fora do escopo do MVP

Salvo nova decisão formal, não fazem parte do MVP:

- Login e gerenciamento de contas de usuário.
- Sincronização em nuvem entre dispositivos.
- Integração bancária ou Open Finance.
- Importação automática de extratos.
- Notificações push.
- Funcionalidades multiusuário.
- Painel administrativo.
- Contabilidade avançada e funcionalidades fiscais especializadas.

## 6. Princípios de desenvolvimento

As decisões de implementação deverão respeitar os seguintes princípios:

1. **Confiabilidade financeira:** os saldos e cálculos devem permanecer consistentes.
2. **Rastreabilidade:** movimentações confirmadas devem possuir histórico adequado.
3. **Prevenção de duplicidade:** uma operação não pode produzir efeitos financeiros repetidos.
4. **Transparência:** ajustes, arredondamentos e saldos insuficientes devem ser comunicados ao usuário.
5. **Simplicidade:** a interface deve reduzir a complexidade sem esconder consequências financeiras.
6. **Responsividade:** as funcionalidades devem ser utilizáveis em telas pequenas e grandes.
7. **Portabilidade:** os dados devem poder ser exportados e importados com validação.
8. **Evolução incremental:** novas funcionalidades devem respeitar o roadmap e as regras documentadas.

## 7. Critérios de conclusão do T1

O T1 é considerado concluído quando:

- O público inicial está definido.
- O escopo funcional do MVP está documentado.
- As principais exclusões estão identificadas.
- As premissas mobile-first e offline-first estão registradas.
- As preocupações de armazenamento, segurança, acessibilidade e precisão monetária estão identificadas.
- As próximas tarefas podem ser executadas com base nas decisões registradas.

## 8. Registro de decisões

| ID | Decisão | Estado |
|---|---|---|
| T1-D01 | Público inicial composto por pessoas físicas e empreendedores individuais | Definida |
| T1-D02 | Manter as funcionalidades previstas no briefing e implementá-las incrementalmente | Definida |
| T1-D03 | Priorizar a experiência mobile-first | Definida |
| T1-D04 | Avaliar PIN ou senha local após o MVP | Definida |
| T1-D05 | Considerar boas práticas de educação financeira, PWA/offline, armazenamento local, segurança, acessibilidade e precisão monetária | Registrada |
| T1-D06 | MVP sem login, nuvem, sincronização, Open Finance ou notificações push | Definida |
| T1-D07 | Utilizar exportação e importação manuais como mecanismos iniciais de portabilidade | Definida |

## 9. Relação com outros documentos

- `briefing_app_financeiro.md`: visão e briefing original do produto.
- `tangerina_roadmap.html`: acompanhamento visual das tarefas.
- `T2-regras-financeiras.md`: regras de negócio financeiras.
- `T3-criterios-aceitacao.md`: critérios de aceitação a serem detalhados na etapa T3.

## 10. Histórico de versão

| Versão | Alteração |
|---|---|
| 1.0 | Consolidação do escopo e das decisões do T1 |
