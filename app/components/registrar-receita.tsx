"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import { BottomNavigation } from "@/components/bottom-navigation";
import { parseMoneyToCents } from "@/domain/finance/money";
import { getDatabase } from "@/lib/persistence/database";
import type { Conta } from "@/lib/persistence/entities";

type ReceitaRascunho = {
  descricao: string;
  valorCentavos: number;
  dataMovimento: string;
  contaDestinoId: string;
};

export function RegistrarReceita() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [contas, setContas] = useState<Conta[]>([]);
  const [contaDestinoId, setContaDestinoId] = useState("");
  const [carregandoContas, setCarregandoContas] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let ativo = true;
    async function carregarContas() {
      try {
        const db = getDatabase();
        await db.open();
        const contasAtivas = await db.contas.filter((conta) => conta.ativa && conta.tipo === "bancaria").toArray();
        if (!ativo) return;
        setContas(contasAtivas);
        if (contasAtivas.length === 1) setContaDestinoId(contasAtivas[0].id);
      } catch {
        if (ativo) setErro("Não foi possível carregar as contas bancárias.");
      } finally {
        if (ativo) setCarregandoContas(false);
      }
    }
    void carregarContas();
    return () => { ativo = false; };
  }, []);

  function continuar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const textoDescricao = descricao.trim();
    if (!textoDescricao) {
      setErro("Informe uma descrição para a receita.");
      return;
    }

    if (!contaDestinoId) {
      setErro(contas.length === 0 ? "Cadastre uma conta bancária ativa antes de registrar uma receita." : "Selecione a conta que recebeu a receita.");
      return;
    }

    try {
      const valorCentavos = parseMoneyToCents(valor.trim());
      if (valorCentavos <= 0) {
        setErro("Informe um valor maior que zero.");
        return;
      }

      const rascunho: ReceitaRascunho = {
        descricao: textoDescricao,
        valorCentavos,
        dataMovimento: data,
        contaDestinoId,
      };

      sessionStorage.setItem("tangerina.receita.rascunho", JSON.stringify(rascunho));
      router.push("/receitas/revisar");
    } catch {
      setErro("Informe um valor válido, usando vírgula para os centavos.");
    }
  }

  return (
    <>
      <main className="app-shell receita-page">
        <header className="receita-header">
          <Link className="receita-back" href="/dashboard" aria-label="Voltar ao início">
            <FiArrowLeft aria-hidden="true" />
          </Link>
          <div>
            <p className="receita-eyebrow">NOVA MOVIMENTAÇÃO</p>
            <h1>Registrar <em>receita</em></h1>
          </div>
        </header>

        <div className="receita-layout">
          <section className="receita-hero">
            <span className="receita-hero__icon" aria-hidden="true">
              <FiDollarSign />
            </span>
            <div>
              <strong>Uma entrada de dinheiro.</strong>
              <p>
                Informe os dados e, em seguida, revise como ela será distribuída
                entre suas caixinhas.
              </p>
            </div>
          </section>

          <form className="receita-form" onSubmit={continuar}>
          <label className="field-group">
            <span className="field-label"><FiFileText aria-hidden="true" /> Descrição</span>
            <input
              className="text-input"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Ex.: Pagamento de cliente"
              autoFocus
              required
            />
          </label>

          <label className="field-group">
            <span className="field-label"><FiDollarSign aria-hidden="true" /> Valor recebido</span>
            <input
              className="text-input receita-value-input"
              inputMode="decimal"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              placeholder="0,00"
              required
            />
            <span className="field-hint">Use vírgula para os centavos.</span>
          </label>

          <label className="field-group">
            <span className="field-label">Conta que recebeu</span>
            <select className="text-input" value={contaDestinoId} onChange={(event) => setContaDestinoId(event.target.value)} disabled={carregandoContas || contas.length === 0} required>
              <option value="">{carregandoContas ? "Carregando contas..." : contas.length === 0 ? "Nenhuma conta bancária disponível" : "Selecione a conta"}</option>
              {contas.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome}{conta.instituicao ? ` — ${conta.instituicao}` : ""}</option>)}
            </select>
            <span className="field-hint">A receita aumenta o saldo desta conta; as caixinhas apenas organizam esse mesmo dinheiro.</span>
          </label>

          <label className="field-group">
            <span className="field-label"><FiCalendar aria-hidden="true" /> Data da receita</span>
            <input
              className="text-input"
              type="date"
              value={data}
              onChange={(event) => setData(event.target.value)}
              required
            />
          </label>

          {erro && (
            <p className="modal-form-error" role="alert">
              {erro}
            </p>
          )}

          <button className="button-primary receita-submit" type="submit">
            Continuar para revisão <FiArrowRight aria-hidden="true" />
          </button>
          </form>

          <aside className="receita-side" aria-label="Resumo do registro">
            <section className="receita-side-card">
              <p className="receita-side-card__label">PRÓXIMA ETAPA</p>
              <p className="receita-side-card__value">Revisar</p>
              <p className="receita-side-card__hint">
                O Tangerina calculará a sugestão usando suas regras de distribuição.
              </p>
            </section>

            <p className="receita-note">
              Nenhum dinheiro será registrado nesta etapa. Você poderá revisar a
              distribuição antes de confirmar.
            </p>
          </aside>
        </div>
      </main>
      <BottomNavigation active="/movimentacoes" />
    </>
  );
}
