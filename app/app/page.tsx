import Link from "next/link";

export default function Home() {
  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="brand-lockup" aria-label="Tangerina Financeiro">
          <span className="brand-flower" aria-hidden="true">✳</span>
          <span className="brand-name">Tangerina</span>
        </div>
        <div className="welcome-copy">
          <p className="eyebrow">Sua vida financeira, com clareza</p>
          <h1 id="welcome-title">Suas finanças mais organizadas.</h1>
          <p className="welcome-description">
            Organize seu dinheiro, acompanhe suas caixinhas e tenha mais clareza
            para decidir o que fazer com cada valor.
          </p>
        </div>
        <div className="welcome-actions">
          <Link className="button-primary" href="/dashboard">Começar <span aria-hidden="true">→</span></Link>
          <p className="privacy-note"><span aria-hidden="true">◈</span> Seus dados financeiros ficam neste dispositivo.</p>
        </div>
      </section>
      <footer className="welcome-footer">Tangerina Financeiro <span>•</span> Organização que floresce.</footer>
    </main>
  );
}
