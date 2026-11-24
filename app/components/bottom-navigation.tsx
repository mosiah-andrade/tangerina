"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowDownLeft, FiRepeat, FiCreditCard, FiGrid, FiHome,
  FiPlus, FiTrendingUp, FiTrendingDown, FiTarget, FiX,
} from "react-icons/fi";

const items = [
  { href: "/dashboard", label: "Início", Icon: FiHome },
  { href: "/contas", label: "Contas", Icon: FiCreditCard },
  { href: "/caixinhas", label: "Caixinhas", Icon: FiTarget },
  { href: "/mais", label: "Mais", Icon: FiGrid },
];

const registrationOptions = [
  { href: "/receitas", label: "Receita", description: "Registrar uma entrada de dinheiro", Icon: FiTrendingUp, tone: "income" },
  { href: "/despesas", label: "Despesa", description: "Registrar uma saída de dinheiro", Icon: FiTrendingDown, tone: "expense" },
  { href: "/transferencias", label: "Transferência", description: "Mover dinheiro entre contas", Icon: FiRepeat, tone: "transfer" },
];

type BottomNavigationProps = { active?: string };

export function BottomNavigation({ active = "/dashboard" }: BottomNavigationProps) {
  const [registrarAberto, setRegistrarAberto] = useState(false);

  return (
    <nav className="bottom-nav" aria-label="Navegação principal" onKeyDown={(event) => {
      if (event.key === "Escape") setRegistrarAberto(false);
    }}>
      <div className="bottom-nav-inner">
        {items.slice(0, 2).map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={active === href ? "page" : undefined}>
            <span className="bottom-nav-icon"><Icon size={19} aria-hidden="true" /></span><span>{label}</span>
          </Link>
        ))}
        <button type="button" className="bottom-nav-primary-action" aria-label="Registrar movimentação"
          aria-expanded={registrarAberto} aria-controls="bottom-nav-register-menu"
          onClick={() => setRegistrarAberto((aberto) => !aberto)}>
          <span className="bottom-nav-icon">{registrarAberto ? <FiX size={23} aria-hidden="true" /> : <FiPlus size={23} aria-hidden="true" />}</span>
          <span>Registrar</span>
        </button>
      {registrarAberto ? (
          <div className="bottom-nav-register-menu" id="bottom-nav-register-menu" aria-label="Escolha o que deseja registrar">
            <div className="bottom-nav-register-heading">
              <div><span>NOVA MOVIMENTAÇÃO</span><strong>O que deseja registrar?</strong></div>
              <button type="button" onClick={() => setRegistrarAberto(false)} aria-label="Fechar opções de registro"><FiX size={18} /></button>
            </div>
            <div className="bottom-nav-register-options">
              {registrationOptions.map(({ href, label, description, Icon, tone }) => (
                <Link key={href} href={href} className={`bottom-nav-register-option is-${tone}`} onClick={() => setRegistrarAberto(false)}>
                  <span className="bottom-nav-register-option-icon"><Icon size={20} aria-hidden="true" /></span>
                  <span className="bottom-nav-register-option-copy"><strong>{label}</strong><small>{description}</small></span>
                  <FiArrowDownLeft className="bottom-nav-register-option-arrow" size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {items.slice(2).map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={active === href ? "page" : undefined}>
            <span className="bottom-nav-icon"><Icon size={19} aria-hidden="true" /></span><span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
