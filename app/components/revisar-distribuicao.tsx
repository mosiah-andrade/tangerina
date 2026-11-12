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

type ReceitaRascunho = { descricao: string; valorCentavos: number; dataMovimento: string };
type Linha = { id: string; regraDistribuicaoId?: string; caixinhaId: string; nome: string; valorCentavos: number; sugestaoCentavos: number };
const KEY = "tangerina.receita.rascunho";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);
}

export function RevisarDistribuicao() {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<ReceitaRascunho | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [excedenteRegras, setExcedenteRegras] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [revisadaManualmente, setRevisadaManualmente] = useState(false);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const salvo = sessionStorage.getItem(KEY);
        if (!salvo) { router.replace("/receitas"); return; }
        const receita = JSON.parse(salvo) as ReceitaRascunho;
        const db = getDatabase();
        const regras = await criarRepositorioRegrasDistribuicao(db).listar();
        const caixinhas = await db.caixinhas.toArray();
        const inputs: DistributionRuleInput[] = regras.map((regra: RegraDistribuicao) => ({
          id: regra.id, ordem: regra.ordem, ativa: regra.ativa, tipoCalculo: regra.tipoCalculo,
          valorFixoCentavos: regra.tipoCalculo === "valor_fixo" ? regra.valorFixoCentavos : undefined,
          percentual: regra.tipoCalculo !== "valor_fixo" ? regra.percentual : undefined,
        }));
        const resultado = calcularDistribuicao(receita.valorCentavos, inputs);
        const porRegra = new Map(regras.map((regra) => [regra.id, regra]));
        const sugestoesPorCaixinha = new Map<string, { valorCentavos: number; regraDistribuicaoId?: string }>();
        for (const alocacao of resultado.alocacoes) {
          const regra = porRegra.get(alocacao.regraDistribuicaoId);
          if (!regra) continue;
          const atual = sugestoesPorCaixinha.get(regra.caixinhaId);
          sugestoesPorCaixinha.set(regra.caixinhaId, {
            valorCentavos: (atual?.valorCentavos ?? 0) + alocacao.valorCentavos,
            regraDistribuicaoId: atual?.regraDistribuicaoId ?? alocacao.regraDistribuicaoId,
          });
        }
        if (!ativo) return;
        setRascunho(receita);
        setExcedenteRegras(resultado.excedenteCentavos);
        setLinhas(
          caixinhas
            .filter((caixinha) => caixinha.ativa)
            .map((caixinha) => {
              const sugestao = sugestoesPorCaixinha.get(caixinha.id);
              return {
                id: caixinha.id,
                regraDistribuicaoId: sugestao?.regraDistribuicaoId,
                caixinhaId: caixinha.id,
                nome: caixinha.nome,
                valorCentavos: sugestao?.valorCentavos ?? 0,
                sugestaoCentavos: sugestao?.valorCentavos ?? 0,
              };
            }),
        );
      } catch { if (ativo) setErro("Não foi possível carregar as sugestões de distribuição."); }
      finally { if (ativo) setCarregando(false); }
    }
    void carregar();
    return () => { ativo = false; };
  }, [router]);

  const totalDistribuido = useMemo(() => linhas.reduce((total, linha) => total + linha.valorCentavos, 0), [linhas]);
  const naoAlocado = rascunho ? rascunho.valorCentavos - totalDistribuido : 0;
  // A confirmação valida a distribuição final editada pelo usuário.
  // Um excedente na sugestão automática é apenas um aviso sobre as regras.
  const inconsistente = naoAlocado < 0;

  function editarValor(id: string, texto: string) {
    try {
      const valorCentavos = texto.trim() === "" ? 0 : parseMoneyToCents(texto);
      if (valorCentavos < 0) throw new Error();
      setErro(null);
      setRevisadaManualmente(true);
      setLinhas((atuais) => atuais.map((linha) => linha.id === id ? { ...linha, valorCentavos } : linha));
    } catch { setErro("Informe um valor válido, usando vírgula para os centavos."); }
  }

  function continuar() {
    if (!rascunho || inconsistente) return;
    sessionStorage.setItem("tangerina.receita.revisao", JSON.stringify({ ...rascunho, alocacoes: linhas.filter((linha) => linha.valorCentavos > 0) }));
    router.push("/receitas/confirmar");
  }

  if (carregando) return <main className="app-shell receita-page"><p className="receita-loading">Calculando distribuição…</p></main>;

  return <>
    <main className="app-shell receita-page revisao-page">
      <header className="receita-header">
        <Link className="receita-back" href="/receitas" aria-label="Voltar para receita"><FiArrowLeft /></Link>
        <div><p className="receita-eyebrow">REVISÃO</p><h1>Revise a <em>distribuição</em></h1></div>
      </header>
      {erro ? <p className="modal-form-error" role="alert">{erro}</p> : null}
      {rascunho && <div className="revisao-layout">
        <section className="revisao-main">
          <article className="revisao-receita-card"><span>RECEITA</span><strong>{rascunho.descricao}</strong><b>{formatMoney(rascunho.valorCentavos)}</b></article>
          <section className="revisao-lista" aria-label="Sugestões de distribuição">
            <div className="revisao-section-head"><div><p>SUAS CAIXINHAS</p><h2>Como distribuir?</h2></div><FiEdit3 aria-hidden="true" /></div>
            {linhas.length === 0 ? <div className="revisao-empty"><FiInfo /><p>Nenhuma regra ativa sugeriu uma alocação. O valor permanecerá não alocado.</p></div> :
              linhas.map((linha) => <label className="revisao-linha" key={linha.id}><span><strong>{linha.nome}</strong><small>Sugestão: {formatMoney(linha.sugestaoCentavos)}</small></span><input aria-label={"Valor para " + linha.nome} inputMode="decimal" defaultValue={(linha.valorCentavos / 100).toFixed(2).replace(".", ",")} onBlur={(event) => editarValor(linha.id, event.target.value)} /></label>)}
          </section>
        </section>
        <aside className="revisao-resumo">
          <p>RESUMO DA DISTRIBUIÇÃO</p>
          <div><span>Receita</span><strong>{formatMoney(rascunho.valorCentavos)}</strong></div>
          <div><span>Distribuído</span><strong>{formatMoney(totalDistribuido)}</strong></div>
          <div className={naoAlocado < 0 ? "danger" : "highlight"}><span>Não alocado</span><strong>{formatMoney(naoAlocado)}</strong></div>
          {excedenteRegras > 0 && !revisadaManualmente && <p className="revisao-alert">As sugestões automáticas ultrapassaram o valor disponível em {formatMoney(excedenteRegras)}. Você pode ajustar os valores abaixo para continuar.</p>}
          <button className="button-primary receita-submit" type="button" disabled={inconsistente} onClick={continuar}>Confirmar distribuição <FiCheck aria-hidden="true" /></button>
          <p className="revisao-note">A confirmação definitiva e a gravação da receita acontecem na próxima etapa.</p>
        </aside>
      </div>}
    </main>
    <BottomNavigation active="/movimentacoes" />
  </>;
}
