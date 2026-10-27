# T5 — Modelo de dados do Tangerina Financeiro

**Projeto:** Tangerina Financeiro  
**Etapa:** M1 — Escopo e decisões do produto  
**Tarefa:** T5 — Definir o modelo de dados (DER)  
**Versão:** 1.0  
**Status:** Proposta técnica documentada; decisões explicitamente pendentes permanecem abertas  
**Base:** T1, T2, T3, T4 e ADR-001 aprovado

> Este documento define uma proposta de estrutura de dados para orientar a implementação. Não significa que o banco ou as funcionalidades já estejam implementados. Regras já aprovadas em T2 são requisitos; pontos marcados como pendentes precisam de decisão antes de serem tratados como comportamento definitivo.

## 1. Objetivos e princípios

O modelo deve suportar o MVP offline-first com Next.js, TypeScript, IndexedDB e Dexie.js, preservando integridade financeira, histórico, exportação e restauração.

1. Persistir valores monetários em **centavos inteiros**.
2. Usar IDs estáveis e independentes da posição dos registros.
3. Diferenciar movimentação financeira, alocação em caixinhas e ocorrência de compromisso.
4. Tratar transferências como operações únicas com dois efeitos correspondentes, sem classificá-las como receita ou despesa.
5. Gravar atomicamente todos os registros que compõem uma operação financeira.
6. Não depender de servidor para as operações centrais.
7. Não apagar o histórico financeiro ao editar ou cancelar uma operação confirmada.
8. Versionar o esquema do banco e implementar migrações compatíveis.

## 2. Diagrama entidade-relacionamento (proposta)

Representação conceitual das relações:

    CONTA 1 --- N MOVIMENTO (como origem ou destino)
    MOVIMENTO 1 --- N EFEITO_SALDO
    CONTA 1 --- N EFEITO_SALDO
    CAIXINHA 1 --- N EFEITO_SALDO
    MOVIMENTO 1 --- N ALOCACAO
    CAIXINHA 1 --- N ALOCACAO
    CAIXINHA 1 --- N REGRA_DISTRIBUICAO
    RECORRENCIA 1 --- N CONTA_PAGAR (ocorrências)
    CONTA 1 --- N CONTA_PAGAR (conta prevista, opcional)
    META 1 --- N APORTE_META
    MOVIMENTO 1 --- N APORTE_META (associação opcional)
    MOVIMENTO 1 --- N AUDITORIA

O diagrama é conceitual. Em IndexedDB/Dexie, os relacionamentos serão mantidos por IDs e índices; não há chaves estrangeiras relacionais automáticas. A aplicação deve validar referências antes de gravar e ao importar backups.

### 2.1. Decisão de modelagem proposta: movimento e efeitos

Recomenda-se manter um registro canônico de **Movimento** e registros explícitos de **EfeitoSaldo** para cada saldo afetado. Por exemplo, uma transferência entre contas possui um único movimento do tipo transferencia_contas e dois efeitos: débito na conta de origem e crédito na conta de destino. Isso evita duplicar a operação no histórico e deixa claro que não é receita nem despesa.

Os saldos devem ser calculados a partir do saldo inicial mais os efeitos confirmados, ou mantidos em projeções derivadas reconstruíveis. Se houver cache de saldo, ele nunca será a única fonte de verdade e deverá ser reconciliável com o livro de movimentos.

## 3. Entidades e campos principais

Os campos abaixo são uma proposta mínima. O campo id será uma string única gerada pela aplicação (por exemplo, UUID). Campos de data devem usar formato ISO ou timestamp normalizado; a zona de exibição será local, sem alterar a data financeira informada pelo usuário.

### 3.1. Conta

Representa uma conta bancária real ou a carteira de dinheiro físico.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador estável |
| nome | string | Obrigatório |
| tipo | bancaria ou carteira_fisica | Distingue dinheiro bancário de espécie |
| instituicao | string opcional | Nome do banco, se aplicável |
| saldoInicialCentavos | integer | Inteiro em centavos |
| dataSaldoInicial | data | Data-base do saldo inicial |
| ativa | boolean | Arquivamento lógico; não apagar histórico |
| createdAt, updatedAt | timestamp | Auditoria técnica |

Regras:
- A carteira física é representada como conta do tipo carteira_fisica, mas não entra no saldo bancário consolidado.
- O MVP deve evitar criar várias carteiras físicas sem uma decisão explícita sobre essa necessidade.
- Uma conta referenciada por movimentos históricos não deve ser removida fisicamente.

### 3.2. Caixinha

Representa uma destinação virtual global, não vinculada exclusivamente a uma conta bancária.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador estável |
| nome | string | Obrigatório |
| descricao | string opcional | Texto livre |
| saldoInicialCentavos | integer | Centavos; validação conforme configuração inicial |
| dataSaldoInicial | data | Data-base |
| cor | string opcional | Apresentação, não regra financeira |
| ativa | boolean | Arquivamento lógico |
| createdAt, updatedAt | timestamp | Auditoria técnica |

O saldo atual da caixinha é derivado do saldo inicial e dos efeitos confirmados. A caixinha não é dinheiro adicional nem uma conta bancária.

### 3.3. Movimento

Registro canônico de receita, despesa, transferência, ajuste ou operação relacionada. Campos específicos devem ser opcionais conforme o tipo, com validação discriminada em TypeScript.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador estável |
| tipo | enum | receita, despesa, transferencia_contas, transferencia_caixinhas, saque_carteira, ajuste_conciliacao |
| status | enum | rascunho, confirmado, cancelado |
| descricao | string | Obrigatória para movimento confirmado |
| valorCentavos | integer positivo | Valor nominal; efeitos indicam os sentidos |
| dataMovimento | data | Data financeira |
| contaOrigemId | string opcional | Obrigatória quando aplicável |
| contaDestinoId | string opcional | Obrigatória para transferência/receita conforme tipo |
| caixinhaId | string opcional | Caixinha primária em despesa/ajuste, quando aplicável |
| idempotencyKey | string | Impede confirmação duplicada da mesma intenção |
| createdAt, updatedAt | timestamp | Datas técnicas |
| confirmedAt | timestamp opcional | Data de confirmação |
| cancelledAt | timestamp opcional | Data do cancelamento |
| motivoCancelamento | string opcional | Justificativa, se solicitada |

Não armazenar números financeiros em ponto flutuante como fonte de verdade. Percentuais podem ser representados em unidades inteiras de precisão documentada (por exemplo, pontos-base) ou decimal validado; a representação escolhida deve ser uniforme e testada.

### 3.4. EfeitoSaldo

Representa o efeito de um movimento em um saldo específico. É uma proposta de implementação para tornar operações compostas explícitas.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| movimentoId | string | Movimento pai |
| tipoAlvo | enum | conta ou caixinha |
| alvoId | string | ID da conta/carteira ou caixinha |
| valorCentavosAssinado | integer | Crédito positivo; débito negativo |
| estado | enum | Efeito ativo apenas se o movimento estiver confirmado |
| createdAt | timestamp | Data técnica |

Exemplos:
- Receita de R$ 100,00: efeito +10.000 centavos na conta bancária; efeitos positivos nas caixinhas de acordo com as alocações confirmadas. O valor distribuído às caixinhas não cria uma saída bancária separada.
- Despesa de R$ 20,00: efeito −2.000 na conta/carteira de pagamento e, se associada, efeito −2.000 na caixinha.
- Transferência entre contas: −valor na origem e +valor no destino.
- Saque: −valor na conta bancária e +valor na carteira física.
- Transferência entre caixinhas: −valor na caixinha de origem e +valor na de destino, sem efeito em contas.
- Ajustes de conciliação precisam de justificativa e de efeitos explícitos; não reescrevem movimentos antigos.

**Atenção:** antes de implementar, confirmar se o modelo de efeitos explícitos será adotado ou se os efeitos serão derivados diretamente do tipo de movimento. Não manter simultaneamente duas fontes independentes de saldo.

### 3.5. Alocacao

Registra a parcela de uma receita ou despesa atribuída a uma caixinha, bem como o resultado de uma regra de distribuição.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| movimentoId | string | Movimento relacionado |
| caixinhaId | string | Destino/origem da alocação |
| tipo | enum | credito_receita, debito_despesa, transferencia_entrada, transferencia_saida, ajuste |
| valorCentavos | integer não negativo | Valor alocado |
| regraDistribuicaoId | string opcional | Regra que originou a alocação |
| ordemAplicacao | integer opcional | Ordem da regra |
| baseCalculoCentavos | integer opcional | Base efetivamente usada |
| percentualAplicado | integer/decimal opcional | Percentual aplicado, conforme padrão definido |
| createdAt | timestamp | Data técnica |

A alocação deve guardar os valores calculados e a base utilizada para que a distribuição histórica não mude se uma regra padrão for editada depois. A relação com EfeitoSaldo deve ser definida na implementação para evitar aplicar a mesma alocação duas vezes.

### 3.6. RegraDistribuicao

Define regras padrão de distribuição de receitas.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| nome | string | Nome da regra |
| caixinhaId | string | Destino |
| tipoCalculo | enum | valor_fixo, percentual_receita_bruta, percentual_saldo_restante |
| valorFixoCentavos | integer opcional | Obrigatório para regra fixa |
| percentual | representação exata | Obrigatório para regra percentual |
| ordem | integer | Define execução |
| ativa | boolean | Ativa/inativa |
| createdAt, updatedAt | timestamp | Datas técnicas |

A ordem deve ser única ou possuir desempate determinístico. A soma calculada nunca pode ultrapassar o valor disponível; o sistema deve mostrar o valor restante. A edição pontual de uma receita não altera a regra padrão.

### 3.7. Recorrencia e ContaPagar

Separar a regra de recorrência das ocorrências individuais evita que uma alteração futura reescreva compromissos já gerados.

**Recorrencia**

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| descricao | string | Obrigatória |
| valorCentavos | integer | Valor previsto |
| diaVencimento | integer 1–31 | Dia pretendido |
| dataInicio | data | Início |
| dataFim | data opcional | Fim, inclusive |
| frequencia | enum | Frequência suportada no MVP |
| ativa | boolean | Interrompe novas ocorrências |
| contaId | string opcional | Conta prevista, não débito automático |
| createdAt, updatedAt | timestamp | Datas técnicas |

**ContaPagar (ocorrência)**

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| recorrenciaId | string opcional | Regra de origem |
| chaveOcorrencia | string | Única por regra e período para impedir duplicidade |
| descricao | string | Cópia histórica da descrição |
| valorCentavos | integer | Cópia histórica do valor previsto |
| dataVencimento | data | Vencimento da ocorrência |
| status | enum | pendente, paga, cancelada |
| movimentoPagamentoId | string opcional | Referência ao movimento se pagamento gerar um |
| createdAt, updatedAt | timestamp | Datas técnicas |

O CA08 de T3 diz que confirmar manualmente o pagamento não deve lançar automaticamente uma segunda despesa nem descontar a conta novamente. Portanto, o modelo deve guardar a referência ao movimento, se houver, e a implementação deve evitar efeitos duplicados. A ligação exata entre “marcar paga” e “registrar despesa” requer definição de fluxo antes da codificação.

**Dia 31:** T3 exige recorrência no dia 31, mas não define de forma explícita como tratar meses mais curtos. Não assumir silenciosamente uma regra. Proposta a confirmar: gerar a ocorrência no último dia do mês quando o dia 31 não existir, mantendo a regra original com diaVencimento=31 e chave de ocorrência por mês. Até confirmação, registrar isso como decisão pendente.

### 3.8. Meta e AporteMeta

**Meta**

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| nome | string | Obrigatório |
| valorAlvoCentavos | integer positivo | Valor-alvo |
| dataAlvo | data opcional | Data desejada |
| modoProgresso | enum | saldo_atual ou aportes_acumulados |
| caixinhaId | string opcional | Caixinha relacionada, se houver |
| ativa | boolean | Estado da meta |
| createdAt, updatedAt | timestamp | Datas técnicas |

**AporteMeta**

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| metaId | string | Meta |
| movimentoId | string opcional | Movimento associado, quando aplicável |
| valorCentavos | integer não negativo | Valor do aporte |
| data | data | Data do aporte |

T3 permite progresso por saldo atual ou por aportes acumulados. A origem do aporte e a prevenção de dupla contagem devem ser especificadas no fluxo de metas antes da implementação.

### 3.9. Auditoria

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador |
| entidadeTipo | enum/string | Entidade alterada |
| entidadeId | string | ID do registro |
| acao | enum | criado, editado, cancelado, restaurado, conciliado |
| antes | JSON serializável | Snapshot anterior relevante |
| depois | JSON serializável | Snapshot novo relevante |
| motivo | string opcional | Justificativa |
| createdAt | timestamp | Data/hora da alteração |

Editar movimento confirmado deve atualizar o movimento atual e guardar no mesmo commit de banco o snapshot anterior e os novos valores. O registro de auditoria não substitui o histórico normal de movimentos. Evitar guardar dados sensíveis desnecessários.

### 3.10. ConfiguracaoApp / metadados

Guardar versão do esquema e metadados necessários para configuração inicial, versão do formato de backup e preferências de interface. Não armazenar tokens ou credenciais de servidor, pois o MVP não usa autenticação.

## 4. Índices sugeridos para Dexie.js

- Movimentos: data, status, tipo, conta de origem/destino, caixinha e idempotencyKey (único quando aplicável).
- Efeitos: movimentoId, alvoId, tipo de alvo.
- Alocações: movimentoId, caixinhaId, regra e ordem.
- Regras: caixinha, estado ativo e ordem.
- Contas a pagar: vencimento, status, recorrência e chaveOcorrencia única.
- Recorrências: estado ativo e próxima geração, caso esse campo seja adotado.
- Metas/aportes: meta e data.
- Auditoria: entidade + ID, data de criação.
- Metadados: chave.

Os índices únicos devem ser usados apenas quando a regra de negócio garantir unicidade e o comportamento de migração/importação estiver definido.

## 5. Invariantes e operações atômicas

1. **Confirmação única:** uma mesma intenção de salvar não pode criar duplicatas. Usar chave de idempotência ou proteção equivalente e testar duplo clique/repetição.
2. **Receita:** gravar movimento, efeitos de conta, alocações e efeitos de caixinha na mesma transação lógica.
3. **Despesa:** gravar movimento e efeitos de conta/carteira e caixinha em uma única transação. Se a caixinha ficar negativa, exigir confirmação antes de iniciar a gravação.
4. **Transferência:** gravar o movimento e os dois efeitos em uma única transação. Não classificar a transferência como receita/despesa.
5. **Saque:** tratar como transferência da conta bancária para carteira física, sem despesa de consumo.
6. **Transferência entre caixinhas:** reduzir a origem e aumentar o destino igualmente; não alterar contas.
7. **Saldo bancário insuficiente:** bloquear por padrão despesas e saques acima do saldo da conta de origem.
8. **Centavos e distribuição:** arredondar de forma consistente; a soma das alocações não pode exceder o valor disponível.
9. **Edição confirmada:** registrar antes/depois na auditoria junto da alteração.
10. **Cancelamento:** preservar o registro cancelado e reverter ou neutralizar seus efeitos de modo consistente; a estratégia técnica exata deve impedir reversão duplicada.
11. **Conciliação:** preservar movimentos antigos e exigir justificativa e prévia do ajuste.
12. **Backup/importação:** validar estrutura e versão antes de modificar dados. Uma importação inválida não pode deixar a base parcialmente substituída.
13. **Migração:** versionar o esquema Dexie; testar migrações com uma cópia de dados de versão anterior.
14. **Saldos derivados:** não manter dois valores independentes como fonte de verdade. Se existir cache de saldo, deve ser reconstruível.

## 6. Importação e exportação

O backup deve incluir as entidades de domínio, IDs, estado dos registros, auditoria relevante, versão do formato e data de exportação. Não incluir caches descartáveis ou dados transitórios.

A restauração precisa validar:
- formato e versão reconhecida;
- tipos, campos obrigatórios, valores inteiros em centavos e IDs;
- referências entre entidades;
- duplicidades e chaves únicas;
- coerência dos efeitos financeiros;
- compatibilidade de migração.

**Decisão pendente:** definir se a restauração do MVP sempre substitui todos os dados locais ou se haverá opção de mesclar. Não implementar mesclagem sem regra explícita de conflito e deduplicação. Qualquer substituição deve exigir confirmação clara e ocorrer de forma atômica.

## 7. Estrutura sugerida de tipos TypeScript

A forma exata poderá ser ajustada ao código, mantendo tipos discriminados e regras de validação no domínio:

    type Centavos = number; // validado como inteiro seguro
    type Id = string;
    type TipoConta = "bancaria" | "carteira_fisica";
    type TipoMovimento =
      | "receita"
      | "despesa"
      | "transferencia_contas"
      | "transferencia_caixinhas"
      | "saque_carteira"
      | "ajuste_conciliacao";

    interface EntidadeBase {
      id: Id;
      createdAt: string;
      updatedAt: string;
    }

    interface Conta extends EntidadeBase {
      nome: string;
      tipo: TipoConta;
      saldoInicialCentavos: Centavos;
      dataSaldoInicial: string;
      ativa: boolean;
    }

    interface Caixinha extends EntidadeBase {
      nome: string;
      saldoInicialCentavos: Centavos;
      dataSaldoInicial: string;
      ativa: boolean;
    }

    interface Movimento extends EntidadeBase {
      tipo: TipoMovimento;
      status: "rascunho" | "confirmado" | "cancelado";
      descricao: string;
      valorCentavos: Centavos;
      dataMovimento: string;
      idempotencyKey: string;
      contaOrigemId?: Id;
      contaDestinoId?: Id;
      caixinhaId?: Id;
      confirmedAt?: string;
      cancelledAt?: string;
    }

Usar Number.isSafeInteger(valorCentavos) e validar positividade conforme o campo. Conversões de reais para centavos devem ocorrer em uma função de domínio testada, nunca espalhadas pelos componentes visuais.

## 8. Decisões pendentes antes da implementação

As propostas abaixo não alteram decisões aprovadas de T2; elas detalham como implementar os requisitos.

| ID | Questão | Proposta técnica | Estado |
|---|---|---|---|
| T5-D01 | Como representar os efeitos dos movimentos? | Movimento canônico + efeitos de saldo explícitos, sem segunda fonte de verdade | Proposta; confirmar antes da implementação |
| T5-D02 | Regra de vencimento no dia 31 em meses curtos | Ocorrência no último dia do mês, mantendo dia 31 na regra | Pendente de confirmação |
| T5-D03 | Marcar conta a pagar como paga | Definir se a ação exige criar/selecionar movimento ou apenas altera status | Pendente de definição do fluxo |
| T5-D04 | Restauração de backup | Substituição total como comportamento inicial mais simples, com confirmação e transação atômica | Proposta; confirmar |
| T5-D05 | Progresso de meta por aportes | Definir origem dos aportes e como evitar dupla contagem | Pendente de definição do fluxo |
| T5-D06 | Várias carteiras físicas | Manter uma carteira padrão no MVP, salvo necessidade aprovada | Proposta |

## 9. Critérios de conclusão do T5

- [ ] Entidades principais, atributos e relações estão documentados.
- [ ] O modelo distingue conta bancária, carteira física e caixinha global.
- [ ] Transferências e saques não geram receitas/despesas fictícias.
- [ ] Receita, despesa e alocações não duplicam efeitos financeiros.
- [ ] Valores monetários são persistidos em centavos inteiros.
- [ ] Edição, cancelamento, auditoria e idempotência possuem estratégia documentada.
- [ ] Recorrências preservam ocorrências antigas e impedem duplicidade.
- [ ] Backup, restauração e migrações são considerados.
- [ ] Decisões ainda abertas estão claramente identificadas e não são tratadas como aprovadas.

## 10. Referências

- docs/requisitos/T1-escopo-mvp.md
- docs/requisitos/T2-regras-financeiras.md
- docs/requisitos/T3-criterio-aceitacao.md
- docs/ux/T4-mapa-navegacao-fluxos.md
- docs/decisoes/ADR-001-stack.md
- tangerina_roadmap.html

## 11. Histórico

| Versão | Alteração |
|---|---|
| 1.0 | Proposta inicial de modelo de dados, relações, integridade e decisões pendentes |
