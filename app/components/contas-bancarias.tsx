"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FiCreditCard, FiPlus, FiRefreshCw, FiX } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SeedLoading } from "@/components/seed-loading";
import { formatMoneyFromCents } from "@/lib/format-money";
import { getDatabase } from "@/lib/persistence/database";
import { parseMoneyToCents } from "@/domain/finance/money";
import { criarContaBancaria } from "@/lib/persistence/contas/criar";
import {
  listarContasComSaldo,
  type ContaComSaldo,
} from "@/lib/persistence/contas/listar";

export function ContasBancarias() {
  const [contas, setContas] = useState<ContaComSaldo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [recarregando, setRecarregando] = useState(false);
  const [mostrarNovaConta, setMostrarNovaConta] = useState(false);
  const [nomeNovaConta, setNomeNovaConta] = useState("");
  const [instituicaoNovaConta, setInstituicaoNovaConta] = useState("");
  const [saldoNovaConta, setSaldoNovaConta] = useState("0,00");
  const [salvandoNovaConta, setSalvandoNovaConta] = useState(false);

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
    let ativo = true;

    const carregar = async () => {
      try {
        const db = getDatabase();
        await db.open();

        const contasCarregadas = await listarContasComSaldo(db);

        if (ativo) {
          setContas(contasCarregadas);
        }
      } catch {
        if (ativo) {
          setErro(
            "Não foi possível acessar suas contas neste dispositivo. Tente novamente.",
          );
        }
      }
    };

    void carregar();

    return () => {
      ativo = false;
    };
  }, []);

  async function criarNovaConta(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = nomeNovaConta.trim();
    if (!nome) {
      setErro("Informe o nome da conta.");
      return;
    }

    setSalvandoNovaConta(true);
    setErro(null);

    try {
      const db = getDatabase();
      await db.open();
      await criarContaBancaria(db, {
        nome,
        instituicao: instituicaoNovaConta.trim() || undefined,
        saldoInicialCentavos: parseMoneyToCents(saldoNovaConta.trim()),
        dataSaldoInicial: new Date().toISOString().slice(0, 10),
      });
      setMostrarNovaConta(false);
      setNomeNovaConta("");
      setInstituicaoNovaConta("");
      setSaldoNovaConta("0,00");
      await carregarContas();
    } catch {
      setErro("Não foi possível criar a conta. Confira os dados e tente novamente.");
    } finally {
      setSalvandoNovaConta(false);
    }
  }

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
        <header className="welcome-brand" aria-label="Tangerina Financeiro">
          <Image
            src="/favicon.svg"
            alt=""
            width={56}
            height={56}
            priority
            className="welcome-brand__icon"
            unoptimized
          />
          <span className="welcome-brand__name">Tangerina</span>
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
            <section
              className="balance-card contas-total"
              aria-label="Saldo total em contas"
            >
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
                  Adicione uma conta bancária para acompanhar seu saldo real em
                  um só lugar.
                </p>
              </section>
            ) : (
              <section className="contas-lista" aria-label="Contas bancárias">
                {contas.map(({ conta, saldoAtualCentavos }) => (
                  <Link
                    className="conta-card"
                    href={`/contas/${conta.id}/editar`}
                    key={conta.id}
                    aria-label={`Editar ${conta.nome}`}
                  >
                    <span className="conta-card__icon" aria-hidden="true">
                      <FiCreditCard size={19} />
                    </span>
                    <div className="conta-card__content">
                      <p>{conta.instituicao ?? "Conta bancária"}</p>
                      <strong>{conta.nome}</strong>
                      <span>{formatMoneyFromCents(saldoAtualCentavos)}</span>
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
                  </Link>
                ))}
              </section>
            )}
          </>
        )}

        <button className="button-primary contas-add" type="button" onClick={() => setMostrarNovaConta(true)}>
          <span>Adicionar conta</span>
          <FiPlus size={19} aria-hidden="true" />
        </button>
      </main>

      <BottomNavigation active="/contas" />

      {mostrarNovaConta && (
        <div className="caixinhas-modal-backdrop" role="presentation">
          <section className="caixinhas-modal" role="dialog" aria-modal="true" aria-labelledby="nova-conta-title">
            <button className="caixinhas-modal__close" type="button" onClick={() => setMostrarNovaConta(false)} aria-label="Fechar">
              <FiX />
            </button>
            <p className="caixinhas-modal__eyebrow">SUAS CONTAS</p>
            <h2 id="nova-conta-title">Nova conta</h2>
            <form onSubmit={criarNovaConta}>
              <label className="field-group"><span className="field-label">Nome da conta</span><input className="text-input" value={nomeNovaConta} onChange={(event) => setNomeNovaConta(event.target.value)} placeholder="Ex.: Conta principal" autoFocus required /></label>
              <label className="field-group"><span className="field-label">Instituição <span className="field-hint">(opcional)</span></span><input className="text-input" value={instituicaoNovaConta} onChange={(event) => setInstituicaoNovaConta(event.target.value)} placeholder="Ex.: Nubank" /></label>
              <label className="field-group"><span className="field-label">Saldo inicial</span><input className="text-input" inputMode="decimal" value={saldoNovaConta} onChange={(event) => setSaldoNovaConta(event.target.value)} /><span className="field-hint">Use vírgula para os centavos.</span></label>
              <div className="caixinhas-modal__actions"><button className="button-secondary" type="button" onClick={() => setMostrarNovaConta(false)} disabled={salvandoNovaConta}>Cancelar</button><button className="button-primary" type="submit" disabled={salvandoNovaConta}>{salvandoNovaConta ? "Salvando..." : "Criar conta"}</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
