import Link from "next/link";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function DashboardPage() {
  // Valores de demonstração do protótipo; ainda não são dados persistidos.
  const total = 425000;
  const caixinhas = 210000;
  const naoAlocado = total - caixinhas;

  return (
    <>
      <main className="app-shell">
        <header className="app-header">
          <div className="brand-lockup">
            <span className="brand-flower" aria-hidden="true">✳</span>
            <span className="brand-name">Tangerina</span>
          </div>
          <span className="context-label">Pessoal⌄</span>
        </header>

        <section className="dashboard-greeting">
          <p>Bom dia!</p>
          <h1>Seu dinheiro, com clareza.</h1>
        </section>

        <section className="balance-card" aria-labelledby="balance-title">
          <p className="balance-label" id="balance-title">Saldo total</p>
          <p className="balance-value">{money.format(total / 100)}</p>
          <p className="balance-caption">Valor ilustrativo · demonstração do protótipo</p>
        </section>

        <div className="section-title"><span>Visão geral</span></div>
        <section className="summary-grid" aria-label="Resumo financeiro">
          <article className="summary-card">
            <p>Em caixinhas</p>
            <strong>{money.format(caixinhas / 100)}</strong>
            <small>Dinheiro reservado para seus objetivos</small>
          </article>
          <article className="summary-card">
            <p>Não alocado</p>
            <strong>{money.format(naoAlocado / 100)}</strong>
            <small>Disponível para distribuir</small>
          </article>
        </section>

        <div className="section-title"><span>Acesso rápido</span></div>
        <nav className="quick-actions" aria-label="Acesso rápido">
          <Link className="quick-action" href="/receitas"><span aria-hidden="true">＋</span>Receita</Link>
          <Link className="quick-action" href="/despesas"><span aria-hidden="true">−</span>Despesa</Link>
          <Link className="quick-action" href="/transferencias"><span aria-hidden="true">⇄</span>Transferir</Link>
        </nav>

        <section className="notice-card">
          <strong>Um passo de cada vez</strong>
          <p>Este painel ainda usa valores ilustrativos. As movimentações e o armazenamento local serão implementados nas próximas tarefas.</p>
        </section>
      </main>
      <nav className="bottom-nav" aria-label="Navegação principal">
        <div className="bottom-nav-inner">
          <Link href="/dashboard" aria-current="page"><span aria-hidden="true">⌂</span>Início</Link>
          <Link href="/movimentacoes"><span aria-hidden="true">↕</span>Movimentos</Link>
          <Link href="/caixinhas"><span aria-hidden="true">▣</span>Caixinhas</Link>
          <Link href="/mais"><span aria-hidden="true">•••</span>Mais</Link>
        </div>
      </nav>
    </>
  );
}
