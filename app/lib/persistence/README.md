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
- `repositories/`: repositórios tipados com busca por ID, listagem, inserção, atualização parcial e arquivamento quando a entidade possui `ativa`.
- `validation/persistence.ts`: mapa central de validadores estruturais e integração com a verificação de referências antes das gravações.
- `errors.ts` e `transactions.ts`: reservados para erros padronizados e operações atômicas.

Os tipos TypeScript descrevem contratos em tempo de compilação. Eles não substituem validações de dados em tempo de execução, verificações de referências ou regras financeiras do domínio.

A frequência de recorrência permanece como texto no contrato persistido até que o catálogo definitivo seja confirmado contra T3. A relação operacional entre `Alocacao` e `EfeitoSaldo` também permanece pendente de detalhamento, conforme a especificação da T14.

Os repositórios recebem uma instância `TangerinaDatabase` explicitamente, o que facilita testes isolados e evita abrir o IndexedDB implicitamente dentro dos módulos. A abertura do banco continua sob responsabilidade de `getDatabase()` no contexto de navegador.

## Limites desta etapa

A T14-11 implementa operações CRUD básicas tipadas para os agregados documentados. A T14-13 integra validação estrutural e referencial às operações de inserção, atualização e arquivamento dos oito repositórios existentes. A remoção física não é exposta: registros financeiros e históricos devem ser cancelados, revertidos ou arquivados conforme o domínio. Transações de negócio, migrações futuras e backup/restauração permanecem fora desta entrega.
