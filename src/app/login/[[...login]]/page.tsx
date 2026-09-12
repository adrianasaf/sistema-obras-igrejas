import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";

export const metadata: Metadata = { title: "Entrar" };

// Login com e-mail e senha (Clerk). Não há cadastro público: o modo de
// cadastro deve estar como "Restricted" no painel do Clerk e os usuários
// são criados/convidados pelo administrador.
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
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
        <SignIn path="/login" />
        <p className="mt-6 max-w-sm text-center text-xs text-muted">
          Acesso restrito. Não há cadastro público: solicite seu acesso ao
          administrador do sistema.
        </p>
      </main>
      <footer className="px-4 py-4 text-center text-xs text-muted">
        <span className="font-mono">Versão {APP_VERSION}</span>
      </footer>
    </div>
  );
}
