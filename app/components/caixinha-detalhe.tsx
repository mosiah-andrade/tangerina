"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiCheck, FiEdit3, FiPlus } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getDatabase } from "@/lib/persistence/database";
import { listarCaixinhasComSaldo, type CaixinhaComSaldo } from "@/lib/persistence/caixinhas/listar";
import { atualizarRegraDistribuicao, criarRegraDistribuicao, listarRegrasDistribuicao } from "@/lib/persistence/distribuicao/regras";
import type { RegraDistribuicao, TipoCalculoDistribuicao } from "@/lib/persistence/entities";
import { formatMoneyFromCents } from "@/lib/format-money";
import { parseMoneyToCents } from "@/domain/finance/money";

type FormState={id?:string;nome:string;tipoCalculo:TipoCalculoDistribuicao;valor:string};
const vazio:FormState={nome:"",tipoCalculo:"percentual_receita_bruta",valor:""};

function descricao(regra:RegraDistribuicao){
 if(regra.tipoCalculo==="valor_fixo") return "Valor fixo: "+formatMoneyFromCents(regra.valorFixoCentavos);
 const percentual=(regra.percentual/100).toLocaleString("pt-BR",{maximumFractionDigits:2});
 return regra.tipoCalculo==="percentual_receita_bruta"?percentual+"% da receita bruta":percentual+"% do saldo restante";
}

export function CaixinhaDetalhe(){
 const params=useParams<{id:string}>(); const id=Array.isArray(params.id)?params.id[0]:params.id;
 const [item,setItem]=useState<CaixinhaComSaldo|null>(null);
 const [regras,setRegras]=useState<RegraDistribuicao[]>([]);
 const [form,setForm]=useState<FormState|null>(null);
 const [erro,setErro]=useState<string|null>(null);
 const [carregando,setCarregando]=useState(true);
 const [salvando,setSalvando]=useState(false);

 async function carregar(){
  const db=getDatabase(); await db.open();
  const [caixinhas,todasRegras]=await Promise.all([listarCaixinhasComSaldo(db),listarRegrasDistribuicao(db)]);
  setItem(caixinhas.find((atual)=>atual.caixinha.id===id)??null);
  setRegras(todasRegras.filter((regra)=>regra.caixinhaId===id));
 }
 useEffect(()=>{let ativo=true; async function iniciar(){try{await carregar();}catch{if(ativo)setErro("Não foi possível carregar esta caixinha.");}finally{if(ativo)setCarregando(false);}} void iniciar(); return()=>{ativo=false;};},[id]);

 async function salvar(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault(); if(!form) return; setErro(null);
  if(!form.nome.trim()||!form.valor.trim()){setErro("Preencha o nome e o valor da regra.");return;}
  try{
   setSalvando(true); const db=getDatabase(); await db.open();
   const ordem=form.id?undefined:(regras.length?Math.max(...regras.map(r=>r.ordem))+1:1);
   const base=form.tipoCalculo==="valor_fixo"
    ? {nome:form.nome.trim(),tipoCalculo:form.tipoCalculo,valorFixoCentavos:parseMoneyToCents(form.valor)}
    : {nome:form.nome.trim(),tipoCalculo:form.tipoCalculo,percentual:Math.round(Number(form.valor.replace(",","."))*100)};
   if(form.tipoCalculo!=="valor_fixo" && (!Number.isFinite((base as {percentual?:number}).percentual)||((base as {percentual?:number}).percentual??0)<=0)){setErro("Informe um percentual válido.");return;}
   if(form.id){await atualizarRegraDistribuicao(db,form.id,base);}else{await criarRegraDistribuicao(db,{...base,caixinhaId:id,ordem:ordem!});}
   setForm(null); await carregar();
  }catch{setErro("Não foi possível salvar a regra.");}finally{setSalvando(false);}
 }
 async function alternar(regra:RegraDistribuicao){
  try{const db=getDatabase();await db.open();await atualizarRegraDistribuicao(db,regra.id,{ativa:!regra.ativa});await carregar();}catch{setErro("Não foi possível atualizar a regra.");}
 }

 if(carregando)return <main className="app-shell caixinhas-page"><p className="receita-loading">Carregando caixinha…</p></main>;
 if(!item)return <main className="app-shell caixinhas-page"><Link href="/caixinhas">Voltar para caixinhas</Link><p className="caixinhas-error">{erro??"Caixinha não encontrada."}</p></main>;

 return <><main className="app-shell caixinhas-page">
  <header className="app-header"><Link href="/caixinhas" aria-label="Voltar para caixinhas"><FiArrowLeft/></Link></header>
  <section className="dashboard-greeting caixinhas-intro"><p>CAIXINHA</p><h1>{item.caixinha.nome}</h1><span>{item.caixinha.descricao??"Organize suas regras e acompanhe este valor."}</span></section>
  <section className="balance-card caixinhas-total"><div className="balance-topline"><p className="balance-label">Saldo atual</p></div><strong className="balance-value">{formatMoneyFromCents(item.saldoAtualCentavos)}</strong></section>
  {erro&&<p className="caixinhas-error" role="alert">{erro}</p>}
  <div className="caixinhas-section-heading"><h2>Regras de distribuição</h2><button className="button-secondary caixinhas-add-small" type="button" onClick={()=>setForm(vazio)}><FiPlus/> Adicionar</button></div>
  <p className="caixinhas-note">As regras criadas aqui já pertencem a esta caixinha e serão usadas como sugestões nas próximas receitas.</p>
  {regras.length===0?<section className="caixinhas-empty surface-card"><strong>Nenhuma regra nesta caixinha.</strong><p>Adicione uma regra para automatizar sugestões de distribuição.</p></section>:<section className="caixinhas-lista caixinhas-bento">{regras.map(regra=><article className={regra.ativa?"caixinha-card":"caixinha-card caixinha-card--inactive"} key={regra.id}><div className="caixinha-card__main"><div><strong>{regra.ordem}. {regra.nome}</strong><span className="caixinha-card__value">{descricao(regra)}</span><span className={regra.ativa?"caixinha-card__status":"caixinha-card__status caixinha-card__status--inactive"}>{regra.ativa?"Ativa":"Inativa"}</span></div></div><div className="caixinha-card__actions"><button type="button" onClick={()=>setForm({id:regra.id,nome:regra.nome,tipoCalculo:regra.tipoCalculo,valor:regra.tipoCalculo==="valor_fixo"?(regra.valorFixoCentavos/100).toFixed(2).replace(".",","):(regra.percentual/100).toString().replace(".",",")})} aria-label={"Editar "+regra.nome}><FiEdit3/></button><button className="button-secondary" type="button" onClick={()=>void alternar(regra)}>{regra.ativa?"Desativar":"Ativar"}</button></div></article>)}</section>}
 </main>
 {form&&<div className="caixinhas-modal-backdrop"><section className="caixinhas-modal" role="dialog" aria-modal="true"><p className="caixinhas-modal__eyebrow">DISTRIBUIÇÃO</p><h2>{form.id?"Editar regra":"Nova regra"}</h2><form onSubmit={salvar}><label className="field-group"><span className="field-label">Nome</span><input className="text-input" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/></label><label className="field-group"><span className="field-label">Como calcular</span><select className="text-input" value={form.tipoCalculo} onChange={e=>setForm({...form,tipoCalculo:e.target.value as TipoCalculoDistribuicao})}><option value="valor_fixo">Valor fixo</option><option value="percentual_receita_bruta">% da receita bruta</option><option value="percentual_saldo_restante">% do saldo restante</option></select></label><label className="field-group"><span className="field-label">{form.tipoCalculo==="valor_fixo"?"Valor":"Percentual"}</span><input className="text-input" inputMode="decimal" value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})} placeholder={form.tipoCalculo==="valor_fixo"?"0,00":"0"}/></label><div className="caixinhas-modal__actions"><button className="button-secondary" type="button" onClick={()=>setForm(null)} disabled={salvando}>Cancelar</button><button className="button-primary" type="submit" disabled={salvando}><FiCheck/> {salvando?"Salvando...":"Salvar regra"}</button></div></form></section></div>}
 <BottomNavigation active="/caixinhas"/>
 </>;
}
