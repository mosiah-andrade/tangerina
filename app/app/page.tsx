import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiShield } from "react-icons/fi";

export default function Home() {
  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <header className="welcome-brand" aria-label="Tangerina Financeiro">
          <Image
            src="/favicon.svg"
            alt=""
            width={56}
            height={56}
            priority
            className="welcome-brand__icon"
            unoptimized
          />
          <span className="welcome-brand__name">Tangerina</span>
        </header>
        <div className="welcome-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Organização que floresce</p>
          <h1 id="welcome-title">Suas finanças <em>mais organizadas.</em></h1>
          <p className="welcome-description">
            Um jeito mais sereno e elegante de acompanhar seu dinheiro, cuidar dos seus objetivos e decidir com clareza.
          </p>
        </div>
        <div className="welcome-actions">
          <Link className="button-primary" href="/dashboard">Começar <FiArrowRight aria-hidden="true" size={19} /></Link>
          <p className="privacy-note"><FiShield aria-hidden="true" size={16} /> Seus dados financeiros ficam neste dispositivo.</p>
        </div>
      </section>
      <footer className="welcome-footer">TANGERINA FINANCEIRO <span>•</span> CLAREZA PARA FLORESCER</footer>
    </main>
  );
}
