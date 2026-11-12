"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import { confirmarDespesa } from "@/lib/persistence/despesas/confirmar-despesa";
import type { DespesaRascunho } from "@/components/registrar-despesa";

const KEY = "tangerina.despesa.rascunho";
function money(value: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100); }

export function ConfirmarDespesa() {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<DespesaRascunho | null>(null);
  const [contaNome, setContaNome] = useState("");
  const [caixinhaNome, setCaixinhaNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    const salvo = sessionStorage.getItem(KEY);
    if (!salvo) { router.replace("/despesas"); return; }
    try {
      const parsed = JSON.parse(salvo) as DespesaRascunho;
      queueMicrotask(() => setRascunho(parsed));
      void (async () => {
        const db = getDatabase();
        const [conta, caixinha] = await Promise.all([db.contas.get(parsed.contaOrigemId), parsed.caixinhaId ? db.caixinhas.get(parsed.caixinhaId) : Promise.resolve(undefined)]);
        queueMicrotask(() => { setContaNome(conta?.nome ?? "Conta"); setCaixinhaNome(caixinha?.nome ?? "Não alocado"); });
      })();
    } catch { router.replace("/despesas"); }
  }, [router]);

  async function confirmar() {
    if (!rascunho || salvando) return;
    setSalvando(true); setErro(null);
    try {
      await confirmarDespesa(getDatabase(), { ...rascunho, idempotencyKey: crypto.randomUUID() });
      sessionStorage.removeItem(KEY);
      setSucesso(true);
    } catch (error) { setErro(error instanceof Error ? error.message : "Não foi possível confirmar a despesa."); }
    finally { setSalvando(false); }
  }

  if (!rascunho) return <main className="app-shell receita-page"><p className="receita-loading">Carregando confirmação…</p></main>;

  return <><main className="app-shell receita-page revisao-page">
    <header className="receita-header"><Link className="receita-back" href="/despesas" aria-label="Voltar para a despesa"><FiArrowLeft /></Link><div><p className="receita-eyebrow">CONFIRMAÇÃO</p><h1>Confirmar <em>despesa</em></h1></div></header>
    {sucesso ? <section className="revisao-main"><div className="revisao-empty"><FiCheckCircle /><div><h2>Despesa confirmada</h2><p>A saída foi registrada com sucesso.</p><button className="button-primary receita-submit" onClick={() => router.push("/dashboard")}>Ir para o início</button></div></div></section> :
    <div className="revisao-layout"><section className="revisao-main"><article className="revisao-receita-card"><span>DESPESA</span><strong>{rascunho.descricao}</strong><b>{money(rascunho.valorCentavos)}</b></article><section className="revisao-lista"><div className="revisao-section-head"><div><p>CONFERÊNCIA FINAL</p><h2>Origem da despesa</h2></div><FiCheckCircle /></div><div className="revisao-linha"><span><strong>Categoria</strong><small>{rascunho.categoria}</small></span></div><div className="revisao-linha"><span><strong>Conta bancária</strong><small>{contaNome}</small></span></div><div className="revisao-linha"><span><strong>Caixinha</strong><small>{caixinhaNome}</small></span></div><div className="revisao-linha"><span><strong>Data</strong><small>{rascunho.dataMovimento}</small></span></div></section></section><aside className="revisao-resumo"><p>CONFIRMAÇÃO</p><div><span>Despesa</span><strong>{money(rascunho.valorCentavos)}</strong></div>{erro ? <p className="modal-form-error" role="alert"><FiAlertCircle /> {erro}</p> : null}<button className="button-primary receita-submit" disabled={salvando} onClick={confirmar}>{salvando ? "Confirmando…" : "Confirmar e registrar"}</button><p className="revisao-note">Ao confirmar, a operação será gravada no dispositivo.</p></aside></div>}
  </main><BottomNavigation active="/movimentacoes" /></>;
}
