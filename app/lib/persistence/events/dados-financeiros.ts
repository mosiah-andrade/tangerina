export const EVENTO_DADOS_FINANCEIROS_ATUALIZADOS =
  "tangerina:dados-financeiros-atualizados";

export function notificarDadosFinanceirosAtualizados() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(EVENTO_DADOS_FINANCEIROS_ATUALIZADOS));
}
