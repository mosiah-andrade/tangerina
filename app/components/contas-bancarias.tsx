"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCreditCard,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SeedLoading } from "@/components/seed-loading";
import { formatMoneyFromCents } from "@/lib/format-money";
import { getDatabase } from "@/lib/persistence/database";
import {
  listarContasComSaldo,
  type ContaComSaldo,
} from "@/lib/persistence/contas/listar";

export function ContasBancarias() {
  const [contas, setContas] = useState<ContaComSaldo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [recarregando, setRecarregando] = useState(false);

  const carregarContas = useCallback(async (manual = false) => {
    if (manual) setRecarregando(true);

    setErro(null);

    try {
      const db = getDatabase();
      await db.open();
      setContas(await listarContasComSaldo(db));
    } catch {
      setErro(
        "Não foi possível acessar suas contas neste dispositivo. Tente novamente.",
      );
    } finally {
      if (manual) setRecarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarContas();
  }, [carregarContas]);

  const saldoTotalCentavos = useMemo(
    () =>
      contas
        ?.filter(({ conta }) => conta.ativa)
        .reduce(
          (total, { saldoAtualCentavos }) => total + saldoAtualCentavos,
          0,
        ) ?? 0,
    [contas],
  );

  return (
    <>
      <main className="app-shell contas-page">
        <header className="app-header">
          <Link
            className="contas-back"
            href="/dashboard"
            aria-label="Voltar ao início"
          >
            <FiArrowLeft aria-hidden="true" size={18} />
          </Link>
          <AppBrand />
          <span className="contas-header-space" aria-hidden="true" />
        </header>

        <section className="dashboard-greeting contas-intro">
          <p>SEU DINHEIRO</p>
          <h1>
            Contas <em>bancárias</em>
          </h1>
          <span>Onde seu dinheiro está guardado.</span>
        </section>

        {!erro && contas === null && (
          <section className="contas-state" aria-live="polite">
            <SeedLoading label="Carregando suas contas" />
          </section>
        )}

        {erro && (
          <section className="contas-error" role="alert">
            <span className="contas-error__icon" aria-hidden="true">
              <FiCreditCard size={20} />
            </span>
            <div>
              <strong>Não conseguimos carregar as contas.</strong>
              <p>{erro}</p>
            </div>
            <button
              className="button-secondary contas-retry"
              type="button"
              onClick={() => void carregarContas(true)}
              disabled={recarregando}
            >
              <FiRefreshCw
                aria-hidden="true"
                className={recarregando ? "contas-retry__icon" : undefined}
              />
              {recarregando ? "Tentando..." : "Tentar novamente"}
            </button>
          </section>
        )}

        {contas !== null && !erro && (
          <>
            <section className="balance-card contas-total" aria-label="Saldo total em contas">
              <div className="balance-topline">
                <p className="balance-label">Saldo total em contas</p>
                <FiCreditCard className="balance-eye" aria-hidden="true" />
              </div>
              <strong className="balance-value">
                {formatMoneyFromCents(saldoTotalCentavos)}
              </strong>
              <p className="balance-caption">
                Soma das contas bancárias ativas.
              </p>
              <div className="balance-divider" />
              <div className="balance-foot">
                <span className="balance-dot" />
                <span>
                  {contas.filter(({ conta }) => conta.ativa).length}{" "}
                  {contas.filter(({ conta }) => conta.ativa).length === 1
                    ? "conta ativa"
                    : "contas ativas"}
                </span>
              </div>
            </section>

            <div className="contas-section-heading">
              <h2>Suas contas</h2>
              <span>{contas.length}</span>
            </div>

            {contas.length === 0 ? (
              <section className="contas-empty">
                <span className="contas-empty__icon" aria-hidden="true">
                  <FiCreditCard size={22} />
                </span>
                <strong>Você ainda não cadastrou uma conta.</strong>
                <p>
                  Adicione uma conta bancária para acompanhar seu saldo real
                  em um só lugar.
                </p>
              </section>
            ) : (
              <section className="contas-lista" aria-label="Contas bancárias">
                {contas.map(({ conta, saldoAtualCentavos }) => (
                  <article className="conta-card" key={conta.id}>
                    <span className="conta-card__icon" aria-hidden="true">
                      <FiCreditCard size={19} />
                    </span>
                    <div className="conta-card__content">
                      <p>{conta.instituicao ?? "Conta bancária"}</p>
                      <strong>{conta.nome}</strong>
                      <span>
                        {formatMoneyFromCents(saldoAtualCentavos)}
                      </span>
                    </div>
                    <span
                      className={
                        conta.ativa
                          ? "conta-status"
                          : "conta-status conta-status--inactive"
                      }
                    >
                      {conta.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </article>
                ))}
              </section>
            )}
          </>
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
