# ADR-001 — Definição da stack tecnológica

- **Projeto:** Tangerina Financeiro
- **Status:** Aprovado
- **Data da decisão:** 2026-10-27
- **Responsável pela decisão:** Responsável pelo projeto
- **Escopo:** Stack do MVP, persistência local, funcionamento offline, backup e hospedagem
- **Implementação:** Pendente

## 1. Contexto

O Tangerina Financeiro é um aplicativo de gestão financeira com prioridade para dispositivos móveis. O MVP deverá funcionar offline após o carregamento inicial, armazenar os dados financeiros localmente e respeitar as regras de integridade definidas nos requisitos do produto.

O desenvolvimento será realizado inicialmente por um único desenvolvedor. A stack precisa equilibrar organização, facilidade de manutenção, complexidade técnica e compatibilidade com hospedagem estática.

O MVP não depende de autenticação em servidor, sincronização em nuvem ou integração bancária. As operações financeiras essenciais deverão continuar funcionando sem conexão com a internet depois que a aplicação tiver sido carregada e preparada para uso offline.

## 2. Decisão aprovada

A stack tecnológica do MVP fica definida da seguinte forma:

| Camada | Tecnologia ou diretriz | Status |
|---|---|---|
| Framework de interface | Next.js | Aprovado |
| Linguagem | TypeScript | Aprovado |
| Estilização | Tailwind CSS | Aprovado |
| Persistência local | IndexedDB + Dexie.js | Aprovado |
| Funcionamento offline | PWA + Service Worker | Aprovado |
| Hospedagem candidata | Vercel | Preferência aprovada |
| Hospedagem definitiva | Manter alternativas abertas | Pendente de validação |
| Backup e restauração | Exportação e importação de dados locais | Aprovado para o escopo do MVP |

A aplicação deverá priorizar o processamento local. Recursos que dependam obrigatoriamente de servidor não poderão ser necessários para as operações financeiras centrais do MVP.

A arquitetura deverá buscar compatibilidade com publicação estática, desde que isso seja viável com a configuração escolhida do Next.js.

A aprovação da stack não significa que os recursos já estejam implementados ou que os critérios técnicos já tenham sido validados.

## 3. Justificativas

### 3.1. Next.js + TypeScript + Tailwind CSS

O Next.js oferece estrutura para páginas, layouts e componentes. TypeScript contribui para a organização dos modelos e a detecção de erros de tipagem. Tailwind CSS permite manter uma interface consistente e responsiva.

A combinação foi aprovada para estruturar a interface e facilitar a manutenção e a evolução do aplicativo.

**Cuidados técnicos:**
- Evitar dependência desnecessária de recursos de servidor.
- Validar a compatibilidade com exportação estática.
- Separar regras financeiras dos componentes visuais.
- Implementar explicitamente os recursos de PWA e funcionamento offline.

### 3.2. IndexedDB + Dexie.js

IndexedDB será a tecnologia de persistência local, com Dexie.js como camada de acesso aos dados.

Essa escolha permite armazenar registros estruturados e relacionados, incluindo contas, caixinhas, receitas, despesas, transferências e histórico de alterações.

O suporte a transações permite agrupar alterações que precisam ser persistidas como uma única operação lógica.

**Cuidados técnicos:**
- Definir e versionar o esquema do banco.
- Implementar migrações.
- Tratar falhas de leitura e gravação.
- Implementar backup e restauração.
- Não presumir que os dados locais nunca serão removidos.

IndexedDB e Dexie.js não garantem sozinhos a integridade financeira. As regras de negócio deverão ser implementadas e testadas separadamente.

### 3.3. PWA e funcionamento offline

O aplicativo será desenvolvido como Progressive Web App (PWA), com Service Worker e cache dos recursos essenciais.

O primeiro carregamento ou instalação normalmente exige conexão. Após a preparação inicial bem-sucedida, o objetivo é permitir o uso offline das telas e operações financeiras essenciais.

A implementação deverá considerar atualização do cache, recuperação após falhas e compatibilidade com navegadores móveis.

### 3.4. Vercel e portabilidade

A Vercel é a hospedagem preferencial candidata pela integração com Next.js e pela facilidade de publicação.

A hospedagem definitiva permanece em aberto. GitHub Pages e Hostinger poderão ser avaliadas conforme a compatibilidade com a arquitetura, as rotas, os recursos estáticos e os requisitos da PWA.

A arquitetura deverá evitar dependências proprietárias desnecessárias que dificultem uma futura migração.

## 4. Alternativas consideradas

### 4.1. Framework de interface

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Next.js + TypeScript + Tailwind CSS — aprovado** | Estrutura de aplicação, componentes reutilizáveis e integração com Vercel | Maior complexidade; PWA e exportação estática exigem configuração e validação |
| React + Vite + TypeScript + Tailwind CSS | Fluxo direto para aplicação client-side e hospedagem estática | Exige decisões próprias sobre estrutura e roteamento |
| HTML, CSS e JavaScript puro | Poucas dependências e implantação simples | Pode dificultar a organização de telas, estados e componentes conforme o sistema cresce |

### 4.2. Persistência local

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **IndexedDB + Dexie.js — aprovado** | Dados estruturados, transações e consultas | Exige modelagem, migrações e estratégia de backup |
| localStorage | Simples de implementar | Menos adequado para operações financeiras com vários registros relacionados |
| SQLite via WebAssembly | SQL e recursos relacionais | Maior complexidade de integração e persistência no navegador |

### 4.3. Hospedagem

| Alternativa | Vantagens | Pontos de atenção |
|---|---|---|
| **Vercel — preferencial** | Integração conveniente com Next.js | Validar exportação estática, rotas e recursos da PWA |
| GitHub Pages | Hospedagem de arquivos estáticos | Não executa servidor Next.js; exige atenção a caminhos e rotas |
| Hostinger | Pode hospedar arquivos estáticos e oferece outras modalidades | Verificar o plano e os requisitos da arquitetura |

A Vercel é a preferência aprovada, mas a hospedagem definitiva não está fechada.

## 5. Requisitos de integridade financeira

### 5.1. Representação monetária

Os valores monetários deverão ser armazenados em centavos inteiros ou em outra representação decimal exata devidamente documentada.

Os cálculos financeiros não deverão depender diretamente de operações com ponto flutuante binário que possam introduzir diferenças de arredondamento.

### 5.2. Regras de negócio centralizadas

As regras de saldo, transferências, limites, arredondamento e distribuição de receitas deverão ficar em módulos testáveis, separados dos componentes visuais.

### 5.3. Transações de gravação

Operações que alterem vários registros deverão utilizar transações do IndexedDB sempre que esses registros precisarem ser gravados como uma única operação lógica.

Se uma operação falhar, o sistema deverá impedir a persistência parcial dos registros que compõem essa operação.

### 5.4. Regras T2

A implementação deverá respeitar as decisões já aprovadas na especificação T2:

- Caixinhas globais, sem vínculo obrigatório com uma conta bancária específica.
- Identificação de saldos iniciais inconsistentes, exigindo correção antes da conclusão da configuração.
- Execução ordenada das regras de distribuição de receitas, com base de cálculo configurável e bloqueio de excedentes.
- Possibilidade de saldo negativo em uma caixinha somente após confirmação explícita da despesa.
- Bloqueio padrão de retiradas acima do saldo bancário disponível.
- Retirada em dinheiro representada como transferência para uma carteira física.
- Registro posterior das despesas realizadas com o dinheiro dessa carteira.
- Arredondamento consistente para o centavo mais próximo, sem ultrapassar os valores disponíveis.
- Edição direta de movimentações confirmadas, mantendo registro dos valores anteriores e novos.

Este ADR define a stack para implementar essas regras, sem reabri-las.

### 5.5. Auditoria e migrações

As alterações em movimentações confirmadas deverão registrar os valores anteriores e novos.

O esquema do banco local deverá ser versionado. Alterações futuras precisarão incluir migrações e testes que verifiquem a preservação dos dados existentes.

### 5.6. Backup e restauração

O MVP deverá oferecer exportação e restauração de dados locais.

A solução deverá:
- Validar a estrutura e a versão do arquivo importado.
- Recusar arquivos inválidos antes de alterar os dados existentes.
- Tratar incompatibilidades de versão.
- Evitar duplicação acidental de registros.
- Informar claramente quando a restauração substituir dados existentes.
- Testar a recuperação em uma instalação limpa.

O usuário deverá ser informado de que dados locais podem ser perdidos se o armazenamento do navegador for removido ou o dispositivo apresentar falhas.

## 6. Consequências esperadas

### Positivas

- O núcleo financeiro poderá funcionar sem backend obrigatório.
- O aplicativo poderá operar offline após a preparação inicial.
- O armazenamento local suportará registros estruturados e transações.
- TypeScript ajudará a organizar modelos e reduzir erros de tipagem.
- A interface poderá ser dividida em componentes reutilizáveis.
- A arquitetura poderá permanecer portátil se o núcleo não depender de recursos de servidor.
- O backup permitirá recuperar dados em situações de perda do armazenamento local.

### Custos e consequências negativas

- PWA, Service Worker e cache aumentam a complexidade de desenvolvimento e testes.
- Os dados não serão sincronizados automaticamente entre dispositivos.
- A perda do armazenamento local poderá causar perda de dados não exportados.
- O banco local exigirá migrações versionadas.
- A exportação estática do Next.js poderá impor restrições arquiteturais.
- A atualização da aplicação precisará ser coordenada com o cache.
- A restauração precisará lidar com arquivos inválidos, versões incompatíveis e duplicidades.

## 7. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Gravação parcial de uma operação financeira | Transações do IndexedDB e testes de falhas |
| Diferenças de saldo por arredondamento | Representação monetária exata e testes automatizados |
| Perda de dados locais | Backup exportável, restauração testada e avisos claros |
| Aplicação indisponível offline | Service Worker, cache dos recursos essenciais e testes após primeira carga |
| Cache incompatível após atualização | Estratégia de versionamento e testes de atualização |
| Dependência excessiva da Vercel | Evitar recursos proprietários desnecessários e validar alternativa estática |
| Migração incorreta do banco | Versionamento do esquema e testes com dados anteriores |
| Importação de backup inválido | Validação antes da gravação e tratamento transacional |
| Acesso indevido em dispositivo compartilhado | Documentar limitações e avaliar proteção local por PIN ou senha em etapa posterior |

## 8. Critérios de validação da implementação

A aprovação deste ADR define a stack, mas os seguintes critérios continuam pendentes de implementação e validação:

- [ ] A aplicação compila e pode ser publicada sem depender de servidor para as funções financeiras centrais.
- [ ] As telas e recursos essenciais ficam disponíveis offline após a primeira carga bem-sucedida.
- [ ] Criar, editar e excluir registros funciona sem conexão.
- [ ] Uma operação que modifica vários registros é atômica.
- [ ] Falhas de gravação não produzem operações parcialmente persistidas.
- [ ] Os cálculos monetários e arredondamentos respeitam as regras definidas.
- [ ] As regras críticas do T2 possuem testes automatizados.
- [ ] A auditoria de edição registra os valores anteriores e novos.
- [ ] O banco local pode ser migrado entre versões sem perda de dados.
- [ ] O backup pode ser exportado e restaurado em uma instalação limpa.
- [ ] Um arquivo inválido é recusado sem corromper os dados existentes.
- [ ] A atualização da aplicação não apaga os dados locais.
- [ ] O cache não deixa a aplicação em estado incompatível após uma atualização.
- [ ] A publicação na Vercel funciona.
- [ ] A viabilidade de uma hospedagem estática alternativa está documentada.
- [ ] O fluxo principal é utilizável em um dispositivo móvel de referência.

## 9. Escopo e itens não incluídos

A escolha da stack não implica a implementação automática de:

- Login ou autenticação em servidor.
- Sincronização entre dispositivos.
- Integração bancária.
- Backend obrigatório para operações financeiras.
- Proteção forte contra acesso por alguém que já tenha acesso ao perfil do navegador ou ao dispositivo.

Esses itens deverão ser discutidos separadamente caso se tornem necessários.

## 10. Decisão final

**Status: Aprovado.**

A stack aprovada para o Tangerina Financeiro é:

- **Interface:** Next.js + TypeScript + Tailwind CSS.
- **Persistência local:** IndexedDB + Dexie.js.
- **Funcionamento offline:** PWA com Service Worker e cache dos recursos essenciais.
- **Backup:** exportação e restauração incluídas no escopo do MVP.
- **Hospedagem:** Vercel como opção preferencial, mantendo alternativas abertas.

A decisão foi confirmada pelo responsável pelo projeto em 27/10/2026.

A aprovação da stack não representa conclusão da implementação, validação dos critérios técnicos ou publicação do aplicativo. Esses itens deverão ser acompanhados separadamente no roadmap.

## 11. Histórico

| Data | Alteração |
|---|---|
| 2026-10-27 | Minuta inicial criada para avaliação. |
| 2026-10-27 | Stack aprovada pelo responsável pelo projeto. Status atualizado para Aprovado. |
