# T7 — Configuração do repositório e ambiente

- **Projeto:** Tangerina Financeiro
- **Tarefa:** T7 — Configurar repositório e ambiente
- **Área:** Infraestrutura / Fundação técnica
- **Status:** Concluída e integrada à `main`
- **Branch de trabalho:** `feat/t7-setup-ambiente`
- **Pull request:** [PR #1 — T7: Configurar repositório e ambiente](https://github.com/mosiah-andrade/tangerina/pull/1)
- **Commit de integração registrado no roadmap:** `d19f97b988150f725e07d91024e86ab4f34286a3`

## 1. Objetivo

Preparar a base técnica do Tangerina Financeiro para o desenvolvimento incremental do MVP, com uma estrutura executável, linguagem tipada e ferramentas de análise e formatação de código.

## 2. Escopo executado

- Inicialização do projeto Next.js dentro do diretório `app/`.
- Configuração de TypeScript e App Router.
- Configuração de Tailwind CSS.
- Configuração de ESLint para análise estática.
- Configuração de Prettier e integração do plugin de Tailwind CSS.
- Definição de scripts para desenvolvimento, build, lint e formatação.
- Registro das alterações em branch própria e integração por pull request.

## 3. Stack e configuração identificadas

| Item | Configuração |
|---|---|
| Framework | Next.js 16.4.3 |
| UI | React 19.3.0 |
| Linguagem | TypeScript 5.x |
| Estilização | Tailwind CSS 4.x |
| Análise estática | ESLint 9.x + configuração do Next.js |
| Formatação | Prettier 3.x + `prettier-plugin-tailwindcss` |
| Roteamento | App Router |
| Diretório da aplicação | `app/` |

As versões acima refletem as declarações de dependências no `app/package.json` presente na branch `main). Os intervalos com `^` indicam a faixa declarada, não necessariamente a versão efetivamente instalada em toda execução.

## 4. Scripts disponíveis

Executados a partir do diretório `app/`:

| Comando | Finalidade |
|---|---|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Gerar build de produção |
| `npm run start` | Servir a build de produção |
| `npm run lint` | Executar ESLint |
| `npm run format` | Formatar arquivos com Prettier |
| `npm run format:check` | Verificar formatação sem alterar arquivos |

## 5. Validações registradas

O registro da PR #1 informa que as seguintes verificações foram executadas com sucesso:

- `npm run format:check`
- `npm run lint`
- `npm run build`
- `git diff --check`

Este relatório registra os resultados descritos na PR; não representa uma nova execução desses comandos durante a escrita deste documento.

## 6. Decisões e limites desta entrega

- A T7 prepara a fundação técnica; não implementa funcionalidades financeiras do MVP.
- A stack aprovada está descrita em [ADR-001 — Definição da stack tecnológica](../decisoes/ADR-001-stack.md).
- IndexedDB/Dexie.js, PWA/Service Worker, funcionamento offline, backup/importação e demais capacidades previstas na ADR continuam sendo trabalho futuro até serem implementados e testados.
- Não foi identificada necessidade de variável de ambiente para a configuração inicial registrada na T7.
- A configuração de hospedagem definitiva permanece sujeita à validação prevista na ADR-001.

## 7. Resultado e próximos passos

A T7 está integrada à `main`. A partir desta base, o projeto pode avançar para as próximas tarefas planejadas, respeitando a ordem de validação de UX, estrutura de interface, modelo de dados e persistência.

A conclusão da T7 não significa que o aplicativo financeiro esteja funcional ou pronto para produção.

## 8. Referências

- [PR #1 — Configuração do ambiente](https://github.com/mosiah-andrade/tangerina/pull/1)
- [ADR-001 — Stack tecnológica](../decisoes/ADR-001-stack.md)
- [Briefing funcional em Markdown](../../briefing_app_financeiro.md)
- [Roadmap do projeto](../../tangerina_roadmap.html)
