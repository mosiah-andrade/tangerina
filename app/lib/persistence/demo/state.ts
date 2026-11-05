import type { TangerinaDatabase } from "../database";

export type StatusDadosDemonstracao = "not_loaded" | "loaded";

export interface EstadoDadosDemonstracao {
  status: StatusDadosDemonstracao;
  loadedAt: string | null;
}

const CHAVE_STATUS = "demo.status";
const CHAVE_LOADED_AT = "demo.loadedAt";

export async function obterEstadoDadosDemonstracao(
  db: TangerinaDatabase,
): Promise<EstadoDadosDemonstracao> {
  const [statusMetadata, loadedAtMetadata] = await Promise.all([
    db.metadata.get(CHAVE_STATUS),
    db.metadata.get(CHAVE_LOADED_AT),
  ]);

  const status =
    statusMetadata?.valor === "loaded" ? "loaded" : "not_loaded";

  const loadedAt =
    typeof loadedAtMetadata?.valor === "string"
      ? loadedAtMetadata.valor
      : null;

  return {
    status,
    loadedAt: status === "loaded" ? loadedAt : null,
  };
}
