import type { Metadata } from "next";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";
import { FormularioLogin } from "./formulario";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { proximo } = await searchParams;
  const destino = typeof proximo === "string" ? proximo : "";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div
              aria-hidden="true"
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-brand text-sm font-semibold text-white"
            >
              GO
            </div>
            <h1 className="text-xl font-semibold text-brand">{APP_NAME}</h1>
            <p className="mt-1 text-sm text-muted">{APP_SUBTITLE}</p>
          </div>
          <FormularioLogin proximo={destino} />
          <p className="mt-6 text-center text-xs text-muted">
            Acesso restrito. Não há cadastro público: solicite seu acesso ao
            administrador do sistema.
          </p>
        </div>
      </main>
      <footer className="px-4 py-4 text-center text-xs text-muted">
        <span className="font-mono">Versão {APP_VERSION}</span>
      </footer>
    </div>
  );
}
