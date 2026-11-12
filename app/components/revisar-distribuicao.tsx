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

type ReceitaRascunho = { descricao: string; valorCentavos: number; dataMovimento: string; contaDestinoId: string };
type Linha = { id: string; regraDistribuicaoId?: string; caixinhaId: string; nomeCaixinha: string; nomeRegra: string; valorCentavos: number; sugestaoCentavos: number };
const KEY = "tangerina.receita.rascunho";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);
}

export function RevisarDistribuicao() {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<ReceitaRascunho | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [caixinhasDisponiveis, setCaixinhasDisponiveis] = useState<Array<{ id: string; nome: string }>>([]);
  const [caixinhasSelecionadas, setCaixinhasSelecionadas] = useState<string[]>([]);
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
        const sugestaoPorRegra = new Map(
          resultado.alocacoes.map((alocacao) => [
            alocacao.regraDistribuicaoId,
            alocacao.valorCentavos,
          ]),
        );
        const caixinhasAtivas = caixinhas.filter((caixinha) => caixinha.ativa);
        const regrasAtivas = regras
          .filter((regra) => regra.ativa && caixinhasAtivas.some((caixinha) => caixinha.id === regra.caixinhaId))
          .sort((a, b) => a.ordem - b.ordem || a.createdAt.localeCompare(b.createdAt));
        const caixinhasComRegra = new Set(regrasAtivas.map((regra) => regra.caixinhaId));

        if (!ativo) return;
        setRascunho(receita);
        setCaixinhasDisponiveis(caixinhasAtivas.map((caixinha) => ({ id: caixinha.id, nome: caixinha.nome })));
        setCaixinhasSelecionadas(caixinhasAtivas.map((caixinha) => caixinha.id));
        setExcedenteRegras(resultado.excedenteCentavos);
        setLinhas([
          ...regrasAtivas.map((regra) => {
            const caixinha = caixinhasAtivas.find((item) => item.id === regra.caixinhaId);
            const sugestaoCentavos = sugestaoPorRegra.get(regra.id) ?? 0;
            return {
              id: regra.id,
              regraDistribuicaoId: regra.id,
              caixinhaId: regra.caixinhaId,
              nomeCaixinha: caixinha?.nome ?? "Caixinha",
              nomeRegra: regra.nome,
              valorCentavos: sugestaoCentavos,
              sugestaoCentavos,
            };
          }),
          ...caixinhasAtivas
            .filter((caixinha) => !caixinhasComRegra.has(caixinha.id))
            .map((caixinha) => ({
              id: `manual-${caixinha.id}`,
              caixinhaId: caixinha.id,
              nomeCaixinha: caixinha.nome,
              nomeRegra: "Sem regra automática",
              valorCentavos: 0,
              sugestaoCentavos: 0,
            })),
        ]);
      } catch { if (ativo) setErro("Não foi possível carregar as sugestões de distribuição."); }
      finally { if (ativo) setCarregando(false); }
    }
    void carregar();
    return () => { ativo = false; };
  }, [router]);

  const linhasVisiveis = useMemo(
    () => linhas.filter((linha) => caixinhasSelecionadas.includes(linha.caixinhaId)),
    [linhas, caixinhasSelecionadas],
  );
  const totalDistribuido = useMemo(() => linhasVisiveis.reduce((total, linha) => total + linha.valorCentavos, 0), [linhasVisiveis]);
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
    sessionStorage.setItem("tangerina.receita.revisao", JSON.stringify({ ...rascunho, alocacoes: linhasVisiveis.filter((linha) => linha.valorCentavos > 0) }));
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
            <div className="revisao-section-head"><div><p>SUAS CAIXINHAS E REGRAS</p><h2>Como distribuir?</h2></div><FiEdit3 aria-hidden="true" /></div>
            <p className="revisao-note">Escolha primeiro quais caixinhas participarão desta receita. Somente as caixinhas marcadas terão suas regras aplicadas. Cada linha representa uma regra específica; editar aqui não altera a regra salva.</p>
            <fieldset className="revisao-caixinhas-checklist">
              <legend>Caixinhas que vão receber nesta receita</legend>
              {caixinhasDisponiveis.map((caixinha) => {
                const marcada = caixinhasSelecionadas.includes(caixinha.id);
                return <label key={caixinha.id} className="revisao-caixinha-check">
                  <input type="checkbox" checked={marcada} onChange={() => setCaixinhasSelecionadas((atuais) => marcada ? atuais.filter((id) => id !== caixinha.id) : [...atuais, caixinha.id])} />
                  <span>{caixinha.nome}</span>
                </label>;
              })}
            </fieldset>
            {linhasVisiveis.length === 0 ? <div className="revisao-empty"><FiInfo /><p>Nenhuma caixinha ativa está disponível para distribuição.</p></div> :
              linhasVisiveis.map((linha) => <label className="revisao-linha" key={linha.id}><span><strong>{linha.nomeCaixinha}</strong><small>{linha.nomeRegra}</small><small>Sugestão desta regra: {formatMoney(linha.sugestaoCentavos)}</small></span><input aria-label={"Valor da regra " + linha.nomeRegra + " para " + linha.nomeCaixinha} inputMode="decimal" defaultValue={(linha.valorCentavos / 100).toFixed(2).replace(".", ",")} onBlur={(event) => editarValor(linha.id, event.target.value)} /></label>)}
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
