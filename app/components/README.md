# Componentes

Responsabilidade: componentes visuais reutilizáveis da interface.

Convenções:
- Componentes recebem dados por props e comunicam ações por callbacks.
- Não implementar cálculos financeiros nem acesso direto ao banco nesta camada.
- Manter os componentes acessíveis e responsivos, priorizando telas mobile.
- Criar componentes compartilhados quando houver reutilização real, evitando abstrações prematuras.

O layout global e as rotas permanecem em `app/`, conforme o App Router do Next.js.
