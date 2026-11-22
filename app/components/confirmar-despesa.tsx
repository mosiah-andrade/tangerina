"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import { calcularSaldoCaixinhaPorAlocacoes } from "@/lib/persistence/caixinhas/saldo";
import { confirmarDespesa } from "@/lib/persistence/despesas/confirmar-despesa";

type AlocacaoRevisada = { id:string; caixinhaId:string; nomeCaixinha:string; nomeRegra:string; valorCentavos:number; regraDistribuicaoId?:string };
type RevisaoDespesa = { descricao:string; categoria:string; valorCentavos:number; dataMovimento:string; contaOrigemId:string; alocacoes:AlocacaoRevisada[]; idempotencyKey:string };
type AlertaCaixinha = { id:string; nome:string; atual:number; projetado:number };

const KEY = "tangerina.despesa.revisao";
const RASCUNHO_KEY = "tangerina.despesa.rascunho";
function money(value:number) { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value/100); }
function dataLegivel(value:string) { const [a,m,d]=value.split("-"); return d+"/"+m+"/"+a; }

export function ConfirmarDespesa() {
  const router=useRouter();
  const [revisao,setRevisao]=useState<RevisaoDespesa|null>(null);
  const [contaNome,setContaNome]=useState("");
  const [alertas,setAlertas]=useState<AlertaCaixinha[]>([]);
  const [confirmadas,setConfirmadas]=useState<string[]>([]);
  const [carregando,setCarregando]=useState(true);
  const [erro,setErro]=useState<string|null>(null);
  const [salvando,setSalvando]=useState(false);
  const [sucesso,setSucesso]=useState(false);

  useEffect(()=>{
    let ativo=true;
    try {
      const salvo=sessionStorage.getItem(KEY);
      if(!salvo){ router.replace("/despesas"); return ()=>{ativo=false;}; }
      const parsed=JSON.parse(salvo) as RevisaoDespesa;
      if(!parsed || !Array.isArray(parsed.alocacoes) || !parsed.idempotencyKey) throw new Error("Revisão inválida");
      setRevisao(parsed);
      void (async()=>{
        try {
          const db=getDatabase(); await db.open();
          const conta=await db.contas.get(parsed.contaOrigemId);
          if(!ativo)return;
          setContaNome(conta?conta.nome+" — "+(conta.tipo==="carteira_fisica"?"Carteira física":"Conta bancária"):"Origem indisponível");
          const alertasCalculados:AlertaCaixinha[]=[];
          const valoresPorCaixinha = parsed.alocacoes.reduce((mapa,item)=>mapa.set(item.caixinhaId,(mapa.get(item.caixinhaId)??0)+item.valorCentavos),new Map<string,number>());
          for(const [caixinhaId,valorCaixinha] of valoresPorCaixinha){
            const caixinha=await db.caixinhas.get(caixinhaId);
            if(!caixinha) throw new Error("Uma das caixinhas selecionadas não está mais disponível.");
            const alocacoes=await db.alocacoes.where("caixinhaId").equals(caixinha.id).toArray();
            const atual=calcularSaldoCaixinhaPorAlocacoes(caixinha,alocacoes);
            const projetado=atual-valorCaixinha;
            if(projetado<0) alertasCalculados.push({id:caixinha.id,nome:caixinha.nome,atual,projetado});
          }
          if(ativo)setAlertas(alertasCalculados);
        }catch(e){if(ativo)setErro(e instanceof Error?e.message:"Não foi possível carregar os dados da despesa.");}
        finally{if(ativo)setCarregando(false);}
      })();
    }catch{
      sessionStorage.removeItem(KEY); router.replace("/despesas");
    }
    return ()=>{ativo=false;};
  },[router]);

  const totalAlocado=useMemo(()=>revisao?.alocacoes.reduce((s,a)=>s+a.valorCentavos,0)??0,[revisao]);
  const naoAlocado=(revisao?.valorCentavos??0)-totalAlocado;

  async function confirmar(){
    if(!revisao||salvando||carregando||alertas.some(a=>!confirmadas.includes(a.id))||erro)return;
    setSalvando(true);setErro(null);
    try{
      await confirmarDespesa(getDatabase(),{
        descricao:revisao.descricao,categoria:revisao.categoria,valorCentavos:revisao.valorCentavos,
        dataMovimento:revisao.dataMovimento,contaOrigemId:revisao.contaOrigemId,
        alocacoes:Array.from(revisao.alocacoes.reduce((mapa,a)=>{const atual=mapa.get(a.caixinhaId);mapa.set(a.caixinhaId,{caixinhaId:a.caixinhaId,valorCentavos:(atual?.valorCentavos??0)+a.valorCentavos,regraDistribuicaoId:atual?.regraDistribuicaoId??a.regraDistribuicaoId});return mapa;},new Map<string,{caixinhaId:string;valorCentavos:number;regraDistribuicaoId?:string}>()).values(),
        idempotencyKey:revisao.idempotencyKey,
        confirmarCaixinhasNegativas:confirmadas,
      });
      sessionStorage.removeItem(KEY);sessionStorage.removeItem(RASCUNHO_KEY);setSucesso(true);
    }catch(e){setErro(e instanceof Error?e.message:"Não foi possível confirmar a despesa.");}
    finally{setSalvando(false);}
  }

  if(!revisao)return <main className="app-shell receita-page"><p className="receita-loading">Carregando confirmação…</p></main>;
  return <>
    <main className="app-shell receita-page revisao-page">
      <header className="receita-header"><Link className="receita-back" href="/despesas/revisar" aria-label="Voltar para revisão"><FiArrowLeft/></Link><div><p className="receita-eyebrow">CONFIRMAÇÃO</p><h1>Confirmar <em>despesa</em></h1></div></header>
      {sucesso?<section className="revisao-main"><div className="revisao-empty"><FiCheckCircle/><div><h2>Despesa confirmada</h2><p>A saída e sua distribuição foram registradas com sucesso.</p><button className="button-primary receita-submit" onClick={()=>router.push("/dashboard")}>Ir para o início</button></div></div></section>:
      <div className="revisao-layout">
        <section className="revisao-main">
          <article className="revisao-receita-card"><span>DESPESA</span><strong>{revisao.descricao}</strong><b>{money(revisao.valorCentavos)}</b></article>
          <section className="revisao-lista"><div className="revisao-section-head"><div><p>CONFERÊNCIA FINAL</p><h2>Distribuição da despesa</h2></div><FiCheckCircle/></div>
            <div className="revisao-linha"><span><strong>Categoria</strong><small>{revisao.categoria}</small></span></div>
            <div className="revisao-linha"><span><strong>Origem do pagamento</strong><small>{contaNome||"Carregando…"}</small></span></div>
            <div className="revisao-linha"><span><strong>Data</strong><small>{dataLegivel(revisao.dataMovimento)}</small></span></div>
            {revisao.alocacoes.length===0?<div className="revisao-empty"><p>Nenhuma caixinha participará. O valor permanecerá não alocado.</p></div>:revisao.alocacoes.map(a=><div className="revisao-linha" key={a.id}><span><strong>{a.nomeCaixinha}</strong><small>{a.nomeRegra}</small></span><strong>{money(a.valorCentavos)}</strong></div>)}
          </section>
          {alertas.length>0?<section className="modal-form-error" role="alert"><strong>Atenção: uma ou mais caixinhas ficarão negativas.</strong>
            {alertas.map(a=><label key={a.id} style={{display:"block",marginTop:".8rem"}}><span>{a.nome}: {money(a.atual)} → {money(a.projetado)}.</span><br/><input type="checkbox" checked={confirmadas.includes(a.id)} onChange={e=>setConfirmadas(ids=>e.target.checked?[...ids,a.id]:ids.filter(id=>id!==a.id))}/> Confirmo que esta caixinha pode ficar negativa.</label>)}
          </section>:null}
        </section>
        <aside className="revisao-resumo"><p>CONFIRMAÇÃO</p><div><span>Despesa</span><strong>{money(revisao.valorCentavos)}</strong></div><div><span>Distribuído</span><strong>{money(totalAlocado)}</strong></div><div className="highlight"><span>Não alocado</span><strong>{money(naoAlocado)}</strong></div>
          {erro?<p className="modal-form-error" role="alert"><FiAlertCircle/> {erro}</p>:null}
          <button className="button-primary receita-submit" disabled={salvando||carregando||alertas.some(a=>!confirmadas.includes(a.id))||Boolean(erro)} onClick={confirmar}>{salvando?"Confirmando…":carregando?"Carregando…":"Confirmar e registrar"}</button>
          <p className="revisao-note">Nenhum efeito financeiro será gravado até a confirmação final.</p>
        </aside>
      </div>}
    </main><BottomNavigation active="/movimentacoes"/>
  </>;
}
