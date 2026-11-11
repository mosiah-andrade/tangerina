import type {
  Centavos,
  PontosBase,
  RegraDistribuicao,
  TipoCalculoDistribuicao,
} from "../entities.ts";
import type { TangerinaDatabase } from "../database.ts";
import { criarRepositorioRegrasDistribuicao } from "../repositories/regras-distribuicao.ts";

export interface DadosNovaRegraDistribuicao {
  nome: string;
  caixinhaId: string;
  ordem: number;
  ativa?: boolean;
  tipoCalculo: TipoCalculoDistribuicao;
  valorFixoCentavos?: Centavos;
  percentual?: PontosBase;
}

export async function criarRegraDistribuicao(
  db: TangerinaDatabase,
  dados: DadosNovaRegraDistribuicao,
): Promise<RegraDistribuicao> {
  if (!(await db.caixinhas.get(dados.caixinhaId))) {
    throw new Error("A caixinha selecionada não existe.");
  }

  const agora = new Date().toISOString();
  const base = {
    id: crypto.randomUUID(),
    nome: dados.nome.trim(),
    caixinhaId: dados.caixinhaId,
    ordem: dados.ordem,
    ativa: dados.ativa ?? true,
    createdAt: agora,
    updatedAt: agora,
  };

  let regra: RegraDistribuicao;
  if (dados.tipoCalculo === "valor_fixo") {
    if (dados.valorFixoCentavos === undefined) {
      throw new Error("Uma regra de valor fixo exige um valor.");
    }
    regra = { ...base, tipoCalculo: "valor_fixo", valorFixoCentavos: dados.valorFixoCentavos };
  } else {
    if (dados.percentual === undefined) {
      throw new Error("Uma regra percentual exige percentual.");
    }
    regra = { ...base, tipoCalculo: dados.tipoCalculo, percentual: dados.percentual };
  }

  await criarRepositorioRegrasDistribuicao(db).inserir(regra);
  return regra;
}

export async function listarRegrasDistribuicao(
  db: TangerinaDatabase,
  incluirInativas = true,
): Promise<RegraDistribuicao[]> {
  return (await db.regrasDistribuicao.toArray())
    .filter((regra) => incluirInativas || regra.ativa)
    .sort((a, b) => a.ordem - b.ordem || a.createdAt.localeCompare(b.createdAt));
}

export async function atualizarRegraDistribuicao(
  db: TangerinaDatabase,
  id: string,
  alteracoes: Partial<Omit<DadosNovaRegraDistribuicao, "caixinhaId">>,
): Promise<RegraDistribuicao | undefined> {
  const repositorio = criarRepositorioRegrasDistribuicao(db);
  const atual = await repositorio.buscarPorId(id);
  if (!atual) return undefined;

  const proxima = {
    ...atual,
    ...alteracoes,
    updatedAt: new Date().toISOString(),
  } as RegraDistribuicao;

  await repositorio.atualizar(id, proxima);
  return repositorio.buscarPorId(id);
}
