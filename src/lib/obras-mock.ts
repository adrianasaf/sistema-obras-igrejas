// Dados DEMONSTRATIVOS do módulo Obras. Serão substituídos pelo banco em etapa futura.
// Nomes de igrejas e situações são fictícios.

export const TIPOS_OBRA = [
  "Reforma",
  "Ampliação",
  "Construção",
  "Manutenção",
] as const;
export type TipoObra = (typeof TIPOS_OBRA)[number];

export const PRIORIDADES = [
  "Emergencial",
  "Prioridade 1",
  "Prioridade 2",
  "Prioridade 3",
] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

// Status provisórios. Os status oficiais dependem do fluxo de aprovação
// (PENDENTE DE DEFINIÇÃO — ver docs/11-PENDENCIAS.md, PEN-004).
export const STATUS_OBRA = [
  "Solicitada",
  "Em análise",
  "Aprovada",
  "Em execução",
  "Concluída",
] as const;
export type StatusObra = (typeof STATUS_OBRA)[number];

export type Foto = { id: string; legenda: string };

export type Obra = {
  id: string;
  igreja: string;
  tipo: TipoObra;
  prioridade: Prioridade;
  data: string; // ISO (AAAA-MM-DD)
  status: StatusObra;
  titulo: string;
  descricao: string;
  fotos: Foto[];
};

export const OBRAS: Obra[] = [
  {
    id: "2026-0001",
    igreja: "Igreja Exemplo Centro",
    tipo: "Manutenção",
    prioridade: "Emergencial",
    data: "2026-09-02",
    status: "Em análise",
    titulo: "Infiltração no telhado do templo",
    descricao:
      "Durante as chuvas da última semana surgiram goteiras sobre a área das cadeiras, com risco à instalação elétrica do forro. Necessária troca de telhas quebradas e revisão da calha.",
    fotos: [
      { id: "f1", legenda: "Mancha de infiltração no forro" },
      { id: "f2", legenda: "Telhas danificadas" },
    ],
  },
  {
    id: "2026-0002",
    igreja: "Igreja Exemplo Bairro Norte",
    tipo: "Reforma",
    prioridade: "Prioridade 1",
    data: "2026-08-28",
    status: "Solicitada",
    titulo: "Reforma dos banheiros",
    descricao:
      "Os banheiros apresentam vazamentos, louças quebradas e piso danificado. Solicita-se reforma completa com acessibilidade.",
    fotos: [{ id: "f1", legenda: "Situação atual dos banheiros" }],
  },
  {
    id: "2026-0003",
    igreja: "Igreja Exemplo Litoral",
    tipo: "Ampliação",
    prioridade: "Prioridade 2",
    data: "2026-08-15",
    status: "Aprovada",
    titulo: "Ampliação da sala de crianças",
    descricao:
      "A sala atual não comporta o número de crianças aos domingos. Proposta de ampliação em 25 m² aproveitando o terreno lateral.",
    fotos: [],
  },
  {
    id: "2026-0004",
    igreja: "Igreja Exemplo Sertão",
    tipo: "Construção",
    prioridade: "Prioridade 2",
    data: "2026-07-20",
    status: "Em execução",
    titulo: "Construção do templo — etapa de alvenaria",
    descricao:
      "Construção do novo templo em terreno já regularizado. Obra em andamento na fase de alvenaria.",
    fotos: [
      { id: "f1", legenda: "Fundação concluída" },
      { id: "f2", legenda: "Alvenaria em andamento" },
      { id: "f3", legenda: "Vista geral do terreno" },
    ],
  },
  {
    id: "2026-0005",
    igreja: "Igreja Exemplo Vale",
    tipo: "Manutenção",
    prioridade: "Prioridade 3",
    data: "2026-06-05",
    status: "Concluída",
    titulo: "Pintura externa",
    descricao: "Pintura externa da fachada e muros, concluída.",
    fotos: [{ id: "f1", legenda: "Fachada após a pintura" }],
  },
  {
    id: "2026-0006",
    igreja: "Igreja Exemplo Alto da Serra",
    tipo: "Manutenção",
    prioridade: "Emergencial",
    data: "2026-09-08",
    status: "Em análise",
    titulo: "Queda de energia no quadro elétrico",
    descricao:
      "O quadro elétrico apresenta superaquecimento e desarme constante dos disjuntores, impedindo o uso do som e da climatização nos cultos.",
    fotos: [{ id: "f1", legenda: "Quadro elétrico atual" }],
  },
  {
    id: "2026-0007",
    igreja: "Igreja Exemplo Jardim Sul",
    tipo: "Reforma",
    prioridade: "Prioridade 1",
    data: "2026-09-06",
    status: "Solicitada",
    titulo: "Substituição do piso do templo",
    descricao:
      "Piso com peças soltas e trincadas em toda a área central, com risco de queda durante a circulação.",
    fotos: [],
  },
  {
    id: "2026-0008",
    igreja: "Igreja Exemplo Vila Nova",
    tipo: "Ampliação",
    prioridade: "Prioridade 2",
    data: "2026-09-04",
    status: "Em análise",
    titulo: "Ampliação do estacionamento",
    descricao:
      "Proposta de ampliação da área de estacionamento em terreno vizinho já pertencente à igreja.",
    fotos: [],
  },
  {
    id: "2026-0009",
    igreja: "Igreja Exemplo Riacho Doce",
    tipo: "Manutenção",
    prioridade: "Prioridade 3",
    data: "2026-08-22",
    status: "Aprovada",
    titulo: "Revisão da calçada externa",
    descricao:
      "Nivelamento e reparo de trechos da calçada em frente ao templo.",
    fotos: [],
  },
  {
    id: "2026-0010",
    igreja: "Igreja Exemplo Bela Vista",
    tipo: "Construção",
    prioridade: "Prioridade 1",
    data: "2026-08-10",
    status: "Em execução",
    titulo: "Construção do salão de reuniões",
    descricao:
      "Novo salão anexo ao templo para reuniões e atividades de ensino. Obra na fase de estrutura.",
    fotos: [{ id: "f1", legenda: "Estrutura em execução" }],
  },
  {
    id: "2026-0011",
    igreja: "Igreja Exemplo Campo Verde",
    tipo: "Reforma",
    prioridade: "Prioridade 2",
    data: "2026-07-30",
    status: "Em execução",
    titulo: "Reforma da cobertura lateral",
    descricao:
      "Troca da estrutura de madeira e das telhas da cobertura lateral de acesso ao templo.",
    fotos: [{ id: "f1", legenda: "Cobertura desmontada" }],
  },
  {
    id: "2026-0012",
    igreja: "Igreja Exemplo Morada Nova",
    tipo: "Manutenção",
    prioridade: "Prioridade 3",
    data: "2026-07-12",
    status: "Concluída",
    titulo: "Troca das luminárias internas",
    descricao:
      "Substituição das luminárias internas por modelos de LED, concluída e entregue.",
    fotos: [],
  },
  {
    id: "2026-0013",
    igreja: "Igreja Exemplo Serra Branca",
    tipo: "Reforma",
    prioridade: "Prioridade 2",
    data: "2026-06-18",
    status: "Concluída",
    titulo: "Reforma da secretaria",
    descricao:
      "Pintura, elétrica e mobiliário da sala da secretaria, concluída.",
    fotos: [],
  },
];

export function buscarObra(id: string): Obra | undefined {
  return OBRAS.find((o) => o.id === id);
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Valores DEMONSTRATIVOS de cada solicitação. Derivados do número da
// solicitação apenas para a interface ter números estáveis; não há cálculo,
// gravação nem regra de aprovação de valores (PENDENTE DE DEFINIÇÃO: PEN-015).
export type ValoresObra = {
  material: number;
  maoDeObra: number;
  estimado: number;
  aprovado?: number;
};

export function valoresDemonstrativos(obra: Obra): ValoresObra {
  const semente = Number(obra.id.slice(-4));
  const fator = { Construção: 6, Ampliação: 3, Reforma: 2, Manutenção: 1 }[
    obra.tipo
  ];
  const material = (8000 + semente * 350) * fator;
  const maoDeObra = Math.round(material * 0.62);
  const estimado = material + maoDeObra;

  // Só obras aprovadas ou adiante têm valor aprovado de exemplo.
  const temAprovado =
    obra.status === "Aprovada" ||
    obra.status === "Em execução" ||
    obra.status === "Concluída";

  return {
    material,
    maoDeObra,
    estimado,
    aprovado: temAprovado ? Math.round(estimado * 0.95) : undefined,
  };
}

export function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
