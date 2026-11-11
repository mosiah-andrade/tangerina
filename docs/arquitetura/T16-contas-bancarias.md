# T16 — Implementar contas bancárias

**Status:** Concluída e integrada à `main`.

## Objetivo

Entregar o fluxo inicial de contas bancárias do Tangerina, cobrindo cadastro, saldo inicial, cálculo e visualização do saldo por conta e edição dos dados cadastrais.

## Entregas

- Cadastro de contas bancárias persistidas em IndexedDB/Dexie.
- Suporte a instituição opcional.
- Registro do saldo inicial em centavos e da respectiva data.
- Cálculo do saldo atual por conta a partir do saldo inicial e dos efeitos de saldo ativos.
- Listagem das contas bancárias com seus saldos atuais.
- Navegação da lista para a edição de cada conta.
- Edição de nome e instituição sem alterar tipo, saldo inicial ou demais campos financeiros.
- Tratamento de conta inexistente e erros de carregamento/salvamento na interface.

## Regras preservadas

- Valores monetários permanecem representados em centavos.
- A edição cadastral não reescreve a posição financeira inicial.
- Apenas contas do tipo `bancaria` são editadas pelo fluxo específico de contas bancárias.
- A remoção da instituição opcional é suportada.
- Efeitos revertidos ou pertencentes a outros alvos não alteram o saldo calculado da conta.

## Qualidade e validação

Na conclusão da etapa, foram executados com sucesso:

- ESLint;
- TypeScript (`tsc --noEmit`);
- suíte automatizada de testes;
- build de produção do Next.js;
- Prettier direcionado aos arquivos alterados.

A suíte final registrada para a T16 executou **102 testes aprovados, sem falhas**.

## Resultado

A T16 estabelece o primeiro fluxo funcional completo de contas bancárias sobre a camada de persistência já existente e deixa a base preparada para a próxima funcionalidade do roadmap: **T17 — Implementar caixinhas**, respeitando a regra de não duplicar o patrimônio total.
