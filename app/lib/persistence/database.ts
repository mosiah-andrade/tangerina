import Dexie, { type Table } from "dexie";

/**
 * Tipos estruturais mínimos da camada de persistência.
 * Os contratos completos das entidades permanecem em app/domain.
 */
export interface IdentifiedRecord {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetadataRecord {
  chave: string;
  valor: unknown;
}

export class TangerinaDatabase extends Dexie {
  contas!: Table<IdentifiedRecord, string>;
  caixinhas!: Table<IdentifiedRecord, string>;
  movimentos!: Table<IdentifiedRecord, string>;
  efeitosSaldo!: Table<IdentifiedRecord, string>;
  alocacoes!: Table<IdentifiedRecord, string>;
  regrasDistribuicao!: Table<IdentifiedRecord, string>;
  contasPagar!: Table<IdentifiedRecord, string>;
  recorrencias!: Table<IdentifiedRecord, string>;
  metas!: Table<IdentifiedRecord, string>;
  aportesMeta!: Table<IdentifiedRecord, string>;
  auditorias!: Table<IdentifiedRecord, string>;
  metadados!: Table<MetadataRecord, string>;

  constructor() {
    super("tangerina-financeiro");

    this.version(1).stores({
      contas: "id,tipo,ativa",
      caixinhas: "id,ativa",
      movimentos:
        "id,tipo,status,dataMovimento,contaOrigemId,contaDestinoId,&idempotencyKey",
      efeitosSaldo: "id,movimentoId,[tipoAlvo+alvoId],alvoId",
      alocacoes: "id,movimentoId,caixinhaId,regraDistribuicaoId",
      regrasDistribuicao: "id,caixinhaId,[caixinhaId+ordem],ativa",
      recorrencias: "id,ativa,contaId",
      contasPagar: "id,recorrenciaId,dataVencimento,status,&chaveOcorrencia",
      metas: "id,caixinhaId,ativa",
      aportesMeta: "id,metaId,movimentoId,data",
      auditorias: "id,[entidadeTipo+entidadeId],createdAt",
      metadados: "chave",
    });
  }
}

let databaseInstance: TangerinaDatabase | undefined;

/**
 * Retorna a instância compartilhada sem abrir o banco automaticamente.
 * A chamada é restrita ao navegador para evitar acesso ao IndexedDB no SSR.
 */
export function getDatabase(): TangerinaDatabase {
  if (typeof window === "undefined") {
    throw new Error(
      "A persistência do Tangerina só pode ser acessada no navegador.",
    );
  }

  if (!("indexedDB" in window)) {
    throw new Error("Este navegador não oferece suporte ao IndexedDB.");
  }

  databaseInstance ??= new TangerinaDatabase();
  return databaseInstance;
}
