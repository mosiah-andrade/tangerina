# Domínio financeiro

Responsabilidade: regras, validações e cálculos do Tangerina Financeiro, independentes da interface e do navegador.

Convenções:
- Representar valores monetários em centavos inteiros.
- Preferir funções determinísticas e testáveis.
- Não importar componentes React nem acessar diretamente IndexedDB/localStorage.
- Respeitar as regras aprovadas em T2 e os critérios T3.
- Transferências devem produzir efeitos equivalentes de débito e crédito sem serem classificadas como receita ou despesa.

Implementações de domínio serão adicionadas nas tarefas correspondentes; este arquivo documenta a fronteira da camada, não funcionalidades existentes.
