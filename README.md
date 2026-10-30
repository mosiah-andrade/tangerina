# Tangerina Financeiro
https://tangerina-bay.vercel.app/
Aplicativo de organização financeira com foco em uso mobile, controle de contas e caixinhas, distribuição de recebimentos e acompanhamento de movimentações. O escopo e as regras do MVP estão registrados nos documentos do projeto.

> **Estado atual:** fundação técnica da T7 integrada. A aplicação ainda está em desenvolvimento; a configuração do projeto não significa que as funcionalidades financeiras estejam implementadas.

## Estrutura do repositório

- `app/` — aplicação Next.js.
- `docs/requisitos/` — escopo do MVP, regras financeiras e critérios de aceitação.
- `docs/ux/` — mapa de navegação e fluxos.
- `docs/arquitetura/` — modelo de dados e documentação de arquitetura.
- `docs/decisoes/` — decisões técnicas registradas em ADRs.
- `docs/infra/` — registros de configuração e infraestrutura.
- `briefing_app_financeiro.md` — briefing funcional em Markdown.
- `briefing_app_financeiro.html` — versão navegável do briefing.
- `tangerina_roadmap.html` — roadmap e acompanhamento das tarefas.

## Documentação principal

| Documento | Conteúdo |
|---|---|
| [T1 — Escopo do MVP](docs/requisitos/T1-escopo-mvp.md) | Público, escopo e limites do produto |
| [T2 — Regras financeiras](docs/requisitos/T2-regras-financeiras.md) | Regras de negócio e integridade dos saldos |
| [T3 — Critérios de aceitação](docs/requisitos/T3-criterio-aceitacao.md) | Comportamentos esperados e casos-limite |
| [T4 — Navegação e fluxos](docs/ux/T4-mapa-navegacao-fluxos.md) | Organização das telas e jornadas |
| [T5 — Modelo de dados](docs/arquitetura/T5-modelo-dados.md) | Entidades, relacionamentos e DER |
| [ADR-001 — Stack tecnológica](docs/decisoes/ADR-001-stack.md) | Tecnologias aprovadas e premissas |
| [T7 — Configuração do ambiente](docs/infra/T7-configuracao-ambiente.md) | Fundação técnica e validações registradas |
| [T8 — Estrutura da aplicação](docs/infra/T8-estrutura-aplicacao.md) | Separação entre rotas, componentes, domínio, persistência e utilitários |
| [T9 — Tokens da identidade](docs/infra/T9-tokens-identidade.md) | Tokens visuais, componentes-base e catálogo das variações oficiais de logo |
| [Briefing funcional](briefing_app_financeiro.md) | Requisitos detalhados |
| [Roadmap](tangerina_roadmap.html) | Etapas, tarefas e progresso |

## Executar localmente

Pré-requisitos: Node.js compatível com a versão do Next.js usada pelo projeto e npm.

No terminal:

```bash
cd app
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Verificações

A partir de `app/`:

```bash
npm run lint
npm run format:check
npm run build
```

Os comandos acima estão configurados no projeto. Consulte o relatório da T7 para saber quais validações foram registradas na integração inicial.

## Premissas técnicas

A stack aprovada está documentada em [ADR-001](docs/decisoes/ADR-001-stack.md). Persistência local com IndexedDB/Dexie.js, PWA/offline, backup e funcionalidades financeiras são entregas planejadas e não devem ser consideradas implementadas apenas porque constam na arquitetura.

## Fluxo de trabalho

1. Consulte o roadmap e os documentos de requisitos antes de iniciar uma tarefa.
2. Preserve as decisões aprovadas e registre novas decisões relevantes.
3. Trabalhe em uma branch por tarefa e valide as alterações antes de abrir um pull request.
4. Atualize o roadmap e a documentação ao concluir cada entrega.
