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
];

export function buscarObra(id: string): Obra | undefined {
  return OBRAS.find((o) => o.id === id);
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
