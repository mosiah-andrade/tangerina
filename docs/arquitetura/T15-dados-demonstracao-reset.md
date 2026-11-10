# T15 — Dados de demonstração e reset seguro

**Projeto:** Tangerina Financeiro  
**Status:** Concluída e integrada à main  
**Referência:** PR #34  
**Data de conclusão:** 09/11/2026

## 1. Objetivo

Permitir que o MVP seja iniciado e demonstrado com um cenário financeiro fictício persistido localmente, com uma forma segura de remover esse cenário sem deixar dados parcialmente gravados.

## 2. Escopo entregue

### Dados de demonstração

Foi implementado um cenário de dados fictícios persistido no IndexedDB, incluindo o carregamento controlado e a identificação do estado da demonstração.

O ciclo principal ficou concentrado nos módulos de demonstração:

- `lib/persistence/demo/seed.ts`
- `lib/persistence/demo/load.ts`
- `lib/persistence/demo/reset.ts`
- `lib/persistence/demo/state.ts`

### Segurança e atomicidade

O carregamento e o reset utilizam a infraestrutura transacional da persistência. Os testes cobrem:

- carregamento completo do cenário;
- rollback quando uma escrita falha;
- reset do cenário de demonstração e de seus metadados sem remover dados fora do escopo.

### Dashboard conectado aos dados persistidos

O dashboard deixou de depender de valores financeiros ilustrativos e passou a calcular:

- patrimônio acompanhado;
- valor em caixinhas;
- valor não alocado.

O cálculo é feito a partir dos dados persistidos por meio de:

- `lib/persistence/dashboard/resumo.ts`

### Controles na interface

A seção **Mais opções** recebeu os controles de dados de demonstração:

- **Carregar demonstração**
- **Resetar dados**

A interface informa o estado atual, bloqueia ações incompatíveis durante o carregamento e apresenta erros quando uma operação não pode ser concluída.

### Atualização visual

Foi criado o evento:

`tangerina:dados-financeiros-atualizados`

Após carregar ou resetar a demonstração, os componentes interessados podem reagir à alteração dos dados persistidos e atualizar a visualização sem exigir uma recarga manual da página.

## 3. Arquitetura adicionada

### Hook de ciclo da demonstração

O hook `useDemonstracao` centraliza:

- leitura do estado inicial;
- carregamento;
- reset;
- estados de carregamento;
- tratamento de erros;
- atualização do estado da interface;
- notificação da atualização dos dados financeiros.

### Evento de atualização

O módulo:

`lib/persistence/events/dados-financeiros.ts`

evita que a interface dependa diretamente dos controles de demonstração para saber que os dados financeiros foram alterados.

## 4. Regras preservadas

A implementação mantém as decisões anteriores do projeto:

- valores monetários continuam representados em centavos inteiros;
- operações críticas de persistência continuam protegidas por transações;
- rollback evita estados parciais em caso de falha;
- o reset de demonstração é limitado ao cenário e aos seus metadados;
- o dashboard calcula os valores a partir da persistência, sem duplicar valores fictícios na interface.

## 5. Validação final

A validação registrada na conclusão da T15 aprovou:

- Prettier;
- TypeScript (`typecheck`);
- ESLint;
- testes automatizados;
- build de produção do Next.js.

Resultado dos testes:

**89 testes aprovados, 0 falhas.**

## 6. Resultado

A T15 entrega um ambiente demonstrável e reutilizável para o Tangerina, conectado à camada real de persistência local. O próximo passo do roadmap é a **T16 — Implementar contas bancárias**.
