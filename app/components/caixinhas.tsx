"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArchive, FiBox, FiEdit3, FiPlus, FiX } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { formatMoneyFromCents } from "@/lib/format-money";
import { parseMoneyToCents } from "@/domain/finance/money";
import { getDatabase } from "@/lib/persistence/database";
import { arquivarCaixinha } from "@/lib/persistence/caixinhas/arquivar";
import { criarCaixinha } from "@/lib/persistence/caixinhas/criar";
import { editarCaixinha } from "@/lib/persistence/caixinhas/editar";
import { listarCaixinhasComSaldo, type CaixinhaComSaldo } from "@/lib/persistence/caixinhas/listar";

type FormState = { nome: string; descricao: string; saldo: string };

const initialForm: FormState = { nome: "", descricao: "", saldo: "0,00" };

export function Caixinhas() {
  const [itens, setItens] = useState<CaixinhaComSaldo[] | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editando, setEditando] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const db = getDatabase();
    await db.open();
    const caixinhas = await listarCaixinhasComSaldo(db);
    setItens(caixinhas);
  }

  useEffect(() => {
    let ativo = true;

    async function carregarInicial() {
      try {
        const db = getDatabase();
        await db.open();
        const caixinhas = await listarCaixinhasComSaldo(db);

        if (ativo) {
          setItens(caixinhas);
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar suas caixinhas.");
        }
      }
    }

    void carregarInicial();

    return () => {
      ativo = false;
    };
  }, []);

  const totalAlocado = useMemo(
    () => itens?.filter(({ caixinha }) => caixinha.ativa).reduce((t, item) => t + item.saldoAtualCentavos, 0) ?? 0,
    [itens],
  );

  function abrirNova() {
    setForm(initialForm); setEditando(null); setErro(null); setMostrarForm(true);
  }

  function abrirEdicao(item: CaixinhaComSaldo) {
    setForm({ nome: item.caixinha.nome, descricao: item.caixinha.descricao ?? "", saldo: formatMoneyFromCents(item.caixinha.saldoInicialCentavos).replace("R$ ", "") });
    setEditando(item.caixinha.id); setErro(null); setMostrarForm(true);
  }

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.nome.trim()) { setErro("Informe um nome para a caixinha."); return; }
    setSalvando(true); setErro(null);
    try {
      const db = getDatabase(); await db.open();
      if (editando) {
        await editarCaixinha(db, editando, { nome: form.nome.trim(), descricao: form.descricao.trim() || null });
      } else {
        const saldoInicialCentavos = parseMoneyToCents(form.saldo.trim());
        await criarCaixinha(db, { nome: form.nome.trim(), descricao: form.descricao.trim() || undefined, saldoInicialCentavos, dataSaldoInicial: new Date().toISOString().slice(0, 10) });
      }
      setMostrarForm(false); await carregar();
    } catch {
      setErro("Não foi possível salvar a caixinha. Confira os dados e tente novamente.");
    } finally { setSalvando(false); }
  }

  async function arquivar(id: string) {
    if (!window.confirm("Arquivar esta caixinha? Os dados serão preservados.")) return;
    try { const db = getDatabase(); await db.open(); await arquivarCaixinha(db, id); await carregar(); }
    catch { setErro("Não foi possível arquivar a caixinha."); }
  }

  return <>
    <main className="app-shell caixinhas-page">
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
      <section className="dashboard-greeting caixinhas-intro">
        <p>ORGANIZAÇÃO</p><h1>Suas <em>caixinhas</em></h1>
        <span>Organize seu dinheiro sem duplicar seu patrimônio.</span>
      </section>
      <section className="balance-card caixinhas-total">
        <div className="balance-topline"><p className="balance-label">Total alocado</p><FiBox className="balance-eye" aria-hidden="true" /></div>
        <strong className="balance-value">{formatMoneyFromCents(totalAlocado)}</strong>
        <p className="balance-caption">Alocações virtuais dentro do seu patrimônio, não um novo saldo bancário.</p>
      </section>

      {erro && <p className="caixinhas-error" role="alert">{erro}</p>}
      <div className="caixinhas-section-heading"><h2>Suas caixinhas</h2><button className="button-secondary caixinhas-add-small" onClick={abrirNova}><FiPlus /> Adicionar</button></div>

      {itens === null && !erro ? <section className="caixinhas-state" aria-live="polite"><p className="field-hint">Carregando suas caixinhas...</p></section> : itens === null ? null : itens.length === 0 ? (
        <section className="caixinhas-empty surface-card"><span className="caixinhas-empty__icon"><FiBox size={22} /></span><strong>Você ainda não criou uma caixinha.</strong><p>Crie caixinhas para organizar partes do seu dinheiro por objetivo, sem duplicar seu saldo real.</p></section>
      ) : (
        <section className="caixinhas-lista caixinhas-bento" aria-label="Caixinhas">
          {itens.map((item) => <article className={item.caixinha.ativa ? "caixinha-card" : "caixinha-card caixinha-card--inactive"} key={item.caixinha.id}>
            <Link className="caixinha-card__main" href={`/caixinhas/${item.caixinha.id}`}><span className="caixinha-card__icon"><FiBox size={19} /></span><div><strong>{item.caixinha.nome}</strong>{item.caixinha.descricao && <p>{item.caixinha.descricao}</p>}<span className="caixinha-card__value">{formatMoneyFromCents(item.saldoAtualCentavos)}</span><span className={item.caixinha.ativa ? "caixinha-card__status" : "caixinha-card__status caixinha-card__status--inactive"}>{item.caixinha.ativa ? "Ativa" : "Arquivada"}</span></div></Link>
            <div className="caixinha-card__actions"><button type="button" onClick={() => abrirEdicao(item)} aria-label={`Editar ${item.caixinha.nome}`}><FiEdit3 /></button>{item.caixinha.ativa && <button type="button" onClick={() => void arquivar(item.caixinha.id)} aria-label={`Arquivar ${item.caixinha.nome}`}><FiArchive /></button>}</div>
          </article>)}
        </section>
      )}

      <button className="button-primary caixinhas-add" type="button" onClick={abrirNova}><span>Adicionar caixinha</span><FiPlus size={19} /></button>
    </main>

    {mostrarForm && <div className="caixinhas-modal-backdrop" role="presentation">
      <section className="caixinhas-modal" role="dialog" aria-modal="true" aria-labelledby="caixinha-form-title">
        <button className="caixinhas-modal__close" type="button" onClick={() => setMostrarForm(false)} aria-label="Fechar"><FiX /></button>
        <p className="caixinhas-modal__eyebrow">ORGANIZAÇÃO</p><h2 id="caixinha-form-title">{editando ? "Editar caixinha" : "Nova caixinha"}</h2>
        <form onSubmit={salvar}>
          <label className="field-group"><span className="field-label">Nome</span><input className="text-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} autoFocus placeholder="Ex.: Reserva de emergência" /></label>
          <label className="field-group"><span className="field-label">Descrição <span className="field-hint">(opcional)</span></span><textarea className="text-area" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Para que você está organizando este valor?" /></label>
          {!editando && <label className="field-group"><span className="field-label">Saldo inicial</span><input className="text-input" inputMode="decimal" value={form.saldo} onChange={(e) => setForm({ ...form, saldo: e.target.value })} /><span className="field-hint">Use vírgula para os centavos.</span></label>}
          <p className="caixinhas-note">Caixinhas organizam seu patrimônio. O valor alocado não é somado novamente ao saldo das contas.</p>
          <div className="caixinhas-modal__actions"><button className="button-secondary" type="button" onClick={() => setMostrarForm(false)} disabled={salvando}>Cancelar</button><button className="button-primary" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar caixinha"}</button></div>
        </form>
      </section>
    </div>}
    <BottomNavigation active="/caixinhas" />
  </>;
}
