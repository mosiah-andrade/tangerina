# Tangerina Financeiro — aplicação

Aplicação Next.js com TypeScript e App Router. O projeto prioriza uso mobile e processamento local, conforme a ADR-001.

## Executar

A partir deste diretório:

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Checagens disponíveis

```bash
npm run lint
npm run format:check
npm run build
```

Estes comandos estão configurados, mas só devem ser considerados validados quando executados no ambiente de trabalho.

## Estrutura arquitetural

```text
app/
├── app/                  # Rotas, páginas, layouts e estados de carregamento
├── components/           # Componentes React reutilizáveis
├── domain/finance/       # Regras e cálculos financeiros puros
└── lib/
    └── persistence/      # Acesso ao armazenamento local (Dexie/IndexedDB)
```

- **Rotas e páginas:** app/ (App Router) compõem as telas e conectam os componentes.
- **Componentes:** components/ contém elementos visuais sem regras financeiras nem acesso direto ao banco.
- **Domínio financeiro:** domain/finance/ será a fonte das regras de negócio, independente da interface.
- **Persistência:** lib/persistence/ será responsável pelo IndexedDB/Dexie, transações e migrações.
- **Utilitários compartilhados:** lib/ recebe funções técnicas genéricas; cálculos financeiros não devem ser colocados aqui.

Os READMEs dentro dessas camadas descrevem suas responsabilidades e limites. A presença das pastas não significa que regras financeiras ou persistência já estejam implementadas.

## Estado funcional

A interface atual é uma base visual. O painel contém valores de demonstração e algumas rotas apresentam estados “em construção”. As funcionalidades reais serão implementadas nas tarefas seguintes, com critérios de aceite e testes.

## Referências do projeto

- Requisitos e regras: ../docs/requisitos/
- Decisões técnicas: ../docs/decisoes/ADR-001-stack.md
- Fundação técnica: ../docs/infra/T7-configuracao-ambiente.md
- Roadmap: ../tangerina_roadmap.html
