import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";

// Páginas internas dependem da sessão: sempre renderizadas a cada requisição.
export const dynamic = "force-dynamic";

// Layout das páginas internas: exige usuário autenticado.
// O proxy (src/proxy.ts) já redireciona antes; esta verificação é a segunda barreira.
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const nome = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <AppShell
      nome={APP_NAME}
      subtitulo={APP_SUBTITLE}
      versao={APP_VERSION}
      usuarioNome={nome}
      usuarioEmail={email}
    >
      {children}
    </AppShell>
  );
}
