"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiRepeat, FiPlus, FiX, FiMoreHorizontal } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { formatMoneyFromCents } from "@/lib/format-money";
import { parseMoneyToCents } from "@/domain/finance/money";
import { listarCaixinhasComSaldo, type CaixinhaComSaldo } from "@/lib/persistence/caixinhas/listar";
import {
  transferirEntreCaixinhas,
  editarTransferenciaEntreCaixinhas,
  cancelarTransferenciaEntreCaixinhas,
} from "@/lib/persistence/caixinhas/transferir";
import { getDatabase } from "@/lib/persistence/database";
import type { Alocacao, Caixinha, Movimento } from "@/lib/persistence/entities";

type TransferenciaHistorico = {
  movimento: Movimento;
  origem: string;
  destino: string;
};

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-").map(Number);
  if (!ano || !mes || !dia) return data;
  return new Intl.DateTimeFormat("pt-BR").format(new Date(ano, mes - 1, dia));
}

export function CentralTransferencias() {
  const [historico, setHistorico] = useState<TransferenciaHistorico[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [caixinhas, setCaixinhas] = useState<CaixinhaComSaldo[]>([]);
  const [origemId, setOrigemId] = useState("");
  const [destinoId, setDestinoId] = useState("");
  const [valor, setValor] = useState("0,00");
  const [data, setData] = useState(new Date().toLocaleDateString("en-CA"));
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [transferenciaEditando, setTransferenciaEditando] = useState<TransferenciaHistorico | null>(null);
  const [origemEdicaoId, setOrigemEdicaoId] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const db = getDatabase();
        await db.open();
        const [movimentos, alocacoes, caixinhas] = await Promise.all([
          db.movimentos.where("tipo").equals("transferencia_caixinhas").toArray(),
          db.alocacoes.toArray(),
          db.caixinhas.toArray(),
        ]);

        const nomes = new Map<string, string>(
          (caixinhas as Caixinha[]).map((caixinha) => [caixinha.id, caixinha.nome] as const),
        );
        const alocacoesPorMovimento = new Map<string, Alocacao[]>();
        for (const alocacao of alocacoes) {
          const grupo = alocacoesPorMovimento.get(alocacao.movimentoId) ?? [];
          grupo.push(alocacao);
          alocacoesPorMovimento.set(alocacao.movimentoId, grupo);
        }

        const itens = (movimentos as Movimento[])
          .map((movimento) => {
            const relacionadas = alocacoesPorMovimento.get(movimento.id) ?? [];
            const origem = relacionadas.find((item) => item.tipo === "transferencia_saida");
            const destino = relacionadas.find((item) => item.tipo === "transferencia_entrada");
            return {
              movimento,
              origem: origem ? nomes.get(origem.caixinhaId) ?? "Caixinha excluída" : "Origem indisponível",
              destino: destino ? nomes.get(destino.caixinhaId) ?? "Caixinha excluída" : "Destino indisponível",
            };
          })
          .sort((a, b) =>
            b.movimento.dataMovimento.localeCompare(a.movimento.dataMovimento) ||
            b.movimento.createdAt.localeCompare(a.movimento.createdAt),
          );

        if (ativo) setHistorico(itens);
      } catch {
        if (ativo) setErro("Não foi possível carregar o histórico de transferências.");
      }
    }

    void carregar();
    return () => { ativo = false; };
  }, []);

  async function recarregarHistorico() {
    const db = getDatabase();
    await db.open();
    const [movimentos, alocacoes, listaCaixinhas] = await Promise.all([
      db.movimentos.where("tipo").equals("transferencia_caixinhas").toArray(),
      db.alocacoes.toArray(),
      db.caixinhas.toArray(),
    ]);
    const nomes = new Map((listaCaixinhas as Caixinha[]).map((item) => [item.id, item.nome] as const));
    const porMovimento = new Map<string, Alocacao[]>();
    for (const alocacao of alocacoes) {
      const grupo = porMovimento.get(alocacao.movimentoId) ?? [];
      grupo.push(alocacao);
      porMovimento.set(alocacao.movimentoId, grupo);
    }
    setHistorico((movimentos as Movimento[]).map((movimento) => {
      const relacionadas = porMovimento.get(movimento.id) ?? [];
      const origem = relacionadas.find((item) => item.tipo === "transferencia_saida");
      const destino = relacionadas.find((item) => item.tipo === "transferencia_entrada");
      return {
        movimento,
        origem: origem ? nomes.get(origem.caixinhaId) ?? "Caixinha excluída" : "Origem indisponível",
        destino: destino ? nomes.get(destino.caixinhaId) ?? "Caixinha excluída" : "Destino indisponível",
      };
    }).sort((a, b) => b.movimento.dataMovimento.localeCompare(a.movimento.dataMovimento) || b.movimento.createdAt.localeCompare(a.movimento.createdAt)));
  }

  async function abrirEdicao(item: TransferenciaHistorico) {
    setMenuAbertoId(null);
    setErroModal(null);
    try {
      const db = getDatabase();
      await db.open();
      const lista = await listarCaixinhasComSaldo(db);
      const alocacoes = await db.alocacoes.where("movimentoId").equals(item.movimento.id).toArray();
      const saida = alocacoes.find((a) => a.tipo === "transferencia_saida");
      const entrada = alocacoes.find((a) => a.tipo === "transferencia_entrada");
      if (!saida || !entrada) throw new Error("Não foi possível localizar os registros vinculados.");
      setCaixinhas(lista);
      setOrigemEdicaoId(saida.caixinhaId);
      setOrigemId(saida.caixinhaId);
      setDestinoId(entrada.caixinhaId);
      setValor((item.movimento.valorCentavos / 100).toFixed(2).replace(".", ","));
      setData(item.movimento.dataMovimento);
      setTransferenciaEditando(item);
      setMostrarModal(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível abrir a edição.");
    }
  }

  async function cancelarTransferencia(item: TransferenciaHistorico) {
    setMenuAbertoId(null);
    if (!window.confirm("Deseja cancelar esta transferência? Os dois registros serão revertidos.")) return;
    try {
      const db = getDatabase();
      await db.open();
      const resultado = await cancelarTransferenciaEntreCaixinhas(db, { registroId: item.movimento.id });
      if (resultado.saldoDestinoProjetadoCentavos < 0) {
        const confirmado = window.confirm(
          `A reversão deixará a caixinha de destino com saldo de ${formatMoneyFromCents(resultado.saldoDestinoProjetadoCentavos)}. Deseja confirmar mesmo assim?`,
        );
        if (!confirmado) return;
        await cancelarTransferenciaEntreCaixinhas(db, {
          registroId: item.movimento.id,
          confirmarSaldoNegativo: true,
        });
      }
      await recarregarHistorico();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível cancelar a transferência.");
    }
  }

  async function abrirNovaTransferencia() {
    setTransferenciaEditando(null);
    setErroModal(null);
    setOrigemId("");
    setDestinoId("");
    setValor("0,00");
    setData(new Date().toLocaleDateString("en-CA"));
    try {
      const db = getDatabase();
      await db.open();
      setCaixinhas(await listarCaixinhasComSaldo(db));
      setMostrarModal(true);
    } catch {
      setErroModal("Não foi possível carregar suas caixinhas.");
      setMostrarModal(true);
    }
  }

  const origemSelecionada = caixinhas.find((item) => item.caixinha.id === origemId);
  const destinos = caixinhas.filter((item) => item.caixinha.ativa && item.caixinha.id !== origemId);

  async function confirmarTransferencia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroModal(null);
    setSalvando(true);
    try {
      const db = getDatabase();
      await db.open();
      if (transferenciaEditando) {
        await editarTransferenciaEntreCaixinhas(db, {
          registroId: transferenciaEditando.movimento.id,
          caixinhaDestinoId: destinoId,
          valorCentavos: parseMoneyToCents(valor.trim()),
          dataMovimento: data,
          descricao: transferenciaEditando.movimento.descricao,
        });
      } else {
        await transferirEntreCaixinhas(db, {
        caixinhaOrigemId: origemId,
        caixinhaDestinoId: destinoId,
        valorCentavos: parseMoneyToCents(valor.trim()),
        dataMovimento: data,
        idempotencyKey: crypto.randomUUID(),
        });
      }
      setMostrarModal(false);
      setTransferenciaEditando(null);
      await recarregarHistorico();
    } catch (error) {
      setErroModal(error instanceof Error ? error.message : "Não foi possível realizar a transferência.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <main className="app-shell transferencias-page">
        <header className="app-header">
          <Link className="transferencias-back" href="/dashboard" aria-label="Voltar ao início">←</Link>
        </header>

        <section className="transferencias-intro">
          <div>
            <p>ORGANIZAÇÃO DO DINHEIRO</p>
            <h1>Transferências</h1>
            <span>Consulte e acompanhe as movimentações entre seus espaços financeiros.</span>
          </div>
          <button type="button" onClick={() => void abrirNovaTransferencia()} className="transferencias-new-button">
            <FiPlus size={17} />
            Nova transferência
          </button>
        </section>

        <section className="transferencias-history" aria-labelledby="transferencias-history-title">
          <div className="transferencias-history-heading">
            <div>
              <p>ACOMPANHAMENTO</p>
              <h2 id="transferencias-history-title">Histórico de transferências</h2>
            </div>
            <span>{historico?.length ?? 0} registros</span>
          </div>

          {erro ? (
            <div className="transferencias-state" role="alert">{erro}</div>
          ) : historico === null ? (
            <div className="transferencias-state" aria-live="polite">Carregando transferências...</div>
          ) : historico.length === 0 ? (
            <div className="transferencias-empty">
              <span><FiClock size={22} /></span>
              <strong>Nenhuma transferência por aqui ainda.</strong>
              <p>Quando você mover valores entre caixinhas, os registros aparecerão nesta lista.</p>
            </div>
          ) : (
            <div className="transferencias-table-wrap">
              <table className="transferencias-table">
                <thead>
                  <tr><th>Origem</th><th></th><th>Destino</th><th>Data</th><th>Status</th><th className="transferencias-table-value">Valor</th><th></th></tr>
                </thead>
                <tbody>
                  {historico.map(({ movimento, origem, destino }) => (
                    <tr key={movimento.id}>
                      <td><span className="transferencias-account"><span className="transferencias-table-icon"><FiRepeat size={15} /></span>{origem}</span></td>
                      <td className="transferencias-table-arrow"><FiArrowRight size={15} /></td>
                      <td>{destino}</td>
                      <td>{formatarData(movimento.dataMovimento)}</td>
                      <td><span className={movimento.status === "cancelado" ? "transferencia-status transferencia-status--cancelled" : "transferencia-status"}>{movimento.status === "cancelado" ? "Cancelada" : movimento.status === "confirmado" ? "Concluída" : "Pendente"}</span></td>
                      <td className="transferencias-table-value">{formatMoneyFromCents(movimento.valorCentavos)}</td>
                      <td className="transferencias-row-actions">
                        {movimento.status === "confirmado" && (
                          <div className="transferencias-row-menu">
                            <button type="button" className="transferencias-more-button" aria-label="Ações da transferência" aria-expanded={menuAbertoId === movimento.id} onClick={() => setMenuAbertoId(menuAbertoId === movimento.id ? null : movimento.id)}>
                              <FiMoreHorizontal size={18} />
                            </button>
                            {menuAbertoId === movimento.id && (
                              <div className="transferencias-menu" role="menu">
                                <button type="button" role="menuitem" onClick={() => void abrirEdicao({ movimento, origem, destino })}>Editar transferência</button>
                                <button type="button" role="menuitem" onClick={() => void cancelarTransferencia({ movimento, origem, destino })}>Cancelar transferência</button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {mostrarModal && (
        <div className="caixinhas-modal-backdrop" role="presentation">
          <section className="caixinhas-modal" role="dialog" aria-modal="true" aria-labelledby="central-transferencia-title">
            <button className="caixinhas-modal__close" type="button" onClick={() => { setMostrarModal(false); setTransferenciaEditando(null); }} aria-label="Fechar" disabled={salvando}><FiX /></button>
            <p className="caixinhas-modal__eyebrow">MOVIMENTAÇÃO INTERNA</p>
            <h2 id="central-transferencia-title">{transferenciaEditando ? "Editar transferência" : "Transferir entre caixinhas"}</h2>
            <form onSubmit={confirmarTransferencia}>
              <label className="field-group">
                <span className="field-label">1. De qual caixinha?</span>
                <select className="text-input" value={origemId} disabled={Boolean(transferenciaEditando)} onChange={(event) => { setOrigemId(event.target.value); setDestinoId(""); }} required>
                  <option value="">Selecione a origem</option>
                  {caixinhas.filter((item) => item.caixinha.ativa).map((item) => <option key={item.caixinha.id} value={item.caixinha.id} disabled={item.saldoAtualCentavos <= 0}>{item.caixinha.nome} — {formatMoneyFromCents(item.saldoAtualCentavos)}</option>)}
                </select>
                {origemSelecionada && <span className="field-hint">Disponível: {formatMoneyFromCents(Math.max(0, origemSelecionada.saldoAtualCentavos))}</span>}
              </label>
              <label className="field-group">
                <span className="field-label">2. Para qual caixinha?</span>
                <select className="text-input" value={destinoId} onChange={(event) => setDestinoId(event.target.value)} required disabled={!origemId}>
                  <option value="">{origemId ? "Selecione o destino" : "Escolha primeiro a origem"}</option>
                  {destinos.map((item) => <option key={item.caixinha.id} value={item.caixinha.id}>{item.caixinha.nome} — {formatMoneyFromCents(item.saldoAtualCentavos)}</option>)}
                </select>
              </label>
              <label className="field-group">
                <span className="field-label">Valor da transferência</span>
                <input className="text-input transferencia-valor" inputMode="decimal" value={valor} onChange={(event) => setValor(event.target.value)} required />
                {origemSelecionada && origemSelecionada.saldoAtualCentavos > 0 && <button className="transferencia-tudo" type="button" onClick={() => setValor((origemSelecionada.saldoAtualCentavos / 100).toFixed(2).replace(".", ","))}>Transferir todo o saldo disponível</button>}
              </label>
              <label className="field-group"><span className="field-label">Data</span><input className="text-input" type="date" value={data} onChange={(event) => setData(event.target.value)} required /></label>
              <p className="caixinhas-note">A transferência altera somente os saldos virtuais das caixinhas. Não movimenta suas contas bancárias nem altera seu patrimônio total.</p>
              {erroModal && <p className="caixinhas-error" role="alert">{erroModal}</p>}
              <div className="caixinhas-modal__actions">
                <button className="button-secondary" type="button" onClick={() => { setMostrarModal(false); setTransferenciaEditando(null); }} disabled={salvando}>Cancelar</button>
                <button className="button-primary" type="submit" disabled={salvando || !origemId || !destinoId}>{salvando ? "Salvando..." : transferenciaEditando ? "Salvar alterações" : "Confirmar transferência"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      <BottomNavigation active="/transferencias" />
    </>
  );
}
