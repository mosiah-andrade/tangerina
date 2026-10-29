# T8 — Estrutura de pastas e rotas

- **Projeto:** Tangerina Financeiro
- **Tarefa:** T8 — Criar estrutura de pastas e rotas
- **Status:** Concluída no nível de organização arquitetural
- **Branch:** `feat/t8-estrutura-aplicacao`
- **Escopo:** separar interface, rotas, domínio financeiro, persistência e utilitários

## 1. Objetivo

Definir fronteiras claras entre a interface do Next.js, componentes reutilizáveis, regras financeiras, persistência local e utilitários compartilhados, reduzindo acoplamento e facilitando as próximas tarefas.

## 2. Estrutura registrada

```text
app/
├── app/                  # App Router: páginas, layouts e estados de carregamento
├── components/           # Componentes React reutilizáveis
├── domain/finance/       # Regras financeiras independentes da UI
└── lib/
    └── persistence/      # Fronteira de acesso ao armazenamento local
```

Os diretórios de domínio e persistência possuem READMEs que explicam suas responsabilidades. `app/lib/README.md` define o limite dos utilitários técnicos compartilhados. Os diretórios `app/app/` e `app/components/` também têm orientações de responsabilidade.

## 3. Convenções definidas

- Páginas e layouts compõem telas e conectam componentes; não devem abrigar regras financeiras.
- Componentes recebem dados por props e não acessam diretamente o armazenamento.
- Cálculos e validações financeiras devem ficar em `domain/finance/`, usando centavos inteiros e funções testáveis.
- Acesso a IndexedDB/Dexie, migrações e transações pertence a `lib/persistence/`.
- Utilitários genéricos ficam em `lib/`; regras de dinheiro não devem ser duplicadas nessa camada.
- Rotas que ainda exibem “em construção” são placeholders e não devem ser tratadas como funcionalidades concluídas.

## 4. Arquivos alterados ou criados

- `app/README.md` — substituído o README inicial do template por instruções do projeto e mapa da arquitetura.
- `app/app/README.md` — responsabilidades das rotas e páginas.
- `app/components/README.md` — limites dos componentes visuais.
- `app/domain/finance/README.md` — limites do domínio financeiro.
- `app/lib/README.md` — responsabilidades dos utilitários.
- `app/lib/persistence/README.md` — responsabilidades da persistência local.
- `tangerina_roadmap.html` — T8 registrada como concluída e progresso padrão atualizado.

## 5. O que não faz parte da conclusão da T8

A T8 não implementa as regras financeiras, o banco IndexedDB/Dexie, repositórios, migrações, formulários funcionais, autenticação, PWA ou backup. Esses itens permanecem nas tarefas de implementação previstas no roadmap. A existência de diretórios e documentos não é evidência de funcionalidade executável.

## 6. Validação

Validação estática realizada por leitura dos arquivos gravados na branch: confirmadas a presença dos READMEs de camada, a atualização do README da aplicação e o registro da T8 no roadmap.

Não foi executado `npm run lint`, `npm run format:check` ou `npm run build` neste ambiente. Portanto, a T8 foi validada quanto à organização documental/estrutural, mas não foi feita uma nova validação de build.

## 7. Próximo passo

Prosseguir com T9 — implementar os tokens da identidade Tangerina — mantendo a separação de camadas definida nesta tarefa.
