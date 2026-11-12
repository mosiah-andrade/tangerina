"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import { confirmarReceita } from "@/lib/persistence/receitas/confirmar-receita";

type Revisao = {
  descricao: string;
  valorCentavos: number;
  dataMovimento: string;
  contaDestinoId: string;
  alocacoes: Array<{ id: string; regraDistribuicaoId?: string; caixinhaId: string; nomeCaixinha: string; nomeRegra: string; valorCentavos: number }>;
};

const REVISAO_KEY = "tangerina.receita.revisao";
const RASCUNHO_KEY = "tangerina.receita.rascunho";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);
}

export function ConfirmarReceita() {
  const router = useRouter();
  const [revisao, setRevisao] = useState<Revisao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    const salvo = sessionStorage.getItem(REVISAO_KEY);
    if (!salvo) { router.replace("/receitas"); return; }
    try { setRevisao(JSON.parse(salvo) as Revisao); }
    catch { router.replace("/receitas"); }
  }, [router]);

  const totalAlocado = useMemo(() => revisao?.alocacoes.reduce((total, item) => total + item.valorCentavos, 0) ?? 0, [revisao]);
  const naoAlocado = (revisao?.valorCentavos ?? 0) - totalAlocado;
  const inconsistente = naoAlocado < 0;

  async function confirmar() {
    if (!revisao || inconsistente || salvando) return;
    setSalvando(true);
    setErro(null);
    try {
      const resultado = await confirmarReceita(getDatabase(), {
        descricao: revisao.descricao,
        valorCentavos: revisao.valorCentavos,
        dataMovimento: revisao.dataMovimento,
        contaDestinoId: revisao.contaDestinoId,
        // A revisão pode mostrar várias regras da mesma caixinha separadamente.
        // Na persistência, porém, a caixinha recebe uma única alocação com a soma final.
        alocacoes: Array.from(
          revisao.alocacoes.reduce((porCaixinha, item) => {
            const atual = porCaixinha.get(item.caixinhaId);
            porCaixinha.set(item.caixinhaId, {
              caixinhaId: item.caixinhaId,
              valorCentavos: (atual?.valorCentavos ?? 0) + item.valorCentavos,
              regraDistribuicaoId:
                atual?.regraDistribuicaoId ??
                item.regraDistribuicaoId,
            });
            return porCaixinha;
          }, new Map<string, { caixinhaId: string; valorCentavos: number; regraDistribuicaoId?: string }>()),
        ).map(([, item]) => item),
        idempotencyKey: crypto.randomUUID(),
      });
      void resultado;
      sessionStorage.removeItem(REVISAO_KEY);
      sessionStorage.removeItem(RASCUNHO_KEY);
      setSucesso(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível confirmar a receita.");
    } finally {
      setSalvando(false);
    }
  }

  if (!revisao) return <main className="app-shell receita-page"><p className="receita-loading">Carregando confirmação…</p></main>;

  return <>
    <main className="app-shell receita-page revisao-page">
      <header className="receita-header">
        <Link className="receita-back" href="/receitas/revisar" aria-label="Voltar para revisão"><FiArrowLeft /></Link>
        <div><p className="receita-eyebrow">CONFIRMAÇÃO</p><h1>Confirmar <em>receita</em></h1></div>
      </header>

      {sucesso ? (
        <section className="revisao-main">
          <div className="revisao-empty"><FiCheckCircle /><h2>Receita confirmada</h2><p>A receita e suas alocações foram registradas com sucesso.</p><button className="button-primary receita-submit" onClick={() => router.push("/dashboard")}>Ir para o início</button></div>
        </section>
      ) : (
        <div className="revisao-layout">
          <section className="revisao-main">
            <article className="revisao-receita-card"><span>RECEITA</span><strong>{revisao.descricao}</strong><b>{formatMoney(revisao.valorCentavos)}</b></article>
            <section className="revisao-lista" aria-label="Distribuição confirmada">
              <div className="revisao-section-head"><div><p>CONFERÊNCIA FINAL</p><h2>Distribuição da receita</h2></div><FiCheckCircle aria-hidden="true" /></div>
              {revisao.alocacoes.length === 0 ? <div className="revisao-empty"><p>Nenhum valor será alocado em caixinhas.</p></div> : revisao.alocacoes.map((item) => <div className="revisao-linha" key={item.id}><span><strong>{item.nomeCaixinha}</strong><small>{item.nomeRegra}</small></span><strong>{formatMoney(item.valorCentavos)}</strong></div>)}
            </section>
          </section>
          <aside className="revisao-resumo">
            <p>CONFIRMAÇÃO</p>
            <div><span>Receita</span><strong>{formatMoney(revisao.valorCentavos)}</strong></div>
            <div><span>Distribuído</span><strong>{formatMoney(totalAlocado)}</strong></div>
            <div className={inconsistente ? "danger" : "highlight"}><span>Não alocado</span><strong>{formatMoney(naoAlocado)}</strong></div>
            {erro ? <p className="modal-form-error" role="alert"><FiAlertCircle /> {erro}</p> : null}
            <button className="button-primary receita-submit" type="button" disabled={inconsistente || salvando} onClick={confirmar}>{salvando ? "Confirmando…" : "Confirmar e registrar"}</button>
            <p className="revisao-note">Ao confirmar, a operação é gravada definitivamente no dispositivo.</p>
          </aside>
        </div>
      )}
    </main>
    <BottomNavigation active="/movimentacoes" />
  </>;
}
