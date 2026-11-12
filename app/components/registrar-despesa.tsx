"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiDollarSign, FiFileText, FiTag } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { parseMoneyToCents } from "@/domain/finance/money";
import { getDatabase } from "@/lib/persistence/database";
import type { Caixinha, Conta } from "@/lib/persistence/entities";

export type DespesaRascunho = {
  descricao: string;
  categoria: string;
  valorCentavos: number;
  dataMovimento: string;
  contaOrigemId: string;
  caixinhaId: string;
};

export function RegistrarDespesa() {
  const router = useRouter();
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [contas, setContas] = useState<Conta[]>([]);
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([]);
  const [contaOrigemId, setContaOrigemId] = useState("");
  const [caixinhaId, setCaixinhaId] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const db = getDatabase();
        await db.open();
        const [contasAtivas, caixinhasAtivas] = await Promise.all([
          db.contas.filter((item) => item.ativa && item.tipo === "bancaria").toArray(),
          db.caixinhas.filter((item) => item.ativa).toArray(),
        ]);
        if (!ativo) return;
        setContas(contasAtivas);
        setCaixinhas(caixinhasAtivas);
        if (contasAtivas.length === 1) setContaOrigemId(contasAtivas[0].id);
        if (caixinhasAtivas.length === 1) setCaixinhaId(caixinhasAtivas[0].id);
      } catch {
        if (ativo) setErro("Não foi possível carregar as contas e caixinhas.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, []);

  function continuar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    try {
      const valorCentavos = parseMoneyToCents(valor.trim());
      if (!descricao.trim()) throw new Error("Informe uma descrição para a despesa.");
      if (!categoria.trim()) throw new Error("Informe uma categoria para a despesa.");
      if (valorCentavos <= 0) throw new Error("Informe um valor maior que zero.");
      if (!contaOrigemId) throw new Error(contas.length ? "Selecione a conta bancária." : "Cadastre uma conta bancária ativa antes de registrar uma despesa.");
      if (!caixinhaId) throw new Error(caixinhas.length ? "Selecione a caixinha de origem." : "Cadastre uma caixinha ativa antes de registrar uma despesa.");

      const rascunho: DespesaRascunho = { descricao: descricao.trim(), categoria: categoria.trim(), valorCentavos, dataMovimento: data, contaOrigemId, caixinhaId };
      sessionStorage.setItem("tangerina.despesa.rascunho", JSON.stringify(rascunho));
      router.push("/despesas/confirmar");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Informe os dados corretamente.");
    }
  }

  return <><main className="app-shell receita-page">
    <header className="receita-header"><Link className="receita-back" href="/dashboard" aria-label="Voltar ao início"><FiArrowLeft /></Link><div><p className="receita-eyebrow">NOVA MOVIMENTAÇÃO</p><h1>Registrar <em>despesa</em></h1></div></header>
    <div className="receita-layout">
      <section className="receita-hero"><span className="receita-hero__icon"><FiDollarSign /></span><div><strong>Uma saída de dinheiro.</strong><p>Informe de onde o dinheiro saiu e confira tudo antes de confirmar.</p></div></section>
      <form className="receita-form" onSubmit={continuar}>
        <label className="field-group"><span className="field-label"><FiFileText /> Descrição</span><input className="text-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: Supermercado" autoFocus required /></label>
        <label className="field-group"><span className="field-label"><FiTag /> Categoria</span><input className="text-input" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex.: Alimentação" required /></label>
        <label className="field-group"><span className="field-label"><FiDollarSign /> Valor gasto</span><input className="text-input receita-value-input" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" required /></label>
        <label className="field-group"><span className="field-label">Conta bancária</span><select className="text-input" value={contaOrigemId} onChange={(e) => setContaOrigemId(e.target.value)} disabled={carregando} required><option value="">Selecione a conta</option>{contas.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
        <label className="field-group"><span className="field-label">Caixinha de origem</span><select className="text-input" value={caixinhaId} onChange={(e) => setCaixinhaId(e.target.value)} disabled={carregando} required><option value="">Selecione a caixinha</option>{caixinhas.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
        <label className="field-group"><span className="field-label"><FiCalendar /> Data da despesa</span><input className="text-input" type="date" value={data} onChange={(e) => setData(e.target.value)} required /></label>
        {erro ? <p className="modal-form-error" role="alert">{erro}</p> : null}
        <button className="button-primary receita-submit" type="submit">Continuar para confirmação <FiArrowRight /></button>
      </form>
      <aside className="receita-side"><section className="receita-side-card"><p className="receita-side-card__label">PRÓXIMA ETAPA</p><p className="receita-side-card__value">Confirmar</p><p className="receita-side-card__hint">Nada será alterado até a confirmação final.</p></section><p className="receita-note">A despesa reduzirá a conta bancária e a alocação virtual da caixinha escolhida.</p></aside>
    </div>
  </main><BottomNavigation active="/movimentacoes" /></>;
}
