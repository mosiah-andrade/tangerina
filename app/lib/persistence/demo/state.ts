import type { TangerinaDatabase } from "../database";

export type StatusDadosDemonstracao = "not_loaded" | "loaded";

export interface EstadoDadosDemonstracao {
  status: StatusDadosDemonstracao;
  loadedAt: string | null;
}

export const CHAVE_STATUS_DEMO = "demo.status";
export const CHAVE_LOADED_AT_DEMO = "demo.loadedAt";

export async function obterEstadoDadosDemonstracao(
  db: TangerinaDatabase,
): Promise<EstadoDadosDemonstracao> {
  const [statusMetadata, loadedAtMetadata] = await Promise.all([
    db.metadados.get(CHAVE_STATUS_DEMO),
    db.metadados.get(CHAVE_LOADED_AT_DEMO),
  ]);

  const status = statusMetadata?.valor === "loaded" ? "loaded" : "not_loaded";

  const loadedAt =
    typeof loadedAtMetadata?.valor === "string" ? loadedAtMetadata.valor : null;

  return {
    status,
    loadedAt: status === "loaded" ? loadedAt : null,
  };
}
