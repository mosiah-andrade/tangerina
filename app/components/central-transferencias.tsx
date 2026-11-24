"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiRepeat, FiPlus } from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { formatMoneyFromCents } from "@/lib/format-money";
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

  return (
    <>
      <main className="app-shell transferencias-page">
        <header className="app-header">
          <Link className="transferencias-back" href="/dashboard" aria-label="Voltar ao início">←</Link>
          <span className="context-label">MOVIMENTAÇÕES</span>
        </header>

        <section className="transferencias-intro">
          <div>
            <p>ORGANIZAÇÃO DO DINHEIRO</p>
            <h1>Transferências</h1>
            <span>Consulte e acompanhe as movimentações entre seus espaços financeiros.</span>
          </div>
          <Link href="/caixinhas" className="transferencias-new-button">
            <FiPlus size={17} />
            Nova transferência
          </Link>
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
                  <tr><th>Origem</th><th></th><th>Destino</th><th>Data</th><th>Status</th><th className="transferencias-table-value">Valor</th></tr>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <BottomNavigation active="/transferencias" />
    </>
  );
}
