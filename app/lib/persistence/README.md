# Persistência local

Esta camada é responsável pelo acesso aos dados armazenados no dispositivo.

## Diretrizes aprovadas

- IndexedDB com Dexie.js, conforme ADR-001.
- Esquema versionado e migrações explícitas.
- Contratos TypeScript específicos para cada tabela, alinhados a T5 e T12.
- Repositórios para leitura e gravação, sem cálculos financeiros escondidos.
- Transações para operações que precisam ser atômicas.
- Tratamento explícito de falhas, dados ausentes e dados incompatíveis.

## Estrutura atual

- `database.ts`: classe Dexie, declaração das 12 tabelas, índices, versão e instância compartilhada.
- `entities.ts`: tipos dos registros persistidos, enums aprovados e mapa entre tabelas e entidades.
- `repositories/`: reservado para os repositórios tipados das entidades.
- `errors.ts` e `transactions.ts`: reservados para erros padronizados e operações atômicas.

Os tipos TypeScript descrevem contratos em tempo de compilação. Eles não substituem validações de dados em tempo de execução, verificações de referências ou regras financeiras do domínio.

A frequência de recorrência permanece como texto no contrato persistido até que o catálogo definitivo seja confirmado contra T3. A relação operacional entre `Alocacao` e `EfeitoSaldo` também permanece pendente de detalhamento, conforme a especificação da T14.

## Limites desta etapa

A tipagem das tabelas não significa que CRUD, validação estrutural, integridade referencial, migrações futuras, transações de negócio ou backup/restauração estejam implementados.
