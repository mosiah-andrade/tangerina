"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiRefreshCw,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SeedLoading } from "@/components/seed-loading";
import { formatMoneyFromCents } from "@/lib/format-money";
import { getDatabase } from "@/lib/persistence/database";
import type { Conta } from "@/lib/persistence/entities";
import { editarContaBancaria } from "@/lib/persistence/contas/editar";

interface EditarContaBancariaProps {
  contaId: string;
}

export function EditarContaBancaria({ contaId }: EditarContaBancariaProps) {
  const router = useRouter();

  const [conta, setConta] = useState<Conta | null>(null);
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [naoEncontrada, setNaoEncontrada] = useState(false);

  const carregarConta = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    setNaoEncontrada(false);

    try {
      const db = getDatabase();
      await db.open();

      const contaEncontrada = await db.contas.get(contaId);

      if (!contaEncontrada || contaEncontrada.tipo !== "bancaria") {
        setNaoEncontrada(true);
        setConta(null);
        return;
      }

      setConta(contaEncontrada);
      setNome(contaEncontrada.nome);
      setInstituicao(contaEncontrada.instituicao ?? "");
    } catch {
      setErro(
        "Não foi possível carregar esta conta neste dispositivo. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }, [contaId]);

  useEffect(() => {
    const promise = Promise.resolve().then(carregarConta);

    return () => {
      void promise;
    };
  }, [carregarConta]);

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nomeNormalizado = nome.trim();
    const instituicaoNormalizada = instituicao.trim();

    if (!nomeNormalizado) {
      setErro("Informe o nome da conta.");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      const db = getDatabase();
      await db.open();

      const atualizada = await editarContaBancaria(db, contaId, {
        nome: nomeNormalizado,
        instituicao:
          instituicaoNormalizada.length > 0 ? instituicaoNormalizada : null,
      });

      if (!atualizada) {
        setNaoEncontrada(true);
        return;
      }

      router.push("/contas");
    } catch {
      setErro(
        "Não foi possível salvar as alterações da conta. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <main className="app-shell editar-conta-page">
        <header className="app-header">
          <Link
            className="contas-back"
            href="/contas"
            aria-label="Voltar para contas bancárias"
          >
            <FiArrowLeft aria-hidden="true" size={18} />
          </Link>
          <AppBrand />
          <span className="contas-header-space" aria-hidden="true" />
        </header>

        <section className="dashboard-greeting editar-conta-intro">
          <p>SUAS CONTAS</p>
          <h1>
            Editar <em>conta</em>
          </h1>
          <span>Atualize as informações cadastrais da sua conta.</span>
        </section>

        {carregando && (
          <section className="contas-state" aria-live="polite">
            <SeedLoading label="Carregando a conta" />
          </section>
        )}

        {!carregando && erro && (
          <section className="contas-error" role="alert">
            <span className="contas-error__icon" aria-hidden="true">
              <FiCreditCard size={20} />
            </span>

            <div>
              <strong>Não conseguimos carregar a conta.</strong>
              <p>{erro}</p>
            </div>

            <button
              className="button-secondary contas-retry"
              type="button"
              onClick={() => void carregarConta()}
              disabled={salvando}
            >
              <FiRefreshCw aria-hidden="true" />
              Tentar novamente
            </button>
          </section>
        )}

        {!carregando && naoEncontrada && (
          <section className="contas-empty">
            <span className="contas-empty__icon" aria-hidden="true">
              <FiCreditCard size={22} />
            </span>
            <strong>Conta não encontrada.</strong>
            <p>
              Esta conta pode ter sido removida ou não estar disponível neste
              dispositivo.
            </p>
            <Link className="button-secondary" href="/contas">
              Voltar para contas
            </Link>
          </section>
        )}

        {!carregando && !erro && !naoEncontrada && conta && (
          <form className="editar-conta-form" onSubmit={salvar}>
            <section className="surface-card editar-conta-card">
              <div className="field-group">
                <label className="field-label" htmlFor="nome">
                  Nome da conta
                </label>
                <input
                  className="text-input"
                  id="nome"
                  name="nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  disabled={salvando}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="instituicao">
                  Instituição
                </label>
                <input
                  className="text-input"
                  id="instituicao"
                  name="instituicao"
                  type="text"
                  value={instituicao}
                  onChange={(event) => setInstituicao(event.target.value)}
                  disabled={salvando}
                  autoComplete="organization"
                  placeholder="Ex.: Banco Tangerina"
                />
                <span className="field-hint">Este campo é opcional.</span>
              </div>
            </section>

            <section className="surface-card editar-conta-info">
              <div className="editar-conta-info__header">
                <FiCreditCard aria-hidden="true" size={18} />
                <div>
                  <strong>Informações financeiras</strong>
                  <span>Estes dados não são alterados nesta edição.</span>
                </div>
              </div>

              <dl className="editar-conta-details">
                <div>
                  <dt>Saldo inicial</dt>
                  <dd>{formatMoneyFromCents(conta.saldoInicialCentavos)}</dd>
                </div>

                <div>
                  <dt>Data do saldo inicial</dt>
                  <dd>
                    {new Intl.DateTimeFormat("pt-BR").format(
                      new Date(`${conta.dataSaldoInicial}T12:00:00`),
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {erro && (
              <p className="field-error editar-conta-submit-error" role="alert">
                {erro}
              </p>
            )}

            <button
              className="button-primary editar-conta-submit"
              type="submit"
              disabled={salvando}
            >
              <FiCheck aria-hidden="true" size={19} />
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        )}
      </main>

      <BottomNavigation active="/mais" />
    </>
  );
}
