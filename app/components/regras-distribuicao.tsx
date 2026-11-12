"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiPlus } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import {
  atualizarRegraDistribuicao,
  criarRegraDistribuicao,
  listarRegrasDistribuicao,
} from "@/lib/persistence/distribuicao/regras";
import type { Caixinha, RegraDistribuicao, TipoCalculoDistribuicao } from "@/lib/persistence/entities";
import { parseMoneyToCents } from "@/domain/finance/money";
import { formatMoneyFromCents } from "@/lib/format-money";

type FormState = {
  nome: string;
  caixinhaId: string;
  tipoCalculo: TipoCalculoDistribuicao;
  valor: string;
};

const initialForm: FormState = {
  nome: "",
  caixinhaId: "",
  tipoCalculo: "percentual_receita_bruta",
  valor: "",
};

function descricao(regra: RegraDistribuicao) {
  if (regra.tipoCalculo === "valor_fixo") {
    return `Valor fixo: ${formatMoneyFromCents(regra.valorFixoCentavos)}`;
  }

  const percentual = (regra.percentual / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return regra.tipoCalculo === "percentual_receita_bruta"
    ? `${percentual}% da receita bruta`
    : `${percentual}% do saldo restante`;
}

export function RegrasDistribuicao() {
  const [regras, setRegras] = useState<RegraDistribuicao[]>([]);
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const db = getDatabase();
    await db.open();
    const [regrasAtuais, caixinhasAtuais] = await Promise.all([
      listarRegrasDistribuicao(db),
      db.caixinhas.filter((caixinha) => caixinha.ativa).toArray(),
    ]);
    setRegras(regrasAtuais);
    setCaixinhas(caixinhasAtuais);
  }

  useEffect(() => {
    void carregar().catch(() =>
      setErro("Não foi possível carregar as regras de distribuição."),
    );
  }, []);

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (!form.nome.trim() || !form.caixinhaId || !form.valor.trim()) {
      setErro("Preencha todos os campos da regra.");
      return;
    }

    try {
      setSalvando(true);
      const db = getDatabase();
      await db.open();

      const ordem = regras.length
        ? Math.max(...regras.map((regra) => regra.ordem)) + 1
        : 1;

      if (form.tipoCalculo === "valor_fixo") {
        await criarRegraDistribuicao(db, {
          nome: form.nome.trim(),
          caixinhaId: form.caixinhaId,
          ordem,
          tipoCalculo: form.tipoCalculo,
          valorFixoCentavos: parseMoneyToCents(form.valor),
        });
      } else {
        const percentual = Number(form.valor.replace(",", "."));
        if (!Number.isFinite(percentual) || percentual <= 0) {
          setErro("Informe um percentual válido maior que zero.");
          return;
        }

        await criarRegraDistribuicao(db, {
          nome: form.nome.trim(),
          caixinhaId: form.caixinhaId,
          ordem,
          tipoCalculo: form.tipoCalculo,
          percentual: Math.round(percentual * 100),
        });
      }

      setForm(initialForm);
      setMostrarForm(false);
      await carregar();
    } catch {
      setErro("Não foi possível salvar a regra. Confira os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternar(regra: RegraDistribuicao) {
    try {
      const db = getDatabase();
      await db.open();
      await atualizarRegraDistribuicao(db, regra.id, {
        ativa: !regra.ativa,
      });
      await carregar();
    } catch {
      setErro("Não foi possível atualizar a regra.");
    }
  }

  const caixinhaNome = (id: string) =>
    caixinhas.find((caixinha) => caixinha.id === id)?.nome ?? "Caixinha indisponível";

  return (
    <>
      <main className="app-shell caixinhas-page">
        <header className="app-header">
          <Link href="/mais" aria-label="Voltar para mais opções">
            <FiArrowLeft />
          </Link>
        </header>

        <section className="dashboard-greeting caixinhas-intro">
          <p>AUTOMAÇÃO</p>
          <h1>Regras de <em>distribuição</em></h1>
          <span>Defina como novas receitas serão sugeridas para suas caixinhas.</span>
        </section>

        {erro && <p className="caixinhas-error" role="alert">{erro}</p>}

        <div className="caixinhas-section-heading">
          <h2>Suas regras</h2>
          <button className="button-secondary caixinhas-add-small" type="button" onClick={() => setMostrarForm(true)}>
            <FiPlus /> Nova regra
          </button>
        </div>

        {regras.length === 0 ? (
          <section className="caixinhas-empty surface-card">
            <strong>Nenhuma regra criada ainda.</strong>
            <p>Crie uma regra para sugerir automaticamente a distribuição das suas próximas receitas.</p>
          </section>
        ) : (
          <section className="caixinhas-lista caixinhas-bento">
            {regras.map((regra) => (
              <article className={regra.ativa ? "caixinha-card" : "caixinha-card caixinha-card--inactive"} key={regra.id}>
                <div className="caixinha-card__main">
                  <div>
                    <strong>{regra.ordem}. {regra.nome}</strong>
                    <p>{caixinhaNome(regra.caixinhaId)}</p>
                    <span className="caixinha-card__value">{descricao(regra)}</span>
                    <span className={regra.ativa ? "caixinha-card__status" : "caixinha-card__status caixinha-card__status--inactive"}>
                      {regra.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>
                <button className="button-secondary" type="button" onClick={() => void alternar(regra)}>
                  {regra.ativa ? "Desativar" : "Ativar"}
                </button>
              </article>
            ))}
          </section>
        )}

        <button className="button-primary caixinhas-add" type="button" onClick={() => setMostrarForm(true)}>
          <span>Nova regra</span><FiPlus size={19} />
        </button>
      </main>

      {mostrarForm && (
        <div className="caixinhas-modal-backdrop">
          <section className="caixinhas-modal" role="dialog" aria-modal="true" aria-labelledby="regra-title">
            <p className="caixinhas-modal__eyebrow">AUTOMAÇÃO</p>
            <h2 id="regra-title">Nova regra</h2>
            <form onSubmit={salvar}>
              <label className="field-group">
                <span className="field-label">Nome da regra</span>
                <input className="text-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Reserva mensal" />
              </label>

              <label className="field-group">
                <span className="field-label">Caixinha de destino</span>
                <select className="text-input" value={form.caixinhaId} onChange={(e) => setForm({ ...form, caixinhaId: e.target.value })}>
                  <option value="">Selecione uma caixinha</option>
                  {caixinhas.map((caixinha) => <option key={caixinha.id} value={caixinha.id}>{caixinha.nome}</option>)}
                </select>
              </label>

              <label className="field-group">
                <span className="field-label">Como calcular</span>
                <select className="text-input" value={form.tipoCalculo} onChange={(e) => setForm({ ...form, tipoCalculo: e.target.value as TipoCalculoDistribuicao })}>
                  <option value="valor_fixo">Valor fixo</option>
                  <option value="percentual_receita_bruta">% da receita bruta</option>
                  <option value="percentual_saldo_restante">% do saldo restante</option>
                </select>
              </label>

              <label className="field-group">
                <span className="field-label">{form.tipoCalculo === "valor_fixo" ? "Valor" : "Percentual"}</span>
                <input className="text-input" inputMode="decimal" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder={form.tipoCalculo === "valor_fixo" ? "0,00" : "0"} />
              </label>

              <p className="caixinhas-note">As regras são aplicadas pela ordem exibida. Você poderá revisar a distribuição antes de confirmar a receita.</p>

              <div className="caixinhas-modal__actions">
                <button className="button-secondary" type="button" onClick={() => setMostrarForm(false)} disabled={salvando}>Cancelar</button>
                <button className="button-primary" type="submit" disabled={salvando || caixinhas.length === 0}>
                  <FiCheck /> {salvando ? "Salvando..." : "Salvar regra"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <BottomNavigation active="/mais" />
    </>
  );
}
