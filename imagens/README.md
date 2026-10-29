# Variações oficiais da identidade Tangerina

As imagens e os vetores desta pasta são os ativos de referência do manual `identidade-visual.html`. Não substitua uma variação por outra sem considerar fundo, contraste e tamanho de uso.

## Logotipos e símbolos

| Arquivo | Uso documentado/recomendado |
|---|---|
| `Principal_Light.png` | Versão principal para fundo claro/off-white; símbolo dourado e tipografia verde-esmeralda. |
| `Dark_Luxury.png` | Versão para fundo verde-esmeralda escuro; símbolo dourado e tipografia clara. |
| `Monocromatico.png` | Versão monocromática para documentos, gravação e aplicações de uma só cor. |
| `Principal_icon_semFundo.png` | Ativo de ícone principal sem fundo, útil quando o layout já fornece o fundo. Confirmar contraste no contexto antes de usar. |
| `logo_semFundo.svg` | Versão vetorial sem fundo; preferir quando for necessário redimensionamento sem perda. Conferir contraste antes de aplicar em fundos coloridos. |
| `favicon.svg` | Ativo vetorial quadrado para favicon/ícone. Não presumir que seja o logotipo horizontal. |
| `mobilefaveicon.png` | Ícone quadrado do app, conforme a prancha de variações do manual. |
| `faveicon.png` | Ícone/token redondo para aplicações pequenas, conforme a prancha do manual. |

## Regras do manual

- Fundos claros: usar `Principal_Light`.
- Fundos escuros/esmeralda: usar `Dark_Luxury`.
- Aplicações monocromáticas: usar `Monocromatico`.
- Ícone de aplicativo ou favicon: usar os ativos reduzidos, evitando logotipo completo em tamanhos minúsculos.
- Área de respiro: manter livre uma área equivalente ao diâmetro do botão lateral da flor.
- Redução mínima recomendada: 25 mm em mídia impressa e 90 px em mídia digital.
- Não esticar, comprimir, redesenhar ou trocar arbitrariamente as cores da marca.

## Uso no Next.js

Os ativos originais estão nesta pasta do repositório. Para referenciá-los com o componente `next/image`, primeiro disponibilize a cópia correspondente em `app/public/brand/`; não referencie diretamente a pasta `imagens/` como se ela fosse pública do Next.js. O arquivo `app/public/favicon.svg` existente tem o mesmo conteúdo de `imagens/favicon.svg`, conforme os hashes verificados nesta branch.

Os nomes `faveicon`/`mobilefaveicon` são preservados por compatibilidade com os arquivos originais; não renomear sem atualizar as referências.