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
  "Responsável CONBENS",
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
  "Responsável CONBENS": AREAS_COMUNS,
  Presbitério: [...AREAS_COMUNS, "orcamentos"],
};

// Etapa do fluxo de aprovação que cada perfil decide (1 a 4, na ordem de
// DEC-013). `null` = não decide etapa nenhuma; Administrador decide todas.
//
// "Pastor Local" apenas solicita (ou delega) e não aprova. "Presbitério" não
// decide no sistema: o resultado vem do SGI, registrado à parte — se esse
// perfil deve continuar existindo é PENDENTE DE DEFINIÇÃO (PEN-027).
export const ETAPA_DO_PERFIL: Record<Perfil, number | null> = {
  Administrador: null, // tratado por `podeDecidirEtapa`
  "Pastor Local": null,
  "Coordenador de Polo": 1,
  "Coordenador de Área": 2,
  "Coordenador de Região": 3,
  "Responsável CONBENS": 4,
  Presbitério: null,
};

// Nível da estrutura a que cada perfil é vinculado (DEC-014).
// "nenhum" = abrangência geral, sem vínculo a um registro específico.
export type NivelVinculo = "nenhum" | "regiao" | "area" | "polo" | "igreja";

export const NIVEL_VINCULO_DO_PERFIL: Record<Perfil, NivelVinculo> = {
  Administrador: "nenhum",
  "Pastor Local": "igreja",
  "Coordenador de Polo": "polo",
  "Coordenador de Área": "area",
  "Coordenador de Região": "regiao",
  "Responsável CONBENS": "nenhum",
  Presbitério: "nenhum",
};

export const ROTULO_VINCULO: Record<NivelVinculo, string> = {
  nenhum: "Sem vínculo",
  regiao: "Região",
  area: "Área",
  polo: "Polo",
  igreja: "Igreja",
};

export function nivelVinculoDoPerfil(perfil: Perfil): NivelVinculo {
  return NIVEL_VINCULO_DO_PERFIL[perfil];
}

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

// Aceita a grafia antiga ("COMBENS") gravada no Clerk antes de DEC-014 e
// devolve o perfil correspondente, ou null se não for um perfil conhecido.
export function normalizarPerfil(valor: unknown): Perfil | null {
  if (typeof valor !== "string") return null;
  const texto = valor.trim();
  const corrigido =
    texto === "Responsável COMBENS" ? "Responsável CONBENS" : texto;
  return ehPerfil(corrigido) ? corrigido : null;
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
