import Link from "next/link";
import { FiArrowDownLeft, FiArrowUpRight, FiChevronDown, FiTarget, FiGrid, FiEye, FiPlus } from "react-icons/fi";
import { LuArrowLeftRight, LuCalendarDays, LuArrowRight } from "react-icons/lu";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { formatMoneyFromCents } from "@/lib/format-money";

export default function DashboardPage() {
  // Valores de demonstração do protótipo; ainda não são dados persistidos.
  const total = 425000;
  const caixinhas = 210000;
  const naoAlocado = total - caixinhas;

  return (
    <>
      <main className="app-shell">
        <header className="app-header">
          <AppBrand />
          <button className="profile-switch" type="button" aria-label="Contexto pessoal">
            Pessoal <FiChevronDown size={14} aria-hidden="true" />
          </button>
        </header>

        <section className="dashboard-greeting">
          <p>SEU ESPAÇO FINANCEIRO</p>
          <h1>Bom dia, <em>vamos florescer?</em></h1>
        </section>

        <section className="balance-card" aria-labelledby="balance-title">
          <div className="balance-topline">
            <p className="balance-label" id="balance-title">Patrimônio acompanhado</p>
            <span className="balance-eye" aria-hidden="true"><FiEye size={17} /></span>
          </div>
          <p className="balance-value">{formatMoneyFromCents(total)}</p>
          <p className="balance-caption">Saldo total · valores ilustrativos</p>
          <div className="balance-divider" />
          <div className="balance-foot"><span>Visão pessoal</span><span className="balance-dot" /> <span>Atualizado nesta demonstração</span></div>
        </section>

        <div className="section-title"><span>Seu dinheiro em foco</span><span className="section-kicker">VISÃO GERAL</span></div>
        <section className="summary-grid" aria-label="Resumo financeiro">
          <article className="summary-card">
            <div className="summary-icon"><FiTarget size={18} /></div>
            <p>Em caixinhas</p>
            <strong>{formatMoneyFromCents(caixinhas)}</strong>
            <small>Reservado para seus objetivos</small>
          </article>
          <article className="summary-card">
            <div className="summary-icon gold"><FiGrid size={18} /></div>
            <p>Não alocado</p>
            <strong>{formatMoneyFromCents(naoAlocado)}</strong>
            <small>Disponível para distribuir</small>
          </article>
        </section>

        <div className="section-title"><span>Movimentar dinheiro</span></div>
        <nav className="quick-actions" aria-label="Acesso rápido">
          <Link className="quick-action" href="/receitas"><span className="action-icon"><FiArrowDownLeft size={19} /></span><span>Receita</span></Link>
          <Link className="quick-action" href="/despesas"><span className="action-icon"><FiArrowUpRight size={19} /></span><span>Despesa</span></Link>
          <Link className="quick-action" href="/transferencias"><span className="action-icon"><LuArrowLeftRight size={19} /></span><span>Transferir</span></Link>
        </nav>

        <div className="section-title"><span>Próximos vencimentos</span><Link href="/mais">Ver agenda <LuArrowRight size={13} /></Link></div>
        <section className="upcoming-card">
          <span className="upcoming-icon"><LuCalendarDays size={19} /></span>
          <div><strong>Nenhuma conta cadastrada</strong><p>Seus próximos vencimentos aparecerão aqui.</p></div>
          <span className="upcoming-plus" aria-hidden="true"><FiPlus size={17} /></span>
        </section>
        <p className="demo-note">Demonstração visual: valores e dados ainda não vêm de uma base financeira.</p>
      </main>
      <BottomNavigation active="/dashboard" />
    </>
  );
}
