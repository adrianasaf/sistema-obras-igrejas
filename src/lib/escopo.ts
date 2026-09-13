// Escopo do usuário sobre as obras (DEC-014, resolve PEN-025).
//
// O perfil define o nível do vínculo e o `vinculoId` (lido do Clerk) diz qual
// registro da estrutura. Administrador, Responsável CONBENS e Presbitério têm
// abrangência geral. Perfis com vínculo obrigatório e sem `vinculoId` não têm
// escopo sobre nenhuma obra — comportamento seguro, cabe ao administrador
// preencher o vínculo.

// Import relativo (e não pelo alias "@/") para este módulo puro poder ser
// carregado direto pelos testes em `testes/`.
import {
  nivelVinculoDoPerfil,
  type NivelVinculo,
  type Perfil,
} from "./permissoes.ts";

// Cadeia da obra: igreja → polo → área → região.
export type CadeiaObra = {
  igrejaId: string;
  poloId: string;
  areaId: string;
  regiaoId: string;
};

export type EscopoUsuario = {
  perfil: Perfil | null;
  vinculoId?: string | null;
};

// Filtro de escopo a aplicar nas consultas: `nivel: "nenhum"` = sem filtro.
export type FiltroEscopo =
  | { tipo: "tudo" }
  | { tipo: "nada" }
  | { tipo: "nivel"; nivel: Exclude<NivelVinculo, "nenhum">; id: string };

export function filtroDeEscopo(usuario: EscopoUsuario): FiltroEscopo {
  if (!usuario.perfil) return { tipo: "nada" };
  if (usuario.perfil === "Administrador") return { tipo: "tudo" };

  const nivel = nivelVinculoDoPerfil(usuario.perfil);
  if (nivel === "nenhum") return { tipo: "tudo" };

  const id = usuario.vinculoId?.trim();
  if (!id) return { tipo: "nada" };
  return { tipo: "nivel", nivel, id };
}

// O usuário tem escopo sobre esta obra?
export function temEscopoSobreObra(
  usuario: EscopoUsuario,
  obra: CadeiaObra,
): boolean {
  const filtro = filtroDeEscopo(usuario);
  if (filtro.tipo === "tudo") return true;
  if (filtro.tipo === "nada") return false;

  const idDaObra: Record<Exclude<NivelVinculo, "nenhum">, string> = {
    igreja: obra.igrejaId,
    polo: obra.poloId,
    area: obra.areaId,
    regiao: obra.regiaoId,
  };
  return idDaObra[filtro.nivel] === filtro.id;
}

// Texto para explicar um bloqueio de escopo.
export function motivoSemEscopo(usuario: EscopoUsuario): string {
  const filtro = filtroDeEscopo(usuario);
  if (filtro.tipo === "nada") {
    return usuario.perfil
      ? `Seu usuário não tem vínculo administrativo definido (${usuario.perfil}). Fale com o administrador.`
      : "Seu usuário não tem perfil de acesso definido.";
  }
  return "Esta solicitação está fora da sua abrangência.";
}
