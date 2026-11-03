import Dexie, { type Table } from "dexie";
import type {
  Alocacao,
  AporteMeta,
  Auditoria,
  Caixinha,
  Conta,
  ContaPagar,
  EfeitoSaldo,
  Id,
  MetadataRecord,
  Meta,
  Movimento,
  Recorrencia,
  RegraDistribuicao,
} from "./entities";

export class TangerinaDatabase extends Dexie {
  contas!: Table<Conta, Id>;
  caixinhas!: Table<Caixinha, Id>;
  movimentos!: Table<Movimento, Id>;
  efeitosSaldo!: Table<EfeitoSaldo, Id>;
  alocacoes!: Table<Alocacao, Id>;
  regrasDistribuicao!: Table<RegraDistribuicao, Id>;
  contasPagar!: Table<ContaPagar, Id>;
  recorrencias!: Table<Recorrencia, Id>;
  metas!: Table<Meta, Id>;
  aportesMeta!: Table<AporteMeta, Id>;
  auditorias!: Table<Auditoria, Id>;
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
