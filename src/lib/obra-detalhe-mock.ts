// Dados DEMONSTRATIVOS das etapas da obra (orçamentos, execução e conclusão).
// Servem apenas para exibir a interface: não há gravação, cálculo nem regra de
// negócio aqui.
//
// As aprovações NÃO estão mais aqui: o fluxo de aprovação é real e vive no
// banco (src/lib/fluxo-aprovacao.ts). Continuam PENDENTES DE DEFINIÇÃO o
// conteúdo das cinco fases de execução (PEN-009) e os critérios de conclusão
// (PEN-010).

import type { TipoObra } from "@/lib/obras-tipos";

// O que as abas demonstrativas precisam saber da obra real.
export type ObraBase = {
  id: string;
  tipo: TipoObra;
  data: string;
  aprovada: boolean; // fluxo aprovado pela CONBENS
};

export type Foto = { id: string; legenda: string };

// Custos de exemplo das fases de execução, derivados do número da solicitação.
// Serão substituídos quando o módulo de Execução existir (PEN-009).
function valoresDemonstrativos(obra: ObraBase) {
  const semente = Number(obra.id.slice(-4)) || 1;
  const fator = { Construção: 6, Ampliação: 3, Reforma: 2, Manutenção: 1 }[obra.tipo];
  const material = (8000 + semente * 350) * fator;
  return { estimado: material + Math.round(material * 0.62) };
}

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
  fases: Fase[];
  conclusao: Conclusao;
};

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

function fasesDe(obra: ObraBase): Fase[] {
  // Percentuais de exemplo por situação da obra.
  const percentuais: number[] = obra.aprovada
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

function conclusaoDe(): Conclusao {
  // A conclusão só será preenchida com o módulo de execução (etapa futura).
  return { fotos: [] };
}

export function detalheDemonstrativo(obra: ObraBase): DetalheObra {
  return {
    fases: fasesDe(obra),
    conclusao: conclusaoDe(),
  };
}
