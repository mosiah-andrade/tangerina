"use client";

import { FiDatabase, FiRefreshCw, FiRotateCcw } from "react-icons/fi";
import { useDemonstracao } from "@/hooks/use-demonstracao";

export function DemoDataControls() {
  const { estado, isLoading, error, carregar, resetar } = useDemonstracao();

  const dadosCarregados = estado?.status === "loaded";

  return (
    <section className="demo-data-controls" aria-labelledby="demo-data-title">
      <div className="demo-data-controls__header">
        <span className="demo-data-controls__icon" aria-hidden="true">
          <FiDatabase size={20} />
        </span>

        <div>
          <strong id="demo-data-title">Dados de demonstração</strong>
          <p>
            Use este cenário para visualizar o funcionamento do Tangerina com
            dados financeiros de exemplo.
          </p>
        </div>
      </div>

      <div className="demo-data-controls__status pointer" aria-live="polite">
        {isLoading ? (
          <>
            <FiRefreshCw
              className="demo-data-controls__spinner"
              size={16}
              aria-hidden="true"
            />
            <span>Verificando dados...</span>
          </>
        ) : dadosCarregados ? (
          <span>✓ Dados de demonstração carregados</span>
        ) : (
          <span>Nenhum dado de demonstração carregado</span>
        )}
      </div>

      {error && (
        <p className="demo-data-controls__error" role="alert">
          {error.message}
        </p>
      )}

      <div className="demo-data-controls__actions pointer">
        <button
          className="button-primary pointer"
          type="button"
          onClick={() => void carregar()}
          disabled={isLoading || dadosCarregados}
        >
          <FiDatabase size={17} aria-hidden="true" className="pointer" />
          Carregar demonstração
        </button>

        <button
          className="button-secondary"
          type="button"
          onClick={() => void resetar()}
          disabled={isLoading || !dadosCarregados}
        >
          <FiRotateCcw size={17} aria-hidden="true" />
          Resetar dados
        </button>
      </div>
    </section>
  );
}
