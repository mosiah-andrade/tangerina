"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPlus, FiX } from "react-icons/fi";
import { AppBrand } from "@/components/app-brand";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import {
  criarRegraDistribuicao,
  listarRegrasDistribuicao,
} from "@/lib/persistence/distribuicao/regras";
import { parseMoneyToCents } from "@/domain/finance/money";
import type { RegraDistribuicao, TipoCalculoDistribuicao } from "@/lib/persistence/entities";

type FormState = {
  nome: string;
  caixinhaId: string;
  tipoCalculo: TipoCalculoDistribuicao;
  valor: string;
};

const initialForm: FormState = {
  nome: "",
  caixinhaId: "",
  tipoCalculo: "valor_fixo",
  valor: "0,00",
};

export default function RegrasDistribuicaoPage() {
  const [regras, setRegras] = useState<RegraDistribuicao[]>([]);
  const [caixinhas, setCaixinhas] = useState<{ id: string; nome: string }[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    const db = getDatabase();
    const [listaRegras, listaCaixinhas] = await Promise.all([
      listarRegrasDistribuicao(db),
      db.caixinhas.toArray(),
    ]);
    setRegras(listaRegras);
    setCaixinhas(listaCaixinhas.filter((caixinha) => caixinha.ativa).map(({ id, nome }) => ({ id, nome })));
  }

  useEffect(() => {
    carregar().catch((error: unknown) =>
      setErro(error instanceof Error ? error.message : "Não foi possível carregar as regras."),
    );
  }, []);

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    try {
      if (!form.nome.trim() || !form.caixinhaId) {
        throw new Error("Informe um nome e selecione uma caixinha.");
      }

      const db = getDatabase();
      const ordem = regras.length ? Math.max(...regras.map((regra) => regra.ordem)) + 1 : 1;

      if (form.tipoCalculo === "valor_fixo") {
        await criarRegraDistribuicao(db, {
          nome: form.nome,
          caixinhaId: form.caixinhaId,
          ordem,
          tipoCalculo: form.tipoCalculo,
          valorFixoCentavos: parseMoneyToCents(form.valor),
        });
      } else {
        const percentual = Number(form.valor.replace(",", "."));
        if (!Number.isFinite(percentual) || percentual <= 0 || percentual > 100) {
          throw new Error("Informe um percentual entre 0 e 100.");
        }

        await criarRegraDistribuicao(db, {
          nome: form.nome,
          caixinhaId: form.caixinhaId,
          ordem,
          tipoCalculo: form.tipoCalculo,
          percentual: Math.round(percentual * 100),
        });
      }

      setForm(initialForm);
      setAberto(false);
      await carregar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível salvar a regra.");
    }
  }

  return (
    <>
      <main className="app-shell regras-page">
        <header className="app-header">
          <AppBrand />
          <Link className="context-label" href="/mais">
            Voltar
          </Link>
        </header>

        <section className="dashboard-greeting">
          <p>RECEITAS AUTOMÁTICAS</p>
          <h1>Regras de <em>distribuição</em></h1>
          <span>Defina como cada receita será organizada nas suas caixinhas.</span>
        </section>

        <section className="regras-toolbar">
          <div>
            <strong>{regras.length} {regras.length === 1 ? "regra" : "regras"} cadastradas</strong>
            <small>A ordem será usada na distribuição da receita.</small>
          </div>
          <button className="button-primary" type="button" onClick={() => setAberto(true)}>
            <FiPlus aria-hidden="true" /> Nova regra
          </button>
        </section>

        {erro && <p className="form-error">{erro}</p>}

        <section className="regras-lista">
          {regras.length === 0 ? (
            <div className="empty-state">
              <strong>Nenhuma regra cadastrada.</strong>
              <p>Crie uma regra para começar a distribuir suas receitas.</p>
            </div>
          ) : (
            regras.map((regra) => {
              const caixinha = caixinhas.find((item) => item.id === regra.caixinhaId);
              const detalhe =
                regra.tipoCalculo === "valor_fixo"
                  ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(regra.valorFixoCentavos / 100)
                  : `${(regra.percentual / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

              const base =
                regra.tipoCalculo === "valor_fixo"
                  ? "Valor fixo"
                  : regra.tipoCalculo === "percentual_receita_bruta"
                    ? "% da receita bruta"
                    : "% do saldo restante";

              return (
                <article className="regra-card" key={regra.id}>
                  <span className="regra-order">{regra.ordem}</span>
                  <div>
                    <strong>{regra.nome}</strong>
                    <small>{caixinha?.nome ?? "Caixinha indisponível"} · {base}</small>
                  </div>
                  <b>{detalhe}</b>
                </article>
              );
            })
          )}
        </section>
      </main>

      {aberto && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal-card regras-form" onSubmit={salvar}>
            <button className="modal-close" type="button" onClick={() => setAberto(false)} aria-label="Fechar">
              <FiX />
            </button>
            <p className="modal-eyebrow">NOVA REGRA</p>
            <h2>Como distribuir?</h2>

            <label>Nome<input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} placeholder="Ex.: Reserva mensal" /></label>
            <label>Caixinha<select value={form.caixinhaId} onChange={(event) => setForm({ ...form, caixinhaId: event.target.value })}><option value="">Selecione</option>{caixinhas.map((caixinha) => <option key={caixinha.id} value={caixinha.id}>{caixinha.nome}</option>)}</select></label>
            <label>Tipo<select value={form.tipoCalculo} onChange={(event) => setForm({ ...form, tipoCalculo: event.target.value as TipoCalculoDistribuicao, valor: event.target.value === "valor_fixo" ? "0,00" : "0" })}><option value="valor_fixo">Valor fixo</option><option value="percentual_receita_bruta">% da receita bruta</option><option value="percentual_saldo_restante">% do saldo restante</option></select></label>
            <label>{form.tipoCalculo === "valor_fixo" ? "Valor" : "Percentual"}<input value={form.valor} onChange={(event) => setForm({ ...form, valor: event.target.value })} inputMode="decimal" placeholder={form.tipoCalculo === "valor_fixo" ? "0,00" : "0"} /></label>
            <button className="button-primary" type="submit">Salvar regra</button>
          </form>
        </div>
      )}

      <BottomNavigation active="/mais" />
    </>
  );
}
