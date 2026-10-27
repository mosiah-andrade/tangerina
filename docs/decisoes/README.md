# Registro de decisões — Tangerina Financeiro

**Projeto:** Tangerina Financeiro  
**Documento:** Índice de decisões do projeto  
**Status:** Em elaboração  
**Última revisão:** 27/10/2026

## 1. Objetivo

Este diretório registra decisões de produto, arquitetura e implementação que afetam o desenvolvimento do Tangerina Financeiro. Cada decisão deve deixar claro o contexto, as opções consideradas, a escolha feita, as consequências e o seu status.

As decisões aprovadas nas tarefas T1 e T2 são a referência para o escopo e as regras financeiras do MVP. Este documento não substitui os requisitos nem o roadmap.

## 2. Status das decisões

Use os seguintes status:

- **Proposta:** alternativa sugerida, ainda sem aprovação.
- **Aprovada:** escolha confirmada e válida para o projeto.
- **Substituída:** decisão antiga substituída por outra.
- **Adiada:** decisão conscientemente deixada para uma etapa futura.

Não marque uma tecnologia como aprovada apenas porque aparece como exemplo ou recomendação.

## 3. Decisões já registradas

### D-001 — Escopo do MVP

**Status:** Aprovada  
**Referência:** `docs/requisitos/T1-escopo-mvp.md`

- Público inicial: pessoas físicas e empreendedores individuais.
- O MVP mantém as funcionalidades previstas no briefing aprovado.
- O desenvolvimento prioriza dispositivos móveis.
- Proteção local por PIN ou senha será avaliada depois do MVP.

Consulte o documento T1 para o registro completo e eventuais ressalvas.

### D-002 — Regras financeiras

**Status:** Aprovada  
**Referência:** `docs/requisitos/T2-regras-financeiras.md`

As regras financeiras aprovadas incluem, entre outras:

- Caixinhas globais, não exclusivas de uma única conta bancária.
- Correção obrigatória de inconsistências nos saldos iniciais antes de concluir a configuração.
- Regras de distribuição executadas em ordem definida, com base de cálculo configurável e bloqueio de excesso.
- Despesas acima do saldo da caixinha somente após confirmação explícita.
- Bloqueio de transferências acima do saldo bancário disponível por padrão.
- Retirada em dinheiro tratada como transferência para uma carteira física.
- Arredondamento consistente para centavos, sem distribuir mais que o valor disponível.
- Edição direta de movimentações confirmadas com auditoria dos valores anteriores e novos.

Consulte T2 para as regras completas e seus detalhes.

### D-003 — Operação local e offline-first

**Status:** Aprovada como requisito de produto; implementação técnica pendente

O MVP deve priorizar o uso local e permitir consultar e alterar os dados sem conexão, após o primeiro carregamento ou instalação bem-sucedida.

No escopo atual do MVP:

- Não haverá login.
- Não haverá sincronização em nuvem.
- Não haverá integração bancária.
- Os dados financeiros serão armazenados localmente no dispositivo.
- A aplicação deve informar claramente limitações e riscos de perda dos dados locais.

**Importante:** a tecnologia específica de armazenamento e a estratégia técnica de instalação/offline ainda precisam ser registradas em uma decisão arquitetural própria.

## 4. Decisões arquiteturais pendentes

| ID | Decisão | Status | Documento |
|---|---|---|---|
| ADR-001 | Stack: linguagem, framework e ferramentas de build | Aprovado | `ADR-001-stack.md` |
| ADR-002 | Persistência local e estratégia de versionamento/migração dos dados | Pendente | A criar |
| ADR-003 | Estratégia PWA, cache e funcionamento offline | Pendente | A criar |
| ADR-004 | Arquitetura de domínio financeiro, serviços e interface | Pendente | A criar, se necessário |
| ADR-005 | Estratégia de testes automatizados e checagens de qualidade | Pendente | A criar ou registrar junto à stack |

Os IDs acima são uma proposta de organização, não decisões aprovadas.

## 5. Como registrar uma nova decisão

Crie um arquivo `ADR-NNN-titulo-curto.md` para uma decisão relevante de arquitetura ou tecnologia. Use, no mínimo, esta estrutura:

1. **Título e status**
2. **Contexto:** qual problema precisa ser resolvido?
3. **Requisitos e restrições:** o que a escolha precisa atender?
4. **Opções consideradas:** vantagens e desvantagens de cada opção.
5. **Decisão:** o que foi escolhido e por quê?
6. **Consequências:** benefícios, custos, limitações e impactos na manutenção.
7. **Validação:** como confirmar que a escolha atende ao projeto?
8. **Referências:** documentos, tarefas e decisões relacionadas.

Para decisões de produto e regras financeiras, mantenha o registro nos documentos de requisitos correspondentes, evitando duplicação desnecessária.

## 6. Próximos passos

- [ ] Escolher e aprovar a stack antes de marcar ADR-001 como aprovada.
- [ ] Definir a persistência local compatível com o uso offline e com os dados financeiros.
- [ ] Registrar a estratégia PWA/offline.
- [ ] Atualizar o roadmap somente após a conclusão real de cada tarefa.

## 7. Princípio de governança

Uma decisão documentada não significa que a funcionalidade esteja implementada. Mantenha separados os estados de **decisão aprovada**, **implementação concluída** e **teste aprovado**. Mudanças posteriores devem atualizar o documento pertinente e explicar qual decisão anterior foi substituída.
