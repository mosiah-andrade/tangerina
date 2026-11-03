# T14 — Camada de Persistência Local

**Projeto:** Tangerina Financeiro  
**Etapa:** M3 — Modelo de dados e persistência local  
**Tarefa:** T14 — Implementar camada de persistência  
**Versão:** 1.0  
**Status:** Especificação técnica aprovada pelo usuário; implementação pendente  
**Base:** T5, T12, T2, T3 e ADR-001

> Este documento consolida as decisões aprovadas para orientar a implementação da persistência local. A aprovação desta especificação não significa que o banco, os repositórios, as migrações, os backups ou os testes já estejam implementados.

## 1. Objetivo e princípios

Implementar armazenamento local offline-first usando IndexedDB com Dexie.js, preservando consistência financeira, histórico, integridade entre entidades e capacidade de backup/restauração.

Princípios obrigatórios:

1. O dispositivo é a fonte de persistência do MVP; as operações centrais não dependem de servidor.
2. Valores monetários são armazenados em centavos inteiros.
3. Entidades de negócio usam IDs estáveis gerados localmente.
4. Relações são representadas por IDs e validadas pela aplicação.
5. Operações financeiras compostas são atômicas.
6. Saldos são derivados dos saldos iniciais e efeitos válidos; não há tabela independente de saldo como fonte de verdade.
7. Histórico financeiro não é apagado fisicamente por operações comuns.
8. Esquema e formato de backup são versionados separadamente.
9. Falhas não podem resultar em gravação parcial nem em substituição silenciosa de dados.

## 2. Escopo inicial: tabelas

A versão inicial do banco terá as 12 tabelas abaixo:

| Tabela | Finalidade |
|---|---|
| `contas` | Contas bancárias e carteira física |
| `caixinhas` | Destinações virtuais globais |
| `movimentos` | Registro canônico das operações financeiras |
| `efeitosSaldo` | Impactos financeiros assinados em contas ou caixinhas |
| `alocacoes` | Destinações de movimentos para caixinhas |
| `regrasDistribuicao` | Regras padrão ordenadas de distribuição |
| `contasPagar` | Ocorrências individuais de compromissos |
| `recorrencias` | Regras que geram ocorrências |
| `metas` | Objetivos financeiros |
| `aportesMeta` | Aportes associados a metas |
| `auditorias` | Histórico de alterações relevantes |
| `metadados` | Configurações e metadados técnicos |

Todas as entidades de negócio usam `id` como chave primária. `metadados` é a exceção intencional: usa `chave` como chave primária, sem exigir `id` ou timestamps de entidade de negócio.

Os campos de negócio seguem os contratos e o DER de `docs/arquitetura/T5-modelo-dados.md`, complementados pelos tipos e invariantes de `docs/arquitetura/T12-modelagem-entidades.md`. Esta especificação não cria campos financeiros alternativos nem altera o modelo aprovado.

## 3. Índices Dexie aprovados

A declaração dos índices deverá usar a sintaxe Dexie correspondente. Índices compostos são representados por `[campo1+campo2]`.

| Tabela | Índices |
|---|---|
| `contas` | `tipo`, `ativa` |
| `caixinhas` | `ativa` |
| `movimentos` | `tipo`, `status`, `dataMovimento`, `contaOrigemId`, `contaDestinoId`, `&idempotencyKey` |
| `efeitosSaldo` | `movimentoId`, `[tipoAlvo+alvoId]`, `alvoId` |
| `alocacoes` | `movimentoId`, `caixinhaId`, `regraDistribuicaoId` |
| `regrasDistribuicao` | `caixinhaId`, `[caixinhaId+ordem]`, `ativa` |
| `recorrencias` | `ativa`, `contaId` |
| `contasPagar` | `recorrenciaId`, `dataVencimento`, `status`, `&chaveOcorrencia` |
| `metas` | `caixinhaId`, `ativa` |
| `aportesMeta` | `metaId`, `movimentoId`, `data` |
| `auditorias` | `[entidadeTipo+entidadeId]`, `createdAt` |
| `metadados` | `&chave` (chave primária) |

Os índices únicos protegem as regras de idempotência e unicidade de ocorrência. Importação e restauração devem respeitar essas restrições e detectar conflitos antes de substituir os dados.

## 4. Abertura, instância e versionamento

### 4.1. Configuração inicial

- Módulo central: `app/lib/persistence/database.ts`.
- Nome do banco: `tangerina-financeiro`.
- Versão inicial do esquema Dexie: `1`.
- Manter uma única instância compartilhada da classe Dexie.
- Centralizar o acesso ao banco nesta camada; componentes não acessam IndexedDB diretamente.
- Não abrir nem depender do IndexedDB durante renderização no servidor (SSR). A abertura deve ocorrer em contexto de navegador, sob controle explícito.
- Se o navegador não oferecer IndexedDB, retornar erro controlado de indisponibilidade.

### 4.2. Migrações

1. Nunca reduzir a versão do banco.
2. Nunca apagar dados para resolver incompatibilidade.
3. Toda mudança estrutural futura incrementa a versão Dexie.
4. Migrações preservam registros existentes e usam o mecanismo transacional do Dexie.
5. Cada migração deve possuir testes automatizados com dados representativos da versão anterior.
6. Falha durante migração deve resultar em rollback, sem banco parcialmente migrado.
7. Abrir um banco existente não pode recriá-lo vazio nem sobrescrever seus dados.

### 4.3. Concorrência entre abas e falhas de abertura

- Ao receber solicitação de mudança de versão, uma conexão antiga deve fechar conforme o ciclo de versão do Dexie.
- Se outra aba bloquear a atualização, informar que existe outra aba aberta e orientar o usuário a fechá-la.
- Falha de abertura deve ser comunicada como erro controlado.
- É proibido apagar automaticamente o banco ou substituir os dados por uma base vazia como fallback.

A tabela `metadados` pode registrar informações técnicas, como versão de formato de backup e estado de configuração, sem se tornar fonte alternativa para dados financeiros.

## 5. Organização dos módulos e responsabilidades

Estrutura proposta:

```text
app/lib/persistence/
├── database.ts
├── errors.ts
├── transactions.ts
└── repositories/
    ├── contas.ts
    ├── caixinhas.ts
    ├── movimentos.ts
    ├── regras-distribuicao.ts
    ├── contas-pagar.ts
    ├── recorrencias.ts
    ├── metas.ts
    └── auditorias.ts
```

- `database.ts`: classe Dexie, declaração das tabelas, índices, versão e instância compartilhada.
- `errors.ts`: erros tipados e padronizados da persistência.
- `transactions.ts`: operações transacionais que envolvem múltiplas tabelas.
- `repositories/`: funções de leitura e gravação por agregado/entidade.

Os repositórios oferecem operações como buscar por ID, listar com filtros, inserir, atualizar e arquivar quando aplicável. Não devem decidir regras financeiras. A camada de domínio valida se uma despesa pode deixar uma caixinha negativa, se uma transferência é permitida ou como distribuir uma receita. A persistência valida formato, integridade estrutural e referências.

Limites de responsabilidade:

| Camada | Responsabilidade |
|---|---|
| Interface | Exibir dados e receber ações |
| Domínio | Regras financeiras e validações de negócio |
| Persistência | Leitura, gravação, integridade estrutural e transações |
| IndexedDB | Armazenamento local |

## 6. Transações e consistência financeira

Qualquer operação que altere várias tabelas relacionadas deve ser executada em uma única transação Dexie.

Exemplo de confirmação de movimento: gravar o movimento, os efeitos de saldo, as alocações e a auditoria aplicável na mesma transação.

- Sucesso de todas as gravações: confirmar a transação.
- Falha em qualquer etapa: reverter todas as alterações.
- Não pode existir movimento confirmado sem os efeitos e alocações que compõem sua operação.
- Uma repetição da mesma intenção não pode duplicar a confirmação; a chave única de idempotência deve ser respeitada.
- O cancelamento de movimento confirmado deve neutralizar os efeitos uma única vez e preservar o registro original.
- A edição de movimento confirmado deve substituir/recalcular efeitos sem duplicação e registrar auditoria no mesmo commit.

A relação entre `Alocacao` e `EfeitoSaldo` deve seguir T5: alocação documenta a destinação; efeito representa o impacto efetivo no saldo. A implementação deve evitar que ambos apliquem o mesmo impacto duas vezes. Saldos são derivados dos saldos iniciais e efeitos válidos.

## 7. Integridade e validação antes de gravar

A persistência deve rejeitar dados estruturalmente inválidos, inclusive quando a operação não partir da interface.

Validar, no mínimo:

- Campos obrigatórios e tipos esperados.
- IDs não vazios e estáveis; IDs não podem ser alterados em atualização.
- Valores monetários como inteiros seguros em centavos.
- Datas nos formatos definidos (`DataISO` e `DateTimeISO`).
- Percentuais na representação inteira aprovada (`PontosBase`).
- Referências obrigatórias para registros existentes.
- Restrições de unicidade, incluindo `idempotencyKey` e `chaveOcorrencia`.
- Coerência entre estado e campos relacionados, conforme contratos do domínio.

Atualizações devem preservar `createdAt`, atualizar `updatedAt` e evitar sobrescrita integral desnecessária quando uma atualização parcial for adequada.

Não excluir fisicamente registros financeiros históricos. Usar cancelamento, arquivamento ou reversão conforme o domínio. Exclusão física fica restrita a dados técnicos quando explicitamente segura.

A camada de persistência não substitui as regras de domínio nem valida isoladamente todas as invariantes financeiras; ambas as camadas devem cooperar.

## 8. Tratamento de erros

A camada deve distinguir e expor erros identificáveis para:

- IndexedDB indisponível.
- Falha ao abrir o banco.
- Banco bloqueado por outra aba.
- Registro não encontrado.
- Dados inválidos para persistência.
- Referência inexistente.
- Conflito de unicidade/idempotência.
- Falha de transação.
- Backup inválido ou incompatível.
- Falha de migração.

A camada superior poderá converter esses erros em mensagens compreensíveis. Não ocultar falhas nem retornar sucesso quando a transação não foi confirmada.

## 9. Testes

### 9.1. Ferramentas aprovadas

- Vitest para execução e organização dos testes.
- `fake-indexeddb` para fornecer IndexedDB simulado nos testes automatizados.
- Testes complementares em navegador real antes de considerar a persistência validada.

A implementação deve ajustar os scripts existentes sem remover as checagens atuais. O `package.json` atual utiliza `node --experimental-strip-types --test tests/*.test.mjs`; a adoção do Vitest deverá ser feita de forma explícita, preservando ou migrando a cobertura existente.

### 9.2. Grupos de teste

| Grupo | Cobertura mínima |
|---|---|
| Banco | Criação, abertura, reabertura, versão e indisponibilidade |
| Repositórios | Inserção, consulta, atualização, arquivamento e referências |
| Transações | Commit integral e rollback integral em falhas |
| Integridade | Tipos inválidos, referências ausentes e chaves duplicadas |
| Migrações | Atualização de versão preservando registros |
| Backup | Exportação, validação, restauração, arquivo inválido e falha |
| Navegador | Persistência real após recarregar/fechar e reabrir a aplicação |

Os testes devem ser isolados, repetíveis e não depender de dados de execuções anteriores. Não usar dados financeiros reais do usuário.

## 10. Backup e restauração

### 10.1. Exportação

- Exportar os dados necessários para recuperação do aplicativo em arquivo JSON.
- Incluir versão independente do formato de backup e data de geração.
- Preservar IDs, relações, estados e histórico necessários.
- Não incluir dados temporários ou informações técnicas desnecessárias.
- A exportação ocorre por ação explícita do usuário; não enviar backups automaticamente a servidores nem sobrescrever arquivos sem autorização.

### 10.2. Validação

Antes de qualquer restauração, validar:

- Estrutura e identificação do formato.
- Versão do formato e compatibilidade.
- Tipos, campos obrigatórios e IDs.
- Referências entre entidades.
- Duplicidades e restrições de unicidade.
- Integridade dos registros necessários.

Arquivo inválido, corrompido ou incompatível deve ser rejeitado sem modificar os dados atuais.

### 10.3. Restauração

Modelo aprovado: substituição integral dos dados locais.

1. Informar claramente que os dados atuais serão substituídos.
2. Exigir confirmação explícita do usuário.
3. Validar o arquivo antes de iniciar qualquer alteração.
4. Restaurar as tabelas em uma única transação.
5. Se a operação falhar, fazer rollback e manter os dados anteriores intactos.
6. Não apagar o banco atual como etapa preliminar de recuperação.

A versão do arquivo de backup é independente da versão interna do esquema Dexie. Mudanças futuras no formato devem possuir migrações próprias e testadas.

## 11. Critérios de aceitação da T14

A tarefa só poderá ser considerada implementada e concluída quando todos os itens aplicáveis forem demonstrados:

- [ ] Banco Dexie criado com nome e versão definidos.
- [ ] As 12 tabelas e índices aprovados estão declarados.
- [ ] Instância compartilhada e acesso centralizado implementados.
- [ ] Abertura ocorre somente em contexto de navegador.
- [ ] Banco existente abre sem perda ou recriação de dados.
- [ ] Migrações versionadas preservam dados e possuem testes.
- [ ] Repositórios implementados sem regras financeiras escondidas.
- [ ] Operações compostas usam transações atômicas.
- [ ] Validações estruturais e de referências estão implementadas.
- [ ] Erros relevantes são identificáveis e tratados.
- [ ] Testes automatizados cobrem banco, repositórios, transações, integridade e migrações.
- [ ] Backup JSON é exportado com versão e data.
- [ ] Restauração valida o arquivo antes de alterar a base.
- [ ] Restauração por substituição integral é atômica e exige confirmação.
- [ ] Testes em navegador real confirmam persistência após reabertura.
- [ ] Testes, typecheck, lint, format:check e build passam na CI.

## 12. Relação com T2, T3, T5 e T12

- T2 define as regras financeiras que o domínio deve preservar.
- T3 define os critérios funcionais e casos-limite, incluindo recorrência, cancelamento, idempotência e backup.
- T5 define o DER e os campos das entidades.
- T12 define IDs, tipos fundamentais, relações e invariantes.
- T14 implementa a infraestrutura de armazenamento local para suportar essas definições.

A regra de recorrência do dia 31 permanece: gerar a ocorrência no último dia do mês quando o dia pretendido não existir, preservando o dia configurado na regra. A simples marcação de conta a pagar como paga não cria automaticamente outra despesa. Essas regras pertencem ao domínio e devem ser cobertas pelos testes de integração com a persistência.

## 13. Pendências técnicas a resolver durante a implementação

Os seguintes pontos não devem ser preenchidos por suposição:

1. Definir o contrato exato de geração e persistência de `EfeitoSaldo` a partir das `Alocacoes`, respeitando T5 e impedindo dupla contagem.
2. Definir o mecanismo concreto de neutralização idempotente dos efeitos no cancelamento, mantendo histórico e integridade.
3. Conferir a lista de frequências de recorrência contra a especificação T3 vigente antes de codificar enums ou validações.
4. Definir o envelope JSON definitivo do backup e sua política inicial de compatibilidade/migração.
5. Confirmar compatibilidade das versões escolhidas de Vitest e `fake-indexeddb` com o ambiente atual do projeto.

Esses pontos são decisões de implementação/contrato que exigem validação; não autorizam alterar as regras de negócio já aprovadas.

## 14. Histórico e status

| Marco | Estado |
|---|---|
| T14-01 — 12 tabelas iniciais | Aprovado |
| T14-02 — esquema e índices | Aprovado |
| T14-03 — abertura, configuração, versionamento e migrações | Aprovado |
| T14-04 — repositórios, transações e responsabilidades | Aprovado |
| T14-05 — integridade e validação | Aprovado |
| T14-06 — estratégia de testes | Aprovado |
| T14-07 — backup e restauração | Aprovado |
| Consolidação desta especificação | Aprovada |
| Implementação e testes | Pendentes |
| Atualização do roadmap | Pendente de conclusão e autorização explícita |

## 15. Referências

- `docs/arquitetura/T5-modelo-dados.md`
- `docs/arquitetura/T12-modelagem-entidades.md`
- `docs/requisitos/T2-regras-financeiras.md`
- `docs/requisitos/T3-criterio-aceitacao.md`
- `docs/decisoes/ADR-001-stack.md`
- `app/README.md`
- `app/lib/persistence/README.md`
- `tangerina_roadmap.html`
