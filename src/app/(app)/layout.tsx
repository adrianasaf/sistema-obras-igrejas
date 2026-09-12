import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";

// Páginas internas dependem da sessão: sempre renderizadas a cada requisição.
export const dynamic = "force-dynamic";

// Layout das páginas internas: exige usuário autenticado.
// O proxy (src/proxy.ts) já redireciona antes; esta verificação é a segunda barreira.
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const email = user.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar nome={APP_NAME} subtitulo={APP_SUBTITLE} usuarioEmail={email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>{APP_NAME} · Uso interno</p>
            <p className="font-mono">Versão {APP_VERSION}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
