# T8 — Estrutura inicial da aplicação

- **Projeto:** Tangerina Financeiro
- **Tarefa:** T8 — Criar estrutura de pastas e rotas
- **Status:** Em andamento
- **Branch:** `feat/t8-estrutura-aplicacao`
- **Base:** `main`
- **Escopo:** organização inicial do código; não representa implementação das funcionalidades financeiras.

## 1. Objetivo

Organizar o código para que interface, domínio financeiro, persistência local e utilitários evoluam separadamente, facilitando testes e manutenção por um único desenvolvedor.

## 2. Estrutura proposta

A estrutura segue o App Router já existente e mantém o diretório `app/` como raiz do projeto Next.js.

```text
app/
├── app/                 # Rotas, layouts e páginas Next.js
├── components/          # Componentes visuais reutilizáveis
├── domain/
│   └── finance/         # Regras e modelos do domínio financeiro
├── db/                  # Esquema e acesso à persistência local
├── lib/                 # Utilitários compartilhados
└── types/               # Tipos compartilhados quando não pertencem ao domínio
```

## 3. Limites entre camadas

- **Rotas e páginas:** compõem telas e conectam componentes; não devem concentrar regras financeiras.
- **Componentes:** exibem dados e comunicam ações do usuário por propriedades e callbacks.
- **Domínio financeiro:** concentra validações e cálculos puros, sem depender de React ou do navegador.
- **Persistência:** encapsula leitura e gravação local. As operações financeiras que afetam múltiplos registros deverão usar transações.
- **Utilitários:** funções genéricas sem regras específicas de negócio.
- **Tipos:** evitar duplicar modelos; tipos do domínio devem permanecer próximos ao domínio quando forem específicos dele.

## 4. Regras técnicas obrigatórias

1. Valores monetários são representados em centavos inteiros, conforme T5.
2. Transferências são operações únicas com efeitos correspondentes, não receitas ou despesas.
3. Regras financeiras não podem depender de estado visual de componentes.
4. Operações que alteram vários registros devem preservar atomicidade.
5. Não introduzir IndexedDB/Dexie, Service Worker ou migrações apenas como placeholders; cada recurso será implementado e validado em sua tarefa.
6. Não declarar funcionalidade pronta sem implementação e validação registradas.

## 5. Fora do escopo desta tarefa

- Implementar cálculos financeiros.
- Implementar IndexedDB/Dexie e migrações.
- Implementar PWA ou funcionamento offline.
- Implementar fluxos completos de receita, despesas, transferências ou backup.
- Redesenhar e finalizar todas as telas do protótipo.

## 6. Critérios de conclusão

- [x] Pastas-base criadas e com responsabilidades documentadas.
- [x] Convenções compatíveis com a estrutura Next.js existente.
- [x] As telas criadas usam valores demonstrativos; regras financeiras ainda não foram implementadas nos componentes.
- [ ] Lint, formatação e build validados após as alterações (pendente de execução no ambiente local).
- [ ] Roadmap atualizado somente depois de executar as validações.

## 7. Referências

- `docs/arquitetura/T5-modelo-dados.md`
- `docs/decisoes/ADR-001-stack.md`
- `docs/requisitos/T2-regras-financeiras.md`
- `docs/requisitos/T3-criterio-aceitacao.md`


## 8. Progresso da implementação

Implementado nesta branch:
- Tela inicial em `app/app/page.tsx`, com navegação para o dashboard.
- Dashboard ilustrativo em `app/app/dashboard/page.tsx`.
- Rotas provisórias para receitas, despesas, transferências, movimentações, caixinhas e opções em `app/app/[section]/page.tsx`.
- Página de rota não encontrada em `app/app/not-found.tsx`.
- Componentes compartilhados `app/components/app-brand.tsx` e `app/components/bottom-navigation.tsx`.
- Identidade visual e uso de ícones React Icons nas telas iniciais.

### Limitações conhecidas
- Os valores do dashboard são fixos e ilustrativos; não vêm de uma base de dados.
- As rotas provisórias informam que as funcionalidades ainda não foram implementadas.
- A marca está referenciada por `/favicon.svg`; confirmar visualmente no navegador se o arquivo é o recurso de marca pretendido.
- A instalação de dependências, lint, verificação de tipos e build ainda precisam ser executados localmente. Até essa validação, a T8 permanece **EM ANDAMENTO**.
