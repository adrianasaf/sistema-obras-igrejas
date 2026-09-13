// Estrutura central de permissões do sistema. Módulo puro (sem Clerk e sem
// banco), para poder ser usado no servidor, no proxy e nos testes.
//
// O perfil de cada usuário vem do Clerk, em `publicMetadata.perfil`.
//
// Regras iniciais informadas pelo responsável do projeto (DEC-011). O vínculo
// com Região, Área, Polo e Igreja NÃO é verificado ainda: será conectado
// depois (PEN-025).

export const PERFIS = [
  "Administrador",
  "Pastor Local",
  "Coordenador de Polo",
  "Coordenador de Área",
  "Coordenador de Região",
  "Responsável COMBENS",
  "Presbitério",
] as const;
export type Perfil = (typeof PERFIS)[number];

// Áreas do sistema. Cada rota interna pertence a uma área.
export const AREAS = [
  "dashboard",
  "obras",
  "orcamentos",
  "execucao",
  "estrutura",
  "usuarios",
  "estoque",
  "historico",
  "configuracoes",
] as const;
export type Area = (typeof AREAS)[number];

export const ROTULO_AREA: Record<Area, string> = {
  dashboard: "Dashboard",
  obras: "Obras e solicitações",
  orcamentos: "Orçamentos",
  execucao: "Execução e conclusão",
  estrutura: "Estrutura administrativa",
  usuarios: "Usuários e perfis",
  estoque: "Estoque",
  historico: "Histórico de Desenvolvimento",
  configuracoes: "Configurações",
};

// Áreas liberadas por perfil. "Administrador" tem acesso completo.
const AREAS_COMUNS: Area[] = ["dashboard", "obras"];

export const AREAS_DO_PERFIL: Record<Perfil, readonly Area[]> = {
  Administrador: AREAS,
  "Pastor Local": AREAS_COMUNS,
  "Coordenador de Polo": AREAS_COMUNS,
  "Coordenador de Área": AREAS_COMUNS,
  "Coordenador de Região": AREAS_COMUNS,
  "Responsável COMBENS": AREAS_COMUNS,
  Presbitério: [...AREAS_COMUNS, "orcamentos"],
};

// Etapa do fluxo de aprovação que cada perfil decide (1 a 6, na ordem de
// DEC-008). `null` = não decide etapa nenhuma; Administrador decide todas.
export const ETAPA_DO_PERFIL: Record<Perfil, number | null> = {
  Administrador: null, // tratado por `podeDecidirEtapa`
  "Pastor Local": 1,
  "Coordenador de Polo": 2,
  "Coordenador de Área": 3,
  "Coordenador de Região": 4,
  "Responsável COMBENS": 5,
  Presbitério: 6,
};

// Prefixo de rota → área. A ordem importa: o primeiro prefixo que casar vale.
const ROTAS: { prefixo: string; area: Area }[] = [
  { prefixo: "/obras", area: "obras" },
  { prefixo: "/regioes", area: "estrutura" },
  { prefixo: "/areas", area: "estrutura" },
  { prefixo: "/polos", area: "estrutura" },
  { prefixo: "/igrejas", area: "estrutura" },
  { prefixo: "/usuarios", area: "usuarios" },
  { prefixo: "/estoque", area: "estoque" },
  { prefixo: "/historico", area: "historico" },
  { prefixo: "/configuracoes", area: "configuracoes" },
];

export function areaDaRota(rota: string): Area | null {
  if (rota === "/" || rota === "") return "dashboard";
  const encontrada = ROTAS.find(
    (r) => rota === r.prefixo || rota.startsWith(`${r.prefixo}/`),
  );
  return encontrada ? encontrada.area : null;
}

export function ehPerfil(valor: unknown): valor is Perfil {
  return typeof valor === "string" && (PERFIS as readonly string[]).includes(valor);
}

export function areasDoPerfil(perfil: Perfil): readonly Area[] {
  return AREAS_DO_PERFIL[perfil];
}

export function podeAcessarArea(perfil: Perfil | null, area: Area): boolean {
  if (!perfil) return false;
  return AREAS_DO_PERFIL[perfil].includes(area);
}

// Usada pelo proxy e pelas páginas: uma rota sem área conhecida é negada.
export function podeAcessarRota(perfil: Perfil | null, rota: string): boolean {
  const area = areaDaRota(rota);
  return area !== null && podeAcessarArea(perfil, area);
}

// Aprovações: o perfil só decide a etapa correspondente ao seu nível.
// O vínculo administrativo (região/área/polo/igreja) ainda não é verificado.
export function podeDecidirEtapa(perfil: Perfil | null, etapa: number): boolean {
  if (!perfil) return false;
  if (perfil === "Administrador") return true;
  return ETAPA_DO_PERFIL[perfil] === etapa;
}

export function etapaDoPerfil(perfil: Perfil | null): number | null {
  return perfil ? ETAPA_DO_PERFIL[perfil] : null;
}
