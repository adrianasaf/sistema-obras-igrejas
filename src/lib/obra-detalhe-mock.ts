// Dados DEMONSTRATIVOS das etapas da obra (aprovações, orçamentos, execução e
// conclusão). Servem apenas para exibir a interface: não há gravação, cálculo
// nem regra de negócio aqui.
//
// Os nomes dos níveis de aprovação foram informados pelo responsável do
// projeto (ver DEC-008). Ordem exata, alçadas, prazos e efeitos de reprovação
// continuam PENDENTES DE DEFINIÇÃO (PEN-004, PEN-005), assim como o conteúdo
// das cinco fases de execução (PEN-009) e os critérios de conclusão (PEN-010).

import { valoresDemonstrativos, type Foto, type Obra } from "@/lib/obras-mock";

export const NIVEIS_APROVACAO = [
  "Pastor Local",
  "Coordenador do Polo",
  "Coordenador da Área",
  "Coordenador da Região",
  "Responsável COMBENS",
  "Presbitério",
] as const;
export type NivelAprovacao = (typeof NIVEIS_APROVACAO)[number];

export const SITUACOES_APROVACAO = [
  "Aguardando",
  "Aprovado",
  "Reprovado",
  "Correção solicitada",
] as const;
export type SituacaoAprovacao = (typeof SITUACOES_APROVACAO)[number];

export type Aprovacao = {
  nivel: NivelAprovacao;
  situacao: SituacaoAprovacao;
  responsavel?: string;
  data?: string;
  observacao?: string;
};

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

export type DetalheObra = {
  aprovacoes: Aprovacao[];
  orcamentos: Record<CategoriaOrcamento, Orcamento[]>;
  fases: Fase[];
  conclusao: Conclusao;
};

// Quantos níveis já responderam, por situação da obra (apenas demonstrativo).
const NIVEIS_RESPONDIDOS: Record<Obra["status"], number> = {
  Solicitada: 1,
  "Em análise": 3,
  Aprovada: 6,
  "Em execução": 6,
  Concluída: 6,
};

// Variações fixas para a interface mostrar também "Reprovado" e
// "Correção solicitada". Somente ilustrativo.
const VARIACOES: Record<
  string,
  { nivel: NivelAprovacao; situacao: SituacaoAprovacao; observacao: string }
> = {
  "2026-0008": {
    nivel: "Coordenador da Área",
    situacao: "Correção solicitada",
    observacao:
      "Solicitado incluir a planta do terreno vizinho e refazer a estimativa de área.",
  },
  "2026-0007": {
    nivel: "Coordenador do Polo",
    situacao: "Reprovado",
    observacao:
      "Reprovado nesta forma: avaliar troca parcial do piso antes de substituir toda a área.",
  },
};

const RESPONSAVEIS: Record<NivelAprovacao, string> = {
  "Pastor Local": "Pr. Exemplo da Silva",
  "Coordenador do Polo": "Irmão Exemplo Souza",
  "Coordenador da Área": "Irmão Exemplo Lima",
  "Coordenador da Região": "Irmão Exemplo Alves",
  "Responsável COMBENS": "Irmão Exemplo Nunes",
  Presbitério: "Reunião do Presbitério",
};

function somarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function aprovacoesDe(obra: Obra): Aprovacao[] {
  const respondidos = NIVEIS_RESPONDIDOS[obra.status];
  const variacao = VARIACOES[obra.id];

  return NIVEIS_APROVACAO.map((nivel, i) => {
    const responsavel = RESPONSAVEIS[nivel];

    if (variacao && variacao.nivel === nivel) {
      return {
        nivel,
        responsavel,
        situacao: variacao.situacao,
        data: somarDias(obra.data, (i + 1) * 2),
        observacao: variacao.observacao,
      };
    }

    if (i < respondidos) {
      return {
        nivel,
        responsavel,
        situacao: "Aprovado" as const,
        data: somarDias(obra.data, (i + 1) * 2),
      };
    }

    return { nivel, responsavel, situacao: "Aguardando" as const };
  });
}

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
    aprovacoes: aprovacoesDe(obra),
    orcamentos: orcamentosDe(obra),
    fases: fasesDe(obra),
    conclusao: conclusaoDe(obra),
  };
}
