import Link from "next/link";
import {
  FiHome,
  FiCreditCard,
  FiPlus,
  FiTarget,
  FiGrid,
} from "react-icons/fi";

const items = [
  { href: "/dashboard", label: "Início", Icon: FiHome },
  { href: "/contas", label: "Contas", Icon: FiCreditCard },
  {
    href: "/movimentacoes",
    label: "Registrar",
    Icon: FiPlus,
    primaryAction: true,
  },
  { href: "/caixinhas", label: "Caixinhas", Icon: FiTarget },
  { href: "/mais", label: "Mais", Icon: FiGrid },
];

type BottomNavigationProps = { active?: string };

export function BottomNavigation({ active = "/dashboard" }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <div className="bottom-nav-inner">
        {items.map(({ href, label, Icon, primaryAction }) => (
          <Link
            key={href}
            href={href}
            className={primaryAction ? "bottom-nav-primary-action" : undefined}
            aria-current={active === href ? "page" : undefined}
            aria-label={primaryAction ? "Registrar movimentação" : undefined}
          >
            <span className="bottom-nav-icon">
              <Icon size={primaryAction ? 23 : 19} aria-hidden="true" />
            </span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
