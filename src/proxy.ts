import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  areaDaRota,
  normalizarPerfil,
  podeAcessarArea,
} from "@/lib/permissoes";

// Rotas acessíveis sem autenticação. Todo o resto exige usuário logado.
const rotaPublica = createRouteMatcher(["/login(.*)", "/api/saude"]);

// Rotas que qualquer usuário autenticado pode abrir, independente do perfil.
const rotaLivre = createRouteMatcher(["/sem-permissao"]);

export default clerkMiddleware(async (auth, request) => {
  if (rotaPublica(request)) return;

  // Não autenticado: redireciona para o login e volta à página pedida depois.
  const { sessionClaims } = await auth.protect();

  if (rotaLivre(request)) return;

  // Segunda barreira de permissão (a primeira é o `exigirAcesso` de cada
  // página). Só funciona se o perfil estiver publicado no token da sessão
  // (Clerk → Sessions → Customize session token: {"metadata": "{{user.public_metadata}}"}).
  // Sem o claim, a verificação fica só nas páginas e nas Server Actions.
  const metadados = (sessionClaims as { metadata?: { perfil?: unknown } } | null)
    ?.metadata;
  const perfil = normalizarPerfil(metadados?.perfil);
  if (!perfil) return;

  const rota = new URL(request.url).pathname;
  const area = areaDaRota(rota);
  if (area && podeAcessarArea(perfil, area)) return;

  const destino = new URL("/sem-permissao", request.url);
  if (area) destino.searchParams.set("area", area);
  return NextResponse.redirect(destino);
});

export const config = {
  // Executa em todas as rotas, exceto arquivos estáticos e imagens.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
