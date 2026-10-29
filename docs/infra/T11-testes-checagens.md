# T11 — Configurar testes e checagens

## Objetivo

Estabelecer uma rotina mínima e reproduzível de validação para o Tangerina Financeiro sem duplicar ferramentas já configuradas.

## Estado anterior

- ESLint disponível por `npm run lint`.
- Prettier disponível por `npm run format:check`.
- Build de produção disponível por `npm run build`.
- GitHub Actions executava ESLint e build.
- Não havia teste unitário identificado na auditoria.

## Entregas

- Adicionado `npm run typecheck` usando `tsc --noEmit`.
- Adicionado `npm run test` usando o runner nativo `node:test` do Node.js 22, sem nova dependência de teste.
- Criado `app/lib/format-money.ts`, utilitário exclusivamente de apresentação para formatar centavos inteiros como BRL e rejeitar entradas que não sejam inteiros seguros.
- Criados testes para valores positivos, zero, negativos, frações e inteiros fora da faixa segura.
- Atualizada a CI para executar testes, verificação de tipos, ESLint e build.
- Criado checklist de validação manual em `docs/infra/T11-checklist-validacao.md`.

## Limites

O utilitário não implementa regras financeiras, persistência ou cálculos de saldo. As regras monetárias do domínio permanecem para tarefas posteriores. Os testes não demonstram que o aplicativo já persiste dados ou executa operações financeiras reais.

## Comandos de validação

Executar a partir de `app/`:

```bash
npm ci
npm run test
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Critério de conclusão

T11 só deve ser marcada como concluída após a CI passar e o checklist manual ser conferido. O merge para `main` depende de aprovação explícita.
