// Dados DEMONSTRATIVOS das etapas da obra (orçamentos, execução e conclusão).
// Servem apenas para exibir a interface: não há gravação, cálculo nem regra de
// negócio aqui.
//
// As aprovações NÃO estão mais aqui: o fluxo de aprovação é real e vive no
// banco (src/lib/fluxo-aprovacao.ts). Continuam PENDENTES DE DEFINIÇÃO o
// conteúdo das cinco fases de execução (PEN-009) e os critérios de conclusão
// (PEN-010).

import { valoresDemonstrativos, type Foto, type Obra } from "@/lib/obras-mock";

export const CATEGORIAS_ORCAMENTO = ["Material", "Mão de obra"] as const;
export type CategoriaOrcamento = (typeof CATEGORIAS_ORCAMENTO)[number];

export type SituacaoOrcamento = "Não recebido" | "Recebido" | "Selecionado";

export type Orcamento = {
  rotulo: string;
  situacao: SituacaoOrcamento;
  fornecedor?: string;
  valor?: number;
  data?: string;
};

export type SituacaoFase = "Não iniciada" | "Em andamento" | "Concluída";

export type Fase = {
  rotulo: string;
  situacao: SituacaoFase;
  percentual: number;
  descricao: string;
  materiais: string[];
  custo: number;
  inicio?: string; // ISO (AAAA-MM-DD)
};

export type Conclusao = {
  resumo?: string;
  valorFinal?: number;
  data?: string;
  fotos: Foto[];
};

function somarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export type DetalheObra = {
  orcamentos: Record<CategoriaOrcamento, Orcamento[]>;
  fases: Fase[];
  conclusao: Conclusao;
};

function orcamentosDe(obra: Obra): Record<CategoriaOrcamento, Orcamento[]> {
  // Só obras aprovadas ou adiante têm orçamentos de exemplo preenchidos.
  const preenchido =
    obra.status === "Aprovada" ||
    obra.status === "Em execução" ||
    obra.status === "Concluída";

  const valores = valoresDemonstrativos(obra);

  const monta = (categoria: CategoriaOrcamento, base: number): Orcamento[] =>
    [1, 2, 3].map((n) => {
      if (!preenchido) {
        return { rotulo: `Orçamento ${n}`, situacao: "Não recebido" as const };
      }
      return {
        rotulo: `Orçamento ${n}`,
        situacao: n === 1 ? ("Selecionado" as const) : ("Recebido" as const),
        fornecedor: `${categoria === "Material" ? "Fornecedor" : "Prestador"} Exemplo ${n}`,
        valor: Math.round(base * (1 + (n - 1) * 0.12)),
        data: somarDias(obra.data, 14 + n),
      };
    });

  return {
    Material: monta("Material", valores.material),
    "Mão de obra": monta("Mão de obra", valores.maoDeObra),
  };
}

// Textos e materiais de exemplo por fase. O conteúdo real de cada fase da
// execução está PENDENTE DE DEFINIÇÃO (PEN-009); aqui servem só de ilustração.
const FASES_EXEMPLO = [
  {
    descricao: "Preparação do canteiro, demolições e retirada de entulho.",
    materiais: ["Andaime metálico", "Sacos de entulho", "Lona plástica"],
  },
  {
    descricao: "Alvenaria, contrapiso e estrutura.",
    materiais: ["Cimento CP-II", "Areia média", "Bloco cerâmico"],
  },
  {
    descricao: "Instalações elétricas e hidráulicas.",
    materiais: ["Cabo flexível 2,5 mm²", "Tubo PVC 100 mm", "Disjuntores"],
  },
  {
    descricao: "Revestimentos, forro e pintura.",
    materiais: ["Porcelanato 60x60", "Massa corrida", "Tinta acrílica"],
  },
  {
    descricao: "Acabamentos finais, limpeza e vistoria da obra.",
    materiais: ["Luminárias LED", "Material de limpeza", "Ferragens"],
  },
];

function fasesDe(obra: Obra): Fase[] {
  // Percentuais de exemplo por situação da obra.
  const percentuais: number[] =
    obra.status === "Concluída"
      ? [100, 100, 100, 100, 100]
      : obra.status === "Em execução"
        ? [100, 100, 45, 0, 0]
        : [0, 0, 0, 0, 0];

  const valores = valoresDemonstrativos(obra);
  // Distribuição de custo por fase, apenas para demonstrar a interface.
  const pesos = [0.1, 0.3, 0.2, 0.25, 0.15];

  return percentuais.map((percentual, i) => ({
    rotulo: `Fase ${i + 1}`,
    percentual,
    descricao: FASES_EXEMPLO[i].descricao,
    materiais: FASES_EXEMPLO[i].materiais,
    custo: Math.round(valores.estimado * pesos[i] * (percentual / 100)),
    situacao:
      percentual === 100
        ? "Concluída"
        : percentual > 0
          ? "Em andamento"
          : "Não iniciada",
    inicio: percentual > 0 ? somarDias(obra.data, 30 + i * 20) : undefined,
  }));
}

function conclusaoDe(obra: Obra): Conclusao {
  if (obra.status !== "Concluída") return { fotos: [] };

  return {
    resumo:
      "Obra executada conforme a solicitação, com vistoria final realizada e termo de entrega assinado pela igreja.",
    valorFinal: valoresDemonstrativos(obra).aprovado,
    data: somarDias(obra.data, 120),
    fotos: [
      { id: "c1", legenda: "Vista geral após a conclusão" },
      { id: "c2", legenda: "Detalhe do acabamento" },
    ],
  };
}

export function detalheDemonstrativo(obra: Obra): DetalheObra {
  return {
    orcamentos: orcamentosDe(obra),
    fases: fasesDe(obra),
    conclusao: conclusaoDe(obra),
  };
}
