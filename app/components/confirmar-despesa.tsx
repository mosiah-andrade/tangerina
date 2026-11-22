"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import { calcularSaldoCaixinhaPorAlocacoes } from "@/lib/persistence/caixinhas/saldo";
import { confirmarDespesa } from "@/lib/persistence/despesas/confirmar-despesa";
import type { DespesaRascunho } from "@/components/registrar-despesa";

const KEY = "tangerina.despesa.rascunho";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function dataLegivel(valor: string) {
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

function ehRascunhoDespesa(
  valor: unknown,
): valor is Omit<DespesaRascunho, "idempotencyKey"> & {
  idempotencyKey?: string;
} {
  if (typeof valor !== "object" || valor === null) return false;

  const item = valor as Record<string, unknown>;
  return (
    typeof item.descricao === "string" &&
    item.descricao.trim().length > 0 &&
    typeof item.categoria === "string" &&
    item.categoria.trim().length > 0 &&
    typeof item.valorCentavos === "number" &&
    Number.isSafeInteger(item.valorCentavos) &&
    item.valorCentavos > 0 &&
    typeof item.dataMovimento === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.dataMovimento) &&
    typeof item.contaOrigemId === "string" &&
    item.contaOrigemId.length > 0 &&
    (item.caixinhaId === undefined ||
      (typeof item.caixinhaId === "string" && item.caixinhaId.length > 0)) &&
    (item.idempotencyKey === undefined ||
      typeof item.idempotencyKey === "string")
  );
}

export function ConfirmarDespesa() {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<DespesaRascunho | null>(null);
  const [contaNome, setContaNome] = useState("");
  const [caixinhaNome, setCaixinhaNome] = useState("");
  const [saldoCaixinhaAtual, setSaldoCaixinhaAtual] = useState<number | null>(
    null,
  );
  const [caixinhaFicaraNegativa, setCaixinhaFicaraNegativa] = useState(false);
  const [confirmouCaixinhaNegativa, setConfirmouCaixinhaNegativa] =
    useState(false);
  const [carregandoOrigem, setCarregandoOrigem] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    let ativo = true;
    const salvo = sessionStorage.getItem(KEY);

    if (!salvo) {
      router.replace("/despesas");
      return () => {
        ativo = false;
      };
    }

    try {
      const parsed: unknown = JSON.parse(salvo);
      if (!ehRascunhoDespesa(parsed)) {
        throw new Error("Rascunho inválido.");
      }

      const rascunhoValidado: DespesaRascunho = {
        ...parsed,
        idempotencyKey:
          parsed.idempotencyKey?.trim() || crypto.randomUUID(),
      };

      sessionStorage.setItem(KEY, JSON.stringify(rascunhoValidado));
      setRascunho(rascunhoValidado);

      void (async () => {
        try {
          const db = getDatabase();
          await db.open();

          const [conta, caixinha] = await Promise.all([
            db.contas.get(rascunhoValidado.contaOrigemId),
            rascunhoValidado.caixinhaId
              ? db.caixinhas.get(rascunhoValidado.caixinhaId)
              : Promise.resolve(undefined),
          ]);

          if (!ativo) return;

          setContaNome(
            conta
              ? `${conta.nome} — ${conta.tipo === "carteira_fisica" ? "Carteira física" : "Conta bancária"}`
              : "Origem indisponível",
          );

          if (rascunhoValidado.caixinhaId && caixinha) {
            const alocacoes = await db.alocacoes
              .where("caixinhaId")
              .equals(caixinha.id)
              .toArray();

            if (!ativo) return;

            const saldoAtual = calcularSaldoCaixinhaPorAlocacoes(
              caixinha,
              alocacoes,
            );
            setCaixinhaNome(caixinha.nome);
            setSaldoCaixinhaAtual(saldoAtual);
            setCaixinhaFicaraNegativa(
              saldoAtual - rascunhoValidado.valorCentavos < 0,
            );
          } else {
            setCaixinhaNome("Não alocado");
          }
        } catch {
          if (ativo) {
            setErro("Não foi possível carregar os dados da origem do pagamento.");
          }
        } finally {
          if (ativo) setCarregandoOrigem(false);
        }
      })();
    } catch {
      sessionStorage.removeItem(KEY);
      router.replace("/despesas");
    }

    return () => {
      ativo = false;
    };
  }, [router]);

  async function confirmar() {
    if (!rascunho || salvando || carregandoOrigem) return;
    if (caixinhaFicaraNegativa && !confirmouCaixinhaNegativa) return;

    setSalvando(true);
    setErro(null);

    try {
      const rascunhoComChave: DespesaRascunho = {
        ...rascunho,
        idempotencyKey:
          rascunho.idempotencyKey || crypto.randomUUID(),
      };

      sessionStorage.setItem(KEY, JSON.stringify(rascunhoComChave));
      setRascunho(rascunhoComChave);

      await confirmarDespesa(getDatabase(), {
        ...rascunhoComChave,
        confirmarCaixinhaNegativa:
          caixinhaFicaraNegativa && confirmouCaixinhaNegativa,
      });

      sessionStorage.removeItem(KEY);
      setSucesso(true);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível confirmar a despesa.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (!rascunho) {
    return (
      <main className="app-shell receita-page">
        <p className="receita-loading">Carregando confirmação…</p>
      </main>
    );
  }

  return (
    <>
      <main className="app-shell receita-page revisao-page">
        <header className="receita-header">
          <Link
            className="receita-back"
            href="/despesas"
            aria-label="Voltar para a despesa"
          >
            <FiArrowLeft />
          </Link>
          <div>
            <p className="receita-eyebrow">CONFIRMAÇÃO</p>
            <h1>
              Confirmar <em>despesa</em>
            </h1>
          </div>
        </header>

        {sucesso ? (
          <section className="revisao-main">
            <div className="revisao-empty">
              <FiCheckCircle />
              <div>
                <h2>Despesa confirmada</h2>
                <p>A saída foi registrada com sucesso.</p>
                <button
                  className="button-primary receita-submit"
                  onClick={() => router.push("/dashboard")}
                >
                  Ir para o início
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="revisao-layout">
            <section className="revisao-main">
              <article className="revisao-receita-card">
                <span>DESPESA</span>
                <strong>{rascunho.descricao}</strong>
                <b>{money(rascunho.valorCentavos)}</b>
              </article>

              <section className="revisao-lista">
                <div className="revisao-section-head">
                  <div>
                    <p>CONFERÊNCIA FINAL</p>
                    <h2>Origem da despesa</h2>
                  </div>
                  <FiCheckCircle />
                </div>
                <div className="revisao-linha">
                  <span>
                    <strong>Categoria</strong>
                    <small>{rascunho.categoria}</small>
                  </span>
                </div>
                <div className="revisao-linha">
                  <span>
                    <strong>Origem do pagamento</strong>
                    <small>{contaNome || "Carregando…"}</small>
                  </span>
                </div>
                <div className="revisao-linha">
                  <span>
                    <strong>Caixinha</strong>
                    <small>{caixinhaNome || "Carregando…"}</small>
                  </span>
                </div>
                <div className="revisao-linha">
                  <span>
                    <strong>Data</strong>
                    <small>{dataLegivel(rascunho.dataMovimento)}</small>
                  </span>
                </div>
              </section>

              {caixinhaFicaraNegativa ? (
                <section className="modal-form-error" role="alert">
                  <p>
                    <strong>Atenção: a caixinha ficará negativa.</strong>
                  </p>
                  <p>
                    Saldo atual: {money(saldoCaixinhaAtual ?? 0)}. Saldo após a
                    despesa:{" "}
                    {money(
                      (saldoCaixinhaAtual ?? 0) - rascunho.valorCentavos,
                    )}
                    .
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      checked={confirmouCaixinhaNegativa}
                      onChange={(event) =>
                        setConfirmouCaixinhaNegativa(event.target.checked)
                      }
                    />{" "}
                    Confirmo que desejo registrar a despesa mesmo deixando a
                    caixinha negativa.
                  </label>
                </section>
              ) : null}
            </section>

            <aside className="revisao-resumo">
              <p>CONFIRMAÇÃO</p>
              <div>
                <span>Despesa</span>
                <strong>{money(rascunho.valorCentavos)}</strong>
              </div>
              {erro ? (
                <p className="modal-form-error" role="alert">
                  <FiAlertCircle /> {erro}
                </p>
              ) : null}
              <button
                className="button-primary receita-submit"
                disabled={
                  salvando ||
                  carregandoOrigem ||
                  (caixinhaFicaraNegativa && !confirmouCaixinhaNegativa)
                }
                onClick={confirmar}
              >
                {salvando
                  ? "Confirmando…"
                  : carregandoOrigem
                    ? "Carregando origem…"
                    : "Confirmar e registrar"}
              </button>
              <p className="revisao-note">
                Ao confirmar, a operação será gravada no dispositivo.
              </p>
            </aside>
          </div>
        )}
      </main>
      <BottomNavigation active="/movimentacoes" />
    </>
  );
}
