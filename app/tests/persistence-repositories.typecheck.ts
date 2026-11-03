import type { TangerinaDatabase } from "../lib/persistence/database";
import {
  criarRepositorio,
  criarRepositorioContas,
  criarRepositorioMovimentos,
} from "../lib/persistence/repositories";
import type { Conta } from "../lib/persistence/entities";

declare const db: TangerinaDatabase;

const contas = criarRepositorioContas(db);
const movimentos = criarRepositorioMovimentos(db);
const generico = criarRepositorio<Conta>(db.contas);

void contas.buscarPorId("conta-1");
void contas.listar();
void contas.inserir({
  id: "conta-1",
  nome: "Conta",
  tipo: "bancaria",
  saldoInicialCentavos: 0,
  dataSaldoInicial: "2026-11-03",
  ativa: true,
  createdAt: "2026-11-03T12:00:00.000Z",
  updatedAt: "2026-11-03T12:00:00.000Z",
});
void contas.atualizar("conta-1", { nome: "Nova conta" });
void contas.arquivar("conta-1");
void movimentos.buscarPorId("movimento-1");
void generico.listar();

// @ts-expect-error IDs não podem ser alterados por atualização.
void contas.atualizar("conta-1", { id: "outro-id" });

// @ts-expect-error Campos exclusivos de outra entidade não são aceitos.
void contas.atualizar("conta-1", { chaveOcorrencia: "duplicada" });
