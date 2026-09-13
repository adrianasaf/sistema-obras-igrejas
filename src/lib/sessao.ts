// Leitura do perfil do usuário logado (Clerk) e guardas de acesso usadas
// no servidor. Toda página interna chama `exigirAcesso`, e as Server Actions
// chamam `exigirPerfil` — a proteção não depende de esconder botões.

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ehPerfil,
  podeAcessarArea,
  type Area,
  type Perfil,
} from "@/lib/permissoes";

export type SessaoUsuario = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil | null;
};

// O perfil é definido no Clerk (Dashboard → Users → Public metadata):
//   { "perfil": "Coordenador de Área" }
export async function sessaoAtual(): Promise<SessaoUsuario | null> {
  const user = await currentUser();
  if (!user) return null;

  const bruto = (user.publicMetadata as Record<string, unknown> | null)?.perfil;
  const email = user.primaryEmailAddress?.emailAddress ?? "";

  return {
    id: user.id,
    nome: [user.firstName, user.lastName].filter(Boolean).join(" ") || email,
    email,
    perfil: ehPerfil(bruto) ? bruto : null,
  };
}

// Exige usuário autenticado e com perfil definido.
export async function exigirPerfil(): Promise<SessaoUsuario & { perfil: Perfil }> {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/login");
  if (!sessao.perfil) redirect("/sem-permissao?motivo=sem-perfil");
  return { ...sessao, perfil: sessao.perfil };
}

// Exige que o perfil do usuário tenha acesso à área da página.
export async function exigirAcesso(
  area: Area,
): Promise<SessaoUsuario & { perfil: Perfil }> {
  const sessao = await exigirPerfil();
  if (!podeAcessarArea(sessao.perfil, area)) {
    redirect(`/sem-permissao?area=${area}`);
  }
  return sessao;
}
