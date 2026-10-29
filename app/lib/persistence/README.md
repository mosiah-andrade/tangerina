# Persistência local

Esta camada será responsável pelo acesso aos dados persistidos no dispositivo.

## Diretriz aprovada

- IndexedDB com Dexie.js, conforme ADR-001.
- Esquema versionado e migrações explícitas.
- Repositórios para leitura e gravação, sem cálculos financeiros escondidos.
- Transações para operações que precisam ser atômicas.
- Tratamento explícito de falhas, dados ausentes e dados incompatíveis.

O banco, os repositórios e as migrações serão implementados nas tarefas funcionais correspondentes. Este arquivo registra a separação arquitetural, não representa persistência funcional.
