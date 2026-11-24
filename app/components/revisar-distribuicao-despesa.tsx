"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiInfo } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { calcularDistribuicao, type DistributionRuleInput } from "@/domain/finance/distribution";
import { parseMoneyToCents } from "@/domain/finance/money";
import { getDatabase } from "@/lib/persistence/database";
import { calcularSaldoCaixinhaPorAlocacoes } from "@/lib/persistence/caixinhas/saldo";
import { criarRepositorioRegrasDistribuicao } from "@/lib/persistence/repositories";
import type { RegraDistribuicao } from "@/lib/persistence/entities";

type Rascunho = { descricao: string; categoria: string; valorCentavos: number; dataMovimento: string; contaOrigemId: string };
type Linha = { id: string; regraDistribuicaoId?: string; caixinhaId: string; nomeCaixinha: string; nomeRegra: string; valorCentavos: number; sugestaoCentavos: number };
type CaixinhaDespesa = { id: string; nome: string; saldoAtualCentavos: number };
const KEY = "tangerina.despesa.rascunho";
const REVISAO_KEY = "tangerina.despesa.revisao";
function money(value: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100); }

export function RevisarDistribuicaoDespesa() {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [caixinhas, setCaixinhas] = useState<CaixinhaDespesa[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
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
        const [regras, todasCaixinhas, alocacoesSalvas] = await Promise.all([
          criarRepositorioRegrasDistribuicao(db).listar(),
          db.caixinhas.toArray(),
          db.alocacoes.toArray(),
        ]);
        const ativas = todasCaixinhas.filter((c) => c.ativa);
        const regrasAtivas = regras
          .filter((r) => r.ativa && ativas.some((c) => c.id === r.caixinhaId))
          .sort((a, b) => a.ordem - b.ordem || a.createdAt.localeCompare(b.createdAt));
        const entradas: DistributionRuleInput[] = regrasAtivas.map((r: RegraDistribuicao) => ({
          id: r.id, ordem: r.ordem, ativa: r.ativa, tipoCalculo: r.tipoCalculo,
          valorFixoCentavos: r.tipoCalculo === "valor_fixo" ? r.valorFixoCentavos : undefined,
          percentual: r.tipoCalculo !== "valor_fixo" ? r.percentual : undefined,
        }));
        const resultado = calcularDistribuicao(despesa.valorCentavos, entradas);
        const sugestoes = new Map(resultado.alocacoes.map((a) => [a.regraDistribuicaoId, a.valorCentavos]));
        const comRegra = new Set(regrasAtivas.map((r) => r.caixinhaId));
        if (!ativo) return;
        setRascunho(despesa);
        setCaixinhas(ativas.map((c) => ({
          id: c.id, nome: c.nome,
          saldoAtualCentavos: calcularSaldoCaixinhaPorAlocacoes(c, alocacoesSalvas),
        })));
        setSelecionadas(ativas.map((c) => c.id));
        setLinhas([
          ...regrasAtivas.map((r) => {
            const c = ativas.find((x) => x.id === r.caixinhaId)!;
            const sugestao = sugestoes.get(r.id) ?? 0;
            return { id: r.id, regraDistribuicaoId: r.id, caixinhaId: r.caixinhaId, nomeCaixinha: c.nome, nomeRegra: r.nome, valorCentavos: sugestao, sugestaoCentavos: sugestao };
          }),
          ...ativas.filter((c) => !comRegra.has(c.id)).map((c) => ({
            id: "manual-" + c.id, caixinhaId: c.id, nomeCaixinha: c.nome,
            nomeRegra: "Distribuição manual", valorCentavos: 0, sugestaoCentavos: 0,
          })),
        ]);
      } catch {
        if (ativo) setErro("Não foi possível carregar as regras e caixinhas.");
      } finally { if (ativo) setCarregando(false); }
    }
    void carregar();
    return () => { ativo = false; };
  }, [router]);

  const valoresPorCaixinha = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const linha of linhas) mapa.set(linha.caixinhaId, (mapa.get(linha.caixinhaId) ?? 0) + linha.valorCentavos);
    return mapa;
  }, [linhas]);
  const sugestoesPorCaixinha = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const linha of linhas) mapa.set(linha.caixinhaId, (mapa.get(linha.caixinhaId) ?? 0) + linha.sugestaoCentavos);
    return mapa;
  }, [linhas]);
  const total = useMemo(() => caixinhas.filter((c) => selecionadas.includes(c.id)).reduce((s, c) => s + (valoresPorCaixinha.get(c.id) ?? 0), 0), [caixinhas, selecionadas, valoresPorCaixinha]);
  const naoAlocado = (rascunho?.valorCentavos ?? 0) - total;
  const inconsistente = naoAlocado < 0;

  function alternarCaixinha(id: string) {
    const marcada = selecionadas.includes(id);
    setSelecionadas((atuais) => marcada ? atuais.filter((atual) => atual !== id) : [...atuais, id]);
  }

  function editarCaixinha(id: string, texto: string) {
    try {
      const cents = texto.trim() === "" ? 0 : parseMoneyToCents(texto);
      if (cents < 0) throw new Error();
      setErro(null);
      setEditada(true);
      setLinhas((atuais) => {
        const daCaixinha = atuais.filter((l) => l.caixinhaId === id);
        if (daCaixinha.length === 0) return atuais;
        const primeiraId = daCaixinha[0].id;
        return atuais.map((linha) => linha.caixinhaId !== id ? linha : {
          ...linha, valorCentavos: linha.id === primeiraId ? cents : 0,
        });
      });
    } catch { setErro("Informe um valor válido, usando vírgula para os centavos."); }
  }

  function continuar() {
    if (!rascunho || inconsistente) return;
    const alocacoes = caixinhas
      .filter((c) => selecionadas.includes(c.id))
      .map((c) => {
        const daCaixinha = linhas.filter((l) => l.caixinhaId === c.id);
        const valorCentavos = valoresPorCaixinha.get(c.id) ?? 0;
        const primeira = daCaixinha[0];
        return primeira && valorCentavos > 0 ? {
          id: primeira.id, regraDistribuicaoId: primeira.regraDistribuicaoId,
          caixinhaId: c.id, nomeCaixinha: c.nome,
          nomeRegra: daCaixinha.length > 1 ? "Distribuição ajustada" : primeira.nomeRegra,
          valorCentavos, sugestaoCentavos: sugestoesPorCaixinha.get(c.id) ?? 0,
        } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    sessionStorage.setItem(REVISAO_KEY, JSON.stringify({ ...rascunho, alocacoes }));
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
      {rascunho && <div className="revisao-layout revisao-layout--despesa">
        <article className="revisao-receita-card"><span>DESPESA</span><strong>{rascunho.descricao}</strong><b>{money(rascunho.valorCentavos)}</b></article>
        <section className="revisao-lista revisao-distribuicao-direta" aria-label="Distribuição da despesa">
          <div className="revisao-section-head"><div><p>SUAS CAIXINHAS</p><h2>Como distribuir?</h2></div></div>
          <p className="revisao-note">Marque as caixinhas e informe quanto desta despesa será descontado de cada uma.</p>
          <div className="revisao-direta-lista ">
            {caixinhas.map((c) => {
              const marcada = selecionadas.includes(c.id);
              const sugestao = sugestoesPorCaixinha.get(c.id) ?? 0;
              const valor = valoresPorCaixinha.get(c.id) ?? 0;
              return <div key={c.id} className={"revisao-direta-item " + (marcada ? " is-selected" : "")}>
                <label className="revisao-direta-selecao p-8" aria-label={"Selecionar caixinha " + c.nome}>
                  <input type="checkbox" checked={marcada} onChange={() => alternarCaixinha(c.id)} />
                  <span className="revisao-caixinha-checkmark"><FiCheck /></span>
                  <span><strong>{c.nome}</strong><small>Saldo atual: {money(c.saldoAtualCentavos)}</small></span>
                </label>
                {marcada ? <label className="revisao-direta-valor pr-8" aria-label={"Valor da despesa em " + c.nome}>
                  <span>Valor</span>
                  <input aria-label={"Valor da despesa em " + c.nome} inputMode="decimal" defaultValue={(valor / 100).toFixed(2).replace(".", ",")} key={c.id + "-" + valor} onBlur={(e) => editarCaixinha(c.id, e.target.value)} />
                  {sugestao > 0 && !editada ? <small>Sugestão: {money(sugestao)}</small> : null}
                </label> : <span className="revisao-direta-ignorada pr-8">Não participa</span>}
              </div>;
            })}
          </div>
        </section>
        <div className="revisao-distribuicao-compacta" aria-live="polite">
          <span>Distribuído: <strong>{money(total)}</strong></span>
          <span>Não alocado: <strong>{money(naoAlocado)}</strong></span>
        </div>
        <button className="button-primary receita-submit" type="button" disabled={inconsistente || Boolean(erro)} onClick={continuar}>Continuar para confirmação <FiCheck /></button>
      </div>}
    </main>
    <BottomNavigation active="/movimentacoes" />
  </>;
}
