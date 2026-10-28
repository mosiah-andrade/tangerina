# UX2 — Protótipo de baixa fidelidade no Figma

- **Projeto:** Tangerina Financeiro
- **Tarefa:** UX2 — Criar protótipo de baixa fidelidade no Figma
- **Status:** Protótipo inicial criado; pronto para validação UX3
- **Data:** 28/10/2026
- **Arquivo Figma:** https://www.figma.com/design/3g1tk0uRUD3cNv96U0gXeN/Tangerina-Financeiro-Wireframes-Mobile
- **Base:** `docs/ux/UX1-inventario-telas-estados.md`, briefing, decisões T1/T2 e ADR-001.

## 1. Objetivo

Traduzir o inventário UX1 em wireframes mobile editáveis, para tornar visível a hierarquia de informação e os principais formulários do MVP antes de implementar as interfaces.

## 2. Entrega

Foi criada no Figma a página **“UX2 — Wireframes mobile”**, com 23 frames separados de 390 × 844 px. As telas usam camadas de texto editáveis e containers com Auto Layout, em estilo de baixa fidelidade: fundo branco, superfícies cinza-claro, bordas discretas e acentos em verde-escuro.

### Frames criados

1. Boas-vindas
2. Aviso de armazenamento local
3. Contas bancárias — configuração inicial
4. Caixinhas — configuração inicial
5. Regras de distribuição
6. Início / Dashboard
7. Revisão da configuração
8. Lista de contas
9. Detalhe da caixinha
10. Formulário de receita
11. Revisão da distribuição da receita
12. Formulário de despesa
13. Transferência
14. Contas a pagar
15. Confirmação de pagamento
16. Objetivos
17. Histórico de movimentos
18. Detalhe do movimento e auditoria
19. Conciliação de saldos
20. Relatórios
21. Exportação de dados
22. Importação/restauração de backup
23. Configurações

## 3. Decisões de UX refletidas

- Interface em português do Brasil, mobile-first.
- A tela inicial usa o título **“Suas finanças mais organizadas”** e a ação **“Começar”**.
- O dashboard apresenta o contexto **Pessoal**, saldo total, caixinhas e saldo não alocado em áreas distintas.
- A configuração inicial separa contas, caixinhas, regras de distribuição e revisão.
- As caixinhas são apresentadas como globais.
- A revisão da receita deixa explícitos os valores distribuídos e o saldo restante.
- A interface de despesa diferencia origem do dinheiro e caixinha opcional.
- O fluxo de transferência inclui aviso sobre bloqueio padrão de transferência acima do saldo bancário.
- Exportação e importação apresentam avisos para reduzir o risco de perda de dados.
- PIN/senha permanece identificado como item a avaliar após o MVP, conforme T1.

## 4. Limites conhecidos

Este artefato é um **wireframe estático de baixa fidelidade**, não uma interface implementada nem um protótipo navegável completo. Os valores monetários, exemplos de movimentação, datas, metas e nomes de contas usados nos frames são ilustrativos e não representam dados reais do usuário.

Ainda não foram validados:
- a legibilidade de todos os conteúdos em diferentes estados e tamanhos de texto;
- os estados de erro, vazio, carregamento, sucesso e confirmação de operações críticas em cada tela;
- as conexões clicáveis entre os frames;
- todos os fluxos e regras financeiras contra os critérios de aceitação.

## 5. Próxima etapa — UX3

Executar revisão do protótipo contra UX1, T1/T2, T3 e T4. Corrigir hierarquia, conteúdo, estados e fluxos; conectar as principais jornadas no Figma e obter aprovação antes de considerar a experiência validada para implementação.

## 6. Critério de conclusão de UX2

- [x] Arquivo Figma criado.
- [x] Inventário UX1 representado por 23 frames separados.
- [x] Frames com dimensões 390 × 844 px.
- [x] Conteúdo em português BR.
- [x] Camadas de texto editáveis e containers com Auto Layout.
- [x] Estilo low-fi com cinzas e acentos discretos em verde-escuro.
- [ ] Conexões navegáveis e validação dos fluxos — escopo de UX3.
- [ ] Aprovação do protótipo — escopo de UX3.
