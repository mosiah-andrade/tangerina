# T14-12-02 — Validação estrutural das entidades

**Projeto:** Tangerina Financeiro  
**Tarefa:** T14-12-02  
**Status:** Concluída e integrada à `main` (merge confirmado pelo usuário)  
**Branch de trabalho:** `feat/t14-12-validacao-integridade`  
**Data do registro:** 03/11/2026

## 1. Objetivo

Implementar uma camada reutilizável de validação em runtime para os registros persistidos pelo Tangerina. A camada verifica a estrutura e os formatos dos dados antes que sejam aceitos pelos fluxos de persistência, sem assumir responsabilidades pelas regras transacionais ou pela existência dos relacionamentos.

## 2. Arquivos envolvidos

Implementação:

- `app/lib/persistence/validation/types.ts`
- `app/lib/persistence/validation/errors.ts`
- `app/lib/persistence/validation/validators.ts`

Testes:

- `app/tests/persistence-validation.test.mjs`
- `app/tests/persistence-validation-entities.test.mjs`

## 3. Contrato de validação

Os validadores recebem `unknown` e retornam um resultado discriminado:

```ts
type ValidationResult =
  | { valido: true; erros: [] }
  | {
      valido: false;
      erros: Array<{
        campo: string;
        codigo: string;
        mensagem: string;
      }>;
    };
```

Cada erro identifica o campo, um código estável e uma mensagem legível. A camada também disponibiliza `ValidationError` e utilitários para converter resultados inválidos em exceções quando o chamador precisar desse comportamento.

## 4. Cobertura implementada

Há validadores estruturais para os 12 registros persistidos:

| Registro | Validações principais |
|---|---|
| Conta | UUID, nome, tipo, saldo inicial em centavos, data inicial, estado ativo e instituição opcional |
| Caixinha | UUID, nome, saldo inicial, data, estado ativo, descrição e cor opcionais |
| Movimento | UUIDs, tipo, status, descrição, valor positivo, data, chave de idempotência e campos opcionais |
| EfeitoSaldo | IDs, alvo, tipo de alvo, valor assinado inteiro seguro e estado |
| Alocacao | IDs, tipo, valor, ordem, base de cálculo e percentual opcional |
| RegraDistribuicao | IDs, nome, ordem, estado, tipo de cálculo e compatibilidade entre campos fixos/percentuais |
| Recorrencia | IDs, descrição, valor positivo, dia 1–31, datas, frequência não vazia e estado |
| ContaPagar | IDs, chave de ocorrência, descrição, valor, vencimento, status e referências opcionais |
| Meta | ID, nome, valor-alvo, modo de progresso, data-alvo, caixinha opcional e estado |
| AporteMeta | IDs, valor positivo e data |
| Auditoria | ID, data de criação, tipo de entidade, ID da entidade, ação, snapshots JSON e motivo opcional |
| MetadataRecord | Chave não vazia e valor compatível com JSON |

## 5. Regras transversais

- **Dinheiro:** valores são validados como inteiros seguros em centavos, usando `Number.isSafeInteger()`. Os limites mínimos variam conforme o campo; efeitos de saldo aceitam valores assinados.
- **Percentuais:** representados em pontos-base, entre 0 e 10.000 (0% a 100%).
- **UUID:** identificadores são validados por formato UUID.
- **DataISO:** formato `YYYY-MM-DD` e validação da existência real da data no calendário.
- **DateTimeISO:** timestamp ISO 8601 com fuso horário explícito.
- **Enums:** valores restritos às opções declaradas nos tipos do domínio.
- **JSON:** snapshots e metadados rejeitam valores não serializáveis, números não finitos e referências circulares.
- **Campos opcionais:** quando ausentes, não geram erro; quando presentes, são validados.

### Regras específicas

- Regras de distribuição de valor fixo exigem `valorFixoCentavos` e rejeitam `percentual`.
- Regras percentuais exigem `percentual` e rejeitam `valorFixoCentavos`.
- A frequência de recorrência permanece como string não vazia. A lista definitiva de frequências depende da revisão dos requisitos T3.
- Os campos condicionais dos movimentos são validados quanto ao formato quando presentes. As combinações operacionais completas por tipo de movimento permanecem fora desta etapa.

## 6. Limites de escopo

Esta etapa trata de **validação estrutural**, não de integridade referencial ou execução financeira.

Não faz parte da T14-12-02:

- confirmar se uma conta, caixinha, movimento, meta ou recorrência referenciada realmente existe;
- verificar se referências pertencem ao tipo correto ou se relacionamentos são coerentes entre registros;
- verificar saldo bancário disponível, saldo de caixinha ou permissão para saldo negativo;
- executar distribuição financeira ou validar excesso de alocação;
- aplicar cancelamentos, reversões, auditoria transacional ou idempotência operacional;
- garantir atomicidade de operações de negócio.

Esses pontos devem ser tratados nas etapas seguintes, especialmente a **T14-12-03 — validação de integridade referencial**, e nas tarefas de serviços/transações financeiras.

## 7. Testes e verificações

Resultado informado após a execução local em `app/`:

| Comando | Resultado |
|---|---|
| `npm test` | 75 testes aprovados; 0 falhas |
| `npm run typecheck` | Aprovado |
| `npm run lint` | Aprovado |
| `npm run build` | Build de produção concluído |
| `git diff --check` | Sem problemas de whitespace |

Os testes cobrem casos válidos, campos obrigatórios ausentes, tipos e enums inválidos, limites numéricos, datas inválidas, valores JSON incompatíveis e snapshots circulares.

O Node.js emitiu avisos `MODULE_TYPELESS_PACKAGE_JSON` durante os testes para arquivos ES Module sem declaração explícita de tipo no `package.json`. Os avisos não interromperam os testes e não foram tratados como falhas desta tarefa.

## 8. Critérios de conclusão

- [x] Contratos e helpers de validação definidos.
- [x] Validadores estruturais para as 12 entidades implementados localmente.
- [x] Testes unitários para primitivas e entidades.
- [x] Testes locais aprovados: 75/75.
- [x] Typecheck, lint e build aprovados.
- [x] Revisão local de whitespace sem apontamentos.
- [x] Código e documentação sincronizados com a branch remota `feat/t14-12-validacao-integridade`.
- [x] Pull request integrado à `main` (merge confirmado pelo usuário).

## 9. Etapa seguinte

A **T14-12-03 — validação de integridade referencial** foi implementada e integrada à `main` pelo PR #28. Seu contrato, implementação, testes e limites estão registrados em [T14-12-03 — integridade referencial](T14-12-03-integridade-referencial.md).

A separação de responsabilidades permanece:

1. validade estrutural de cada registro;
2. existência e coerência das referências entre registros;
3. regras de negócio e efeitos transacionais.

A T14 continua em andamento até a conclusão das demais entregas previstas no roadmap.

---

**Nota de rastreabilidade:** a T14-12-02 foi integrada à `main` pelo PR #27. A etapa seguinte, T14-12-03 — validação de integridade referencial, também foi integrada à `main` pelo PR #28. Os registros de implementação, verificações e limites estão nos respectivos documentos desta pasta.
