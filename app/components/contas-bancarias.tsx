"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCreditCard, FiPlus } from "react-icons/fi";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { formatMoneyFromCents } from "@/lib/format-money";
import { getDatabase } from "@/lib/persistence/database";
import {
  listarContasComSaldo,
  type ContaComSaldo,
} from "@/lib/persistence/contas/listar";

export function ContasBancarias() {
  const [contas, setContas] = useState<ContaComSaldo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarContas() {
      try {
        const db = getDatabase();
        await db.open();
        setContas(await listarContasComSaldo(db));
      } catch {
        setErro("Não foi possível carregar suas contas agora.");
      }
    }

    void carregarContas();
  }, []);

  return (
    <>
      <main className="app-shell">
        <header className="app-header">
          <AppBrand />
          <Link className="context-label" href="/mais">
            Voltar
          </Link>
        </header>

        <section className="dashboard-greeting">
          <p>SEU DINHEIRO</p>
          <h1>
            Contas <em>bancárias</em>
          </h1>
        </section>

        {erro && (
          <section className="notice-card" role="alert">
            <strong>Não conseguimos carregar as contas.</strong>
            <p>{erro}</p>
          </section>
        )}

        {!erro && contas === null && (
          <section className="contas-loading" aria-live="polite">
            Carregando suas contas...
          </section>
        )}

        {!erro && contas?.length === 0 && (
          <section className="contas-empty">
            <span className="contas-empty__icon" aria-hidden="true">
              <FiCreditCard size={22} />
            </span>
            <strong>Nenhuma conta bancária cadastrada</strong>
            <p>Quando você cadastrar uma conta, o saldo atual aparecerá aqui.</p>
          </section>
        )}

        {contas && contas.length > 0 && (
          <section className="contas-lista" aria-label="Contas bancárias">
            {contas.map(({ conta, saldoAtualCentavos }) => (
              <article className="conta-card" key={conta.id}>
                <div className="conta-card__icon" aria-hidden="true">
                  <FiCreditCard size={19} />
                </div>
                <div className="conta-card__content">
                  <p>{conta.nome}</p>
                  <strong>{formatMoneyFromCents(saldoAtualCentavos)}</strong>
                </div>
                <span className={conta.ativa ? "conta-status" : "conta-status conta-status--inactive"}>
                  {conta.ativa ? "Ativa" : "Inativa"}
                </span>
              </article>
            ))}
          </section>
        )}

        <Link className="button-primary contas-add" href="/mais">
          <span>Adicionar conta</span>
          <FiPlus size={19} aria-hidden="true" />
        </Link>
      </main>

      <BottomNavigation active="/mais" />
    </>
  );
}
