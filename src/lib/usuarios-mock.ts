// Dados DEMONSTRATIVOS de usuários e perfis. Apenas interface: não há
// permissões aplicadas, gravação nem relação com o Clerk (autenticação).
//
// PENDENTE DE DEFINIÇÃO: o que cada perfil pode fazer e ver (PEN-011), as
// atribuições de cada cargo (PEN-002) e o papel do Responsável COMBENS
// (PEN-021). Os nomes dos perfis seguem os níveis registrados em DEC-008.

import {
  AREAS,
  IGREJAS,
  POLOS,
  REGIOES,
  type StatusCadastro,
} from "@/lib/estrutura-mock";

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

// Nível da estrutura a que cada perfil é vinculado nesta interface.
// "nenhum" = perfil de abrangência geral, sem vínculo a um único registro.
export type NivelVinculo = "nenhum" | "regiao" | "area" | "polo" | "igreja";

export const VINCULO_DO_PERFIL: Record<Perfil, NivelVinculo> = {
  Administrador: "nenhum",
  "Pastor Local": "igreja",
  "Coordenador de Polo": "polo",
  "Coordenador de Área": "area",
  "Coordenador de Região": "regiao",
  "Responsável COMBENS": "nenhum",
  Presbitério: "nenhum",
};

export const ROTULO_VINCULO: Record<NivelVinculo, string> = {
  nenhum: "Sem vínculo",
  regiao: "Região",
  area: "Área",
  polo: "Polo",
  igreja: "Igreja",
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  vinculoId?: string; // id do registro da estrutura, conforme o perfil
  status: StatusCadastro;
  ultimoAcesso?: string; // ISO com hora (AAAA-MM-DDTHH:MM)
};

export const USUARIOS: Usuario[] = [
  { id: "u01", nome: "Ana Exemplo Ferreira", email: "ana.exemplo@exemplo.org.br", perfil: "Administrador", status: "Ativo", ultimoAcesso: "2026-09-12T08:15" },
  { id: "u02", nome: "Pr. Exemplo da Silva", email: "pr.silva@exemplo.org.br", perfil: "Pastor Local", vinculoId: "i01", status: "Ativo", ultimoAcesso: "2026-09-11T19:40" },
  { id: "u03", nome: "Pr. Exemplo Moreira", email: "pr.moreira@exemplo.org.br", perfil: "Pastor Local", vinculoId: "i05", status: "Ativo", ultimoAcesso: "2026-09-10T21:05" },
  { id: "u04", nome: "Pr. Exemplo Tavares", email: "pr.tavares@exemplo.org.br", perfil: "Pastor Local", vinculoId: "i14", status: "Inativo", ultimoAcesso: "2026-07-28T10:22" },
  { id: "u05", nome: "Irmão Exemplo Souza", email: "souza@exemplo.org.br", perfil: "Coordenador de Polo", vinculoId: "p1", status: "Ativo", ultimoAcesso: "2026-09-12T07:50" },
  { id: "u06", nome: "Irmão Exemplo Ramos", email: "ramos@exemplo.org.br", perfil: "Coordenador de Polo", vinculoId: "p3", status: "Ativo", ultimoAcesso: "2026-09-09T16:30" },
  { id: "u07", nome: "Irmão Exemplo Lima", email: "lima@exemplo.org.br", perfil: "Coordenador de Área", vinculoId: "a1", status: "Ativo", ultimoAcesso: "2026-09-11T14:12" },
  { id: "u08", nome: "Irmão Exemplo Dantas", email: "dantas@exemplo.org.br", perfil: "Coordenador de Área", vinculoId: "a3", status: "Ativo", ultimoAcesso: "2026-09-08T09:03" },
  { id: "u09", nome: "Irmão Exemplo Alves", email: "alves@exemplo.org.br", perfil: "Coordenador de Região", vinculoId: "r1", status: "Ativo", ultimoAcesso: "2026-09-12T06:45" },
  { id: "u10", nome: "Irmão Exemplo Cunha", email: "cunha@exemplo.org.br", perfil: "Coordenador de Região", vinculoId: "r3", status: "Inativo" },
  { id: "u11", nome: "Irmão Exemplo Nunes", email: "nunes@exemplo.org.br", perfil: "Responsável COMBENS", status: "Ativo", ultimoAcesso: "2026-09-11T11:27" },
  { id: "u12", nome: "Secretaria do Presbitério", email: "presbiterio@exemplo.org.br", perfil: "Presbitério", status: "Ativo", ultimoAcesso: "2026-09-05T15:18" },
  { id: "u13", nome: "Carlos Exemplo Pinto", email: "carlos.exemplo@exemplo.org.br", perfil: "Administrador", status: "Ativo", ultimoAcesso: "2026-09-03T17:55" },
];

// Nome do registro vinculado, conforme o perfil do usuário.
export function descreverVinculo(usuario: Usuario): string {
  const nivel = VINCULO_DO_PERFIL[usuario.perfil];
  if (nivel === "nenhum") return "Abrangência geral";
  if (!usuario.vinculoId) return "—";

  const lista =
    nivel === "regiao"
      ? REGIOES
      : nivel === "area"
        ? AREAS
        : nivel === "polo"
          ? POLOS
          : IGREJAS;

  const registro = lista.find((r) => r.id === usuario.vinculoId);
  return registro ? `${ROTULO_VINCULO[nivel]}: ${registro.nome}` : "—";
}

export function formatarUltimoAcesso(iso?: string): string {
  if (!iso) return "Nunca acessou";
  const [data, hora] = iso.split("T");
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} às ${hora}`;
}
