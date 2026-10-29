# T9 — Tokens da identidade Tangerina

- **Status:** tokens e estilos-base registrados na branch de trabalho; build ainda não executado.
- **Referência visual:** `identidade-visual.html`.
- **Branch:** `feat/t8-estrutura-aplicacao`.

## 1. Cores

| Token | Valor | Aplicação |
|---|---|---|
| `--color-emerald` | `#0B3C2A` | Cor institucional principal, títulos e ações primárias. |
| `--color-emerald-dark` | `#06261A` | Fundo escuro e variações de profundidade. |
| `--color-gold` | `#C59B27` | Destaques, detalhes e bordas de marca. |
| `--color-gold-light` | `#E5C05B` | Foco e contraste sobre fundos escuros. |
| `--color-gold-dark` | `#9A771C` | Texto dourado com contraste reforçado. |
| `--color-silk` | `#F9F8F3` | Fundo claro principal. |
| `--color-cream` | `#F3F0E6` | Superfícies secundárias. |
| `--color-mint` | `#E2ECE9` | Destaques suaves. |
| `--color-charcoal` | `#1A1A1A` | Texto principal. |

Também foram definidos tokens semânticos para borda, foco, estados de erro/sucesso, tipografia, escala de espaçamento de 4 px, raios, sombras, movimento e largura de conteúdo. Aliases preservam compatibilidade com os estilos existentes enquanto as telas migram gradualmente para os nomes semânticos.

## 2. Tipografia

- `--font-brand`: Cormorant Garamond, para títulos e expressão editorial da marca.
- `--font-body`: Plus Jakarta Sans, para interface, campos, navegação e texto funcional.

## 3. Componentes-base

- `:focus-visible` usa contorno visível dourado com afastamento.
- `.text-input`, `.text-select` e `.text-area` compartilham altura mínima, espaçamento, bordas, estados hover/foco/desabilitado e tipografia.
- `.field-group`, `.field-label`, `.field-hint` e `.field-error` padronizam campos e mensagens.
- `.button-secondary` e `.button-danger` complementam o botão primário existente.
- `.surface-card` fornece superfície reutilizável com borda, raio e sombra de marca.

## 4. Variações de logo identificadas

A análise do manual e dos ativos do repositório identificou as seguintes funções:

- `imagens/Principal_Light.png`: logo principal em fundo claro.
- `imagens/Dark_Luxury.png`: aplicação para fundo esmeralda escuro.
- `imagens/Monocromatico.png`: versão monocromática para documentos e produção de uma cor.
- `imagens/Principal_icon_semFundo.png`: símbolo/ícone principal sem fundo.
- `imagens/logo_semFundo.svg`: ativo vetorial sem fundo.
- `imagens/favicon.svg`: ativo vetorial quadrado para ícone; não presumir que seja o logotipo horizontal.
- `imagens/mobilefaveicon.png`: ícone quadrado de app.
- `imagens/faveicon.png`: ícone redondo/token.

Detalhes, regras de contraste e área de respiro foram registrados em `imagens/README.md`. O manual recomenda área de respiro equivalente ao diâmetro do botão lateral da flor, redução mínima de 25 mm para impresso e 90 px para digital.

## 5. Arquivos alterados

- `app/app/globals.css`: tokens institucionais, tipografia, espaçamento, formas, foco e estilos-base de campos, botões e cards.
- `imagens/README.md`: catálogo e orientação de uso dos ativos oficiais.
- `docs/infra/T9-tokens-identidade.md`: este relatório.

## 6. Validação

Verificação estática do CSS: confirmada a presença dos grupos de tokens, estilos de formulário, variantes de botão, breakpoint responsivo e regras de movimento reduzido. Os hashes dos ativos confirmam que `app/public/favicon.svg` e `imagens/favicon.svg` são idênticos nesta branch.

Não foi executado `npm run lint`, `npm run format:check`, `npm run build` nem validação visual em navegador. Portanto, o código foi atualizado e inspecionado estaticamente; a validação de compilação e renderização permanece pendente.

## 7. Próxima tarefa

Prosseguir com T10 — layout responsivo base, usando os tokens definidos aqui.