"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoLogin = { erro?: string };

// Somente login. Não existe cadastro público: usuários são criados pelo
// administrador no painel do Supabase (Authentication → Users).
export async function entrar(
  _estado: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const proximo = String(formData.get("proximo") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    // Mensagem genérica: não revelar se o e-mail existe.
    return { erro: "E-mail ou senha inválidos." };
  }

  // Só aceita destinos internos (evita redirecionamento para sites externos).
  const destino = proximo.startsWith("/") && !proximo.startsWith("//") ? proximo : "/";
  redirect(destino);
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
