import Link from "next/link";
import { FiHome, FiList, FiTarget, FiGrid } from "react-icons/fi";

const items = [
  { href: "/dashboard", label: "Início", Icon: FiHome },
  { href: "/movimentacoes", label: "Movimentos", Icon: FiList },
  { href: "/caixinhas", label: "Caixinhas", Icon: FiTarget },
  { href: "/mais", label: "Mais", Icon: FiGrid },
];

type BottomNavigationProps = { active?: string };

export function BottomNavigation({ active = "/dashboard" }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <div className="bottom-nav-inner">
        {items.map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={active === href ? "page" : undefined}>
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
