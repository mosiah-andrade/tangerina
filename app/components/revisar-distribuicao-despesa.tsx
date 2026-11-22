"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiEdit3, FiInfo } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { calcularDistribuicao, type DistributionRuleInput } from "@/domain/finance/distribution";
import { parseMoneyToCents } from "@/domain/finance/money";
import { getDatabase } from "@/lib/persistence/database";
import { criarRepositorioRegrasDistribuicao } from "@/lib/persistence/repositories";
import type { RegraDistribuicao } from "@/lib/persistence/entities";

type Rascunho = { descricao: string; categoria: string; valorCentavos: number; dataMovimento: string; contaOrigemId: string };
type Linha = { id: string; regraDistribuicaoId?: string; caixinhaId: string; nomeCaixinha: string; nomeRegra: string; valorCentavos: number; sugestaoCentavos: number };
const KEY = "tangerina.despesa.rascunho";
const REVISAO_KEY = "tangerina.despesa.revisao";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);
}

export function RevisarDistribuicaoDespesa() {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [caixinhas, setCaixinhas] = useState<Array<{id:string;nome:string}>>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [excedente, setExcedente] = useState(0);
  const [regrasDistribuicao, setRegrasDistribuicao] = useState<DistributionRuleInput[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editada, setEditada] = useState(false);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const salvo = sessionStorage.getItem(KEY);
        if (!salvo) { router.replace("/despesas"); return; }
        const despesa = JSON.parse(salvo) as Rascunho;
        const db = getDatabase();
        await db.open();
        const [regras, todasCaixinhas] = await Promise.all([
          criarRepositorioRegrasDistribuicao(db).listar(),
          db.caixinhas.toArray(),
        ]);
        const ativas = todasCaixinhas.filter((c) => c.ativa);
        const regrasAtivas = regras
          .filter((r) => r.ativa && ativas.some((c) => c.id === r.caixinhaId))
          .sort((a,b) => a.ordem-b.ordem || a.createdAt.localeCompare(b.createdAt));
        const entradas: DistributionRuleInput[] = regrasAtivas.map((r: RegraDistribuicao) => ({
          id:r.id, ordem:r.ordem, ativa:r.ativa, tipoCalculo:r.tipoCalculo,
          valorFixoCentavos:r.tipoCalculo === "valor_fixo" ? r.valorFixoCentavos : undefined,
          percentual:r.tipoCalculo !== "valor_fixo" ? r.percentual : undefined,
        }));
        const resultado = calcularDistribuicao(despesa.valorCentavos, entradas);
        const sugestoes = new Map(resultado.alocacoes.map((a) => [a.regraDistribuicaoId,a.valorCentavos]));
        const comRegra = new Set(regrasAtivas.map((r) => r.caixinhaId));
        if (!ativo) return;
        setRascunho(despesa);
        setCaixinhas(ativas.map((c) => ({id:c.id,nome:c.nome})));
        setSelecionadas(ativas.map((c) => c.id));
        setExcedente(resultado.excedenteCentavos);
        setRegrasDistribuicao(entradas);
        setLinhas([
          ...regrasAtivas.map((r) => {
            const c = ativas.find((x) => x.id === r.caixinhaId)!;
            const sugestao = sugestoes.get(r.id) ?? 0;
            return {id:r.id, regraDistribuicaoId:r.id, caixinhaId:r.caixinhaId, nomeCaixinha:c.nome, nomeRegra:r.nome, valorCentavos:sugestao, sugestaoCentavos:sugestao};
          }),
          ...ativas.filter((c) => !comRegra.has(c.id)).map((c) => ({
            id:"manual-"+c.id, caixinhaId:c.id, nomeCaixinha:c.nome, nomeRegra:"Sem regra automática", valorCentavos:0, sugestaoCentavos:0,
          })),
        ]);
      } catch {
        if (ativo) setErro("Não foi possível carregar as regras e caixinhas.");
      } finally { if (ativo) setCarregando(false); }
    }
    void carregar();
    return () => { ativo = false; };
  }, [router]);

  const visiveis = useMemo(() => linhas.filter((l) => selecionadas.includes(l.caixinhaId)), [linhas,selecionadas]);
  const total = useMemo(() => visiveis.reduce((s,l) => s+l.valorCentavos,0), [visiveis]);
  const naoAlocado = (rascunho?.valorCentavos ?? 0)-total;
  const inconsistente = naoAlocado < 0;

  function alternarCaixinha(id:string) {
    const novasSelecionadas = selecionadas.includes(id)
      ? selecionadas.filter((atual) => atual !== id)
      : [...selecionadas, id];
    setSelecionadas(novasSelecionadas);
    if (!rascunho) return;
    const regrasSelecionadas = regrasDistribuicao.filter((regra) => {
      const linha = linhas.find((item) => item.regraDistribuicaoId === regra.id);
      return linha && novasSelecionadas.includes(linha.caixinhaId);
    });
    const resultado = calcularDistribuicao(rascunho.valorCentavos, regrasSelecionadas);
    const sugestoes = new Map(resultado.alocacoes.map((item) => [item.regraDistribuicaoId, item.valorCentavos]));
    setExcedente(resultado.excedenteCentavos);
    setLinhas((atuais) => atuais.map((linha) => {
      if (!linha.regraDistribuicaoId) return linha;
      const sugestao = sugestoes.get(linha.regraDistribuicaoId) ?? 0;
      return { ...linha, sugestaoCentavos: sugestao, valorCentavos: sugestao };
    }));
    setEditada(false);
  }

  function editar(id:string, texto:string) {
    try {
      const cents = texto.trim()==="" ? 0 : parseMoneyToCents(texto);
      if (cents < 0) throw new Error();
      setErro(null); setEditada(true);
      setLinhas((atuais) => atuais.map((l) => l.id===id ? {...l,valorCentavos:cents}:l));
    } catch { setErro("Informe um valor válido, usando vírgula para os centavos."); }
  }

  function continuar() {
    if (!rascunho || inconsistente) return;
    const alocacoes = visiveis.filter((l) => l.valorCentavos>0).map((l) => ({
      id:l.id, regraDistribuicaoId:l.regraDistribuicaoId, caixinhaId:l.caixinhaId,
      nomeCaixinha:l.nomeCaixinha, nomeRegra:l.nomeRegra,
      valorCentavos:l.valorCentavos, sugestaoCentavos:l.sugestaoCentavos,
    }));
    sessionStorage.setItem(REVISAO_KEY, JSON.stringify({...rascunho,alocacoes}));
    router.push("/despesas/confirmar");
  }

  if (carregando) return <main className="app-shell receita-page"><p className="receita-loading">Calculando distribuição da despesa…</p></main>;

  return <>
    <main className="app-shell receita-page revisao-page">
      <header className="receita-header">
        <Link className="receita-back" href="/despesas" aria-label="Voltar para despesa"><FiArrowLeft /></Link>
        <div><p className="receita-eyebrow">REVISÃO</p><h1>Revise a <em>distribuição</em></h1></div>
      </header>
      {erro ? <p className="modal-form-error" role="alert">{erro}</p> : null}
      {rascunho && <div className="revisao-layout">
        <section className="revisao-main">
          <article className="revisao-receita-card"><span>DESPESA</span><strong>{rascunho.descricao}</strong><b>{money(rascunho.valorCentavos)}</b></article>
          <section className="revisao-lista" aria-label="Distribuição da despesa">
            <div className="revisao-section-head"><div><p>SUAS CAIXINHAS E REGRAS</p><h2>Como distribuir?</h2></div><FiEdit3 /></div>
            <p className="revisao-note">Escolha quais caixinhas participarão desta despesa. Somente as caixinhas marcadas terão suas regras aplicadas. Cada linha representa uma regra específica; editar aqui não altera a regra salva.</p>
            <section className="revisao-caixinhas-checklist" aria-labelledby="caixinhas-participantes-despesa">
              <div className="revisao-checklist-head"><div><p className="revisao-checklist-eyebrow">PARTICIPAÇÃO NESTA DESPESA</p><h3 id="caixinhas-participantes-despesa">Quais caixinhas vão participar?</h3></div><span className="revisao-checklist-count">{selecionadas.length}/{caixinhas.length}</span></div>
              <p className="revisao-checklist-description">Selecione as caixinhas que devem absorver esta despesa. As regras das demais serão ignoradas somente nesta despesa.</p>
              <div className="revisao-checklist-grid">
                {caixinhas.map((c) => {
                  const marcada=selecionadas.includes(c.id);
                  const qtd=linhas.filter((l)=>l.caixinhaId===c.id && l.regraDistribuicaoId).length;
                  return <label key={c.id} className={"revisao-caixinha-check"+(marcada?" is-selected":"")}>
                    <input type="checkbox" checked={marcada} onChange={()=>alternarCaixinha(c.id)}/>
                    <span className="revisao-caixinha-checkmark"><FiCheck /></span>
                    <span className="revisao-caixinha-copy"><strong>{c.nome}</strong><small>{qtd>0?qtd+(qtd===1?" regra ativa":" regras ativas"):"Sem regra automática"}</small></span>
                  </label>;
                })}
              </div>
            </section>
            {visiveis.length===0 ? <div className="revisao-empty"><FiInfo /><p>Nenhuma caixinha participará desta despesa. O valor ficará não alocado.</p></div> :
              visiveis.map((l)=><label className="revisao-linha" key={l.id}><span><strong>{l.nomeCaixinha}</strong><small>{l.nomeRegra}</small><small>Sugestão desta regra: {money(l.sugestaoCentavos)}</small></span><input aria-label={"Valor da regra "+l.nomeRegra+" para "+l.nomeCaixinha} inputMode="decimal" defaultValue={(l.valorCentavos/100).toFixed(2).replace(".",",")} onBlur={(e)=>editar(l.id,e.target.value)}/></label>)}
          </section>
        </section>
        <aside className="revisao-resumo">
          <p>RESUMO DA DESPESA</p>
          <div><span>Despesa</span><strong>{money(rascunho.valorCentavos)}</strong></div>
          <div><span>Distribuído</span><strong>{money(total)}</strong></div>
          <div className={naoAlocado<0?"danger":"highlight"}><span>Não alocado</span><strong>{money(naoAlocado)}</strong></div>
          {excedente>0&&!editada?<p className="revisao-alert">As sugestões automáticas ultrapassaram o valor disponível em {money(excedente)}. Ajuste os valores para continuar.</p>:null}
          <button className="button-primary receita-submit" type="button" disabled={inconsistente} onClick={continuar}>Continuar para confirmação <FiCheck /></button>
          <p className="revisao-note">A gravação da despesa acontece somente após a confirmação final.</p>
        </aside>
      </div>}
    </main>
    <BottomNavigation active="/movimentacoes" />
  </>;
}
