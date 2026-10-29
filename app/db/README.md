# Persistência local

Responsabilidade: encapsular esquema, consultas, transações e migrações do armazenamento local.

A tecnologia aprovada é IndexedDB com Dexie.js, conforme ADR-001, mas sua implementação pertence à tarefa específica de persistência.

Convenções:
- Não acessar o banco diretamente a partir de componentes visuais.
- Agrupar efeitos financeiros relacionados em transações atômicas.
- Versionar o esquema e planejar migrações.
- Preparar operações para backup/restauração futura sem presumir que essa funcionalidade já existe.

Nenhum banco é inicializado por este arquivo de documentação.
