# Rotas e páginas

Este diretório contém apenas a camada de apresentação e roteamento do Next.js App Router.

## Convenções

- `page.tsx`: composição da tela e ligação com componentes de interface.
- `layout.tsx`: estrutura compartilhada entre rotas.
- `loading.tsx`: estado de carregamento da navegação.
- Componentes reutilizáveis ficam em `../components/`.
- Regras financeiras não devem ser implementadas dentro de páginas ou componentes; ficam em `../domain/finance/`.
- Acesso a armazenamento local fica em `../lib/persistence/`.

As páginas que exibem avisos de “em construção” são placeholders visuais, não funcionalidades financeiras concluídas.
