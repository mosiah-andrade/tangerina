import Link from "next/link";
import { FiArrowLeft, FiCompass } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="not-found-title">
        <div className="summary-icon"><FiCompass size={22} aria-hidden="true" /></div>
        <div className="welcome-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Caminho não encontrado</p>
          <h1 id="not-found-title">Vamos voltar ao <em>caminho.</em></h1>
          <p className="welcome-description">
            Essa página não existe ou ainda não faz parte do Tangerina Financeiro.
          </p>
        </div>
        <div className="welcome-actions">
          <Link className="button-primary" href="/dashboard">
            <FiArrowLeft aria-hidden="true" size={18} /> Voltar ao início
          </Link>
        </div>
      </section>
      <footer className="welcome-footer">TANGERINA FINANCEIRO <span>•</span> CLAREZA PARA FLORESCER</footer>
    </main>
  );
}
