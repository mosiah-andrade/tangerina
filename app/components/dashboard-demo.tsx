"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiChevronDown,
  FiEye,
  FiGrid,
  FiPlus,
  FiTarget,
} from "react-icons/fi";
import { LuArrowLeftRight, LuArrowRight, LuCalendarDays } from "react-icons/lu";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { formatMoneyFromCents } from "@/lib/format-money";
import { getDatabase } from "@/lib/persistence/database";
import {
  calcularResumoDashboard,
  type ResumoDashboard,
} from "@/lib/persistence/dashboard/resumo";

export function DashboardDemo() {
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);

  useEffect(() => {
    async function carregarResumo() {
      const db = getDatabase();

      await db.open();

      const [contas, caixinhas, efeitosSaldo, alocacoes] = await Promise.all([
        db.contas.toArray(),
        db.caixinhas.toArray(),
        db.efeitosSaldo.toArray(),
        db.alocacoes.toArray(),
      ]);

      setResumo(
        calcularResumoDashboard({
          contas,
          caixinhas,
          efeitosSaldo,
          alocacoes,
        }),
      );
    }

    void carregarResumo();
  }, []);

  const carregando = resumo === null;

  const total = resumo?.patrimonioCentavos ?? 0;
  const caixinhas = resumo?.emCaixinhasCentavos ?? 0;
  const naoAlocado = resumo?.naoAlocadoCentavos ?? 0;

  return (
    <>
      <main className="app-shell">
        <header className="app-header">
          <AppBrand />

          <button
            className="profile-switch"
            type="button"
            aria-label="Contexto pessoal"
          >
            Pessoal
            <FiChevronDown size={14} aria-hidden="true" />
          </button>
        </header>

        <section className="dashboard-greeting">
          <p>SEU ESPAÇO FINANCEIRO</p>
          <h1>
            Bom dia, <em>vamos florescer?</em>
          </h1>
        </section>

        <section className="balance-card" aria-labelledby="balance-title">
          <div className="balance-topline">
            <p className="balance-label" id="balance-title">
              Patrimônio acompanhado
            </p>

            <span className="balance-eye" aria-hidden="true">
              <FiEye size={17} />
            </span>
          </div>

          <p className="balance-value">{formatMoneyFromCents(total)}</p>

          <p className="balance-caption">
            {carregando
              ? "Carregando seus dados..."
              : "Saldo calculado a partir dos seus dados"}
          </p>

          <div className="balance-divider" />

          <div className="balance-foot">
            <span>Visão pessoal</span>
            <span className="balance-dot" />
            <span>
              {carregando ? "Carregando" : "Atualizado nesta demonstração"}
            </span>
          </div>
        </section>

        <div className="section-title">
          <span>Seu dinheiro em foco</span>
          <span className="section-kicker">VISÃO GERAL</span>
        </div>

        <section className="summary-grid" aria-label="Resumo financeiro">
          <article className="summary-card">
            <div className="summary-icon">
              <FiTarget size={18} />
            </div>

            <p>Em caixinhas</p>
            <strong>{formatMoneyFromCents(caixinhas)}</strong>
            <small>Reservado para seus objetivos</small>
          </article>

          <article className="summary-card">
            <div className="summary-icon gold">
              <FiGrid size={18} />
            </div>

            <p>Não alocado</p>
            <strong>{formatMoneyFromCents(naoAlocado)}</strong>
            <small>Disponível para distribuir</small>
          </article>
        </section>

        <div className="section-title">
          <span>Movimentar dinheiro</span>
        </div>

        <nav className="quick-actions" aria-label="Acesso rápido">
          <Link className="quick-action" href="/receitas">
            <span className="action-icon">
              <FiArrowDownLeft size={19} />
            </span>
            <span>Receita</span>
          </Link>

          <Link className="quick-action" href="/despesas">
            <span className="action-icon">
              <FiArrowUpRight size={19} />
            </span>
            <span>Despesa</span>
          </Link>

          <Link className="quick-action" href="/transferencias">
            <span className="action-icon">
              <LuArrowLeftRight size={19} />
            </span>
            <span>Transferir</span>
          </Link>
        </nav>

        <div className="section-title">
          <span>Próximos vencimentos</span>

          <Link href="/mais">
            Ver agenda
            <LuArrowRight size={13} />
          </Link>
        </div>

        <section className="upcoming-card">
          <span className="upcoming-icon">
            <LuCalendarDays size={19} />
          </span>

          <div>
            <strong>Nenhuma conta cadastrada</strong>
            <p>Seus próximos vencimentos aparecerão aqui.</p>
          </div>

          <span className="upcoming-plus" aria-hidden="true">
            <FiPlus size={17} />
          </span>
        </section>

        <p className="demo-note">
          {carregando
            ? "Carregando dados financeiros..."
            : "Os valores acima são calculados a partir dos dados persistidos."}
        </p>
      </main>

      <BottomNavigation active="/dashboard" />
    </>
  );
}
