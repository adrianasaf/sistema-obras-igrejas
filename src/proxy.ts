import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rotas acessíveis sem autenticação. Todo o resto exige usuário logado.
const rotaPublica = createRouteMatcher(["/login(.*)", "/api/saude"]);

export default clerkMiddleware(async (auth, request) => {
  if (!rotaPublica(request)) {
    // Não autenticado: redireciona para o login e volta à página pedida depois.
    await auth.protect();
  }
});

export const config = {
  // Executa em todas as rotas, exceto arquivos estáticos e imagens.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
