import Link from "next/link";
import { notFound } from "next/navigation";

const sections: Record<string, { title: string; description: string }> = {
  receitas: { title: "Receitas", description: "O registro e a distribuição de receitas serão implementados na próxima etapa." },
  despesas: { title: "Despesas", description: "O registro de despesas, a seleção de caixinhas e a revisão antes de confirmar serão implementados na próxima etapa." },
  transferencias: { title: "Transferências", description: "A movimentação entre contas e a revisão de seus efeitos serão implementadas na próxima etapa." },
  movimentacoes: { title: "Movimentações", description: "O histórico financeiro será conectado aos dados locais nas próximas etapas." },
  caixinhas: { title: "Caixinhas", description: "A gestão de caixinhas e seus saldos será implementada nas próximas etapas." },
  mais: { title: "Mais opções", description: "Contas, regras de distribuição, backup e configurações serão adicionados gradualmente." },
};

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = sections[section];
  if (!item) notFound();

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link className="brand-lockup" href="/dashboard">
          <span className="brand-flower" aria-hidden="true">✳</span>
          <span className="brand-name">Tangerina</span>
        </Link>
        <Link className="context-label" href="/dashboard">Voltar ao início</Link>
      </header>
      <section className="dashboard-greeting">
        <p>Em construção</p>
        <h1>{item.title}</h1>
      </section>
      <section className="notice-card">
        <strong>Esta etapa ainda não está implementada.</strong>
        <p>{item.description}</p>
      </section>
      <Link className="button-primary" style={{ marginTop: 22 }} href="/dashboard">
        Voltar ao painel <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
