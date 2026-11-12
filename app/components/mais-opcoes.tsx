import Link from "next/link";
import {
  FiArchive,
  FiChevronRight,
  FiCreditCard,
  FiDatabase,
  FiSettings,
} from "react-icons/fi";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { DemoDataControls } from "@/components/demo-data-controls";

const opcoes = [
  {
    href: "/contas",
    label: "Contas bancárias",
    description: "Gerencie onde seu dinheiro está guardado.",
    Icon: FiCreditCard,
    disponivel: true,
  },
  {
    href: "/regras-distribuicao",
    label: "Regras de distribuição",
    description: "Organize como suas receitas serão distribuídas.",
    Icon: FiArchive,
    disponivel: true,
  },
  {
    href: "#",
    label: "Backup",
    description: "Proteja e restaure seus dados financeiros.",
    Icon: FiDatabase,
    disponivel: false,
  },
  {
    href: "#",
    label: "Configurações",
    description: "Personalize sua experiência no Tangerina.",
    Icon: FiSettings,
    disponivel: false,
  },
];

export function MaisOpcoes() {
  return (
    <>
      <main className="app-shell mais-page">
        <header className="app-header">
          <AppBrand />
        </header>

        <section className="dashboard-greeting">
          <p>ORGANIZE SEU ESPAÇO</p>
          <h1>
            Mais <em>opções</em>
          </h1>
          <span>Gerencie outros detalhes da sua vida financeira.</span>
        </section>

        <section className="mais-lista" aria-label="Mais opções">
          {opcoes.map(({ href, label, description, Icon, disponivel }) => {
            const content = (
              <>
                <span className="mais-item__icon" aria-hidden="true">
                  <Icon size={19} />
                </span>

                <span className="mais-item__content">
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>

                {disponivel ? (
                  <FiChevronRight
                    className="mais-item__arrow"
                    size={18}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="mais-item__soon">Em breve</span>
                )}
              </>
            );

            return disponivel ? (
              <Link className="mais-item" href={href} key={label}>
                {content}
              </Link>
            ) : (
              <div
                className="mais-item mais-item--disabled"
                key={label}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          })}
        </section>

        <section className="mais-demo-section">
          <DemoDataControls />
        </section>
      </main>

      <BottomNavigation active="/mais" />
    </>
  );
}