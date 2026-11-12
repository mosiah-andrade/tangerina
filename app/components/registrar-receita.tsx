"use client";

import { useState } from "react";
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

type ReceitaRascunho = {
  descricao: string;
  valorCentavos: number;
  dataMovimento: string;
};

export function RegistrarReceita() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [erro, setErro] = useState<string | null>(null);

  function continuar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const textoDescricao = descricao.trim();
    if (!textoDescricao) {
      setErro("Informe uma descrição para a receita.");
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
      };

      sessionStorage.setItem("tangerina.receita.rascunho", JSON.stringify(rascunho));
      window.location.assign("/receitas/revisar");
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

        <section className="receita-hero">
          <span className="receita-hero__icon" aria-hidden="true">
            <FiDollarSign />
          </span>
          <div>
            <strong>Uma entrada de dinheiro.</strong>
            <p>Informe os dados e, em seguida, revise como ela será distribuída.</p>
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

        <p className="receita-note">
          Nenhum dinheiro será registrado nesta etapa. Você poderá revisar a distribuição antes de confirmar.
        </p>
      </main>
      <BottomNavigation active="/movimentacoes" />
    </>
  );
}
