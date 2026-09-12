"use client";

import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

// Menu lateral, em grupos. Novos módulos entram aqui conforme o roadmap.
const GRUPOS = [
  {
    titulo: null,
    itens: [
      { href: "/", rotulo: "Dashboard", icone: "▦" },
      { href: "/obras", rotulo: "Obras", icone: "▣" },
    ],
  },
  {
    titulo: "Estrutura administrativa",
    itens: [
      { href: "/regioes", rotulo: "Regiões", icone: "◎" },
      { href: "/areas", rotulo: "Áreas", icone: "◇" },
      { href: "/polos", rotulo: "Polos", icone: "◈" },
      { href: "/igrejas", rotulo: "Igrejas", icone: "⌂" },
    ],
  },
  {
    titulo: null,
    itens: [
      { href: "/usuarios", rotulo: "Usuários", icone: "◍" },
      { href: "/estoque", rotulo: "Estoque", icone: "☰" },
      { href: "/historico", rotulo: "Histórico de Desenvolvimento", icone: "◷" },
      { href: "/configuracoes", rotulo: "Configurações", icone: "⚙" },
    ],
  },
] as const;

function ativo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({
  nome,
  subtitulo,
  versao,
  usuarioNome,
  usuarioEmail,
  children,
}: {
  nome: string;
  subtitulo: string;
  versao: string;
  usuarioNome: string;
  usuarioEmail: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [menuAberto, setMenuAberto] = useState(false);
  const [contaAberta, setContaAberta] = useState(false);

  const nav = (
    <nav
      aria-label="Menu principal"
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3"
    >
      {GRUPOS.map((grupo, indice) => (
        <div key={grupo.titulo ?? `grupo-${indice}`} className="flex flex-col gap-1">
          {grupo.titulo && (
            <p className="px-3 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-white/40 uppercase">
              {grupo.titulo}
            </p>
          )}
          {grupo.itens.map((item) => {
            const atual = ativo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                aria-current={atual ? "page" : undefined}
                className={`flex items-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  atual
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span aria-hidden="true" className="w-4 text-center text-white/60">
                  {item.icone}
                </span>
                <span>{item.rotulo}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const marca = (
    <div className="border-b border-white/10 px-5 py-5">
      <p className="text-sm font-semibold leading-tight">{nome}</p>
      <p className="mt-1 text-xs text-white/60">{subtitulo}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Menu lateral fixo (computador e tablet) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand text-white md:flex">
        {marca}
        {nav}
        <p className="mt-auto px-5 py-4 font-mono text-xs text-white/40">
          Versão {versao}
        </p>
      </aside>

      {/* Menu lateral sobreposto (celular) */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-brand text-white shadow-xl">
            {marca}
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
              className="rounded-md border border-border px-2.5 py-1.5 text-sm md:hidden"
            >
              ☰
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand">{nome}</p>
              <p className="hidden truncate text-xs text-muted sm:block">
                {subtitulo}
              </p>
            </div>

            {/* Usuário logado e opção de sair */}
            <div className="relative shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={contaAberta}
                onClick={() => setContaAberta((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 text-left hover:bg-background"
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
                >
                  {(usuarioNome || usuarioEmail || "?").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-40 truncate text-xs font-medium sm:block">
                  {usuarioNome || usuarioEmail}
                </span>
                <span aria-hidden="true" className="text-xs text-muted">
                  ▾
                </span>
              </button>

              {contaAberta && (
                <>
                  <button
                    type="button"
                    aria-label="Fechar menu da conta"
                    onClick={() => setContaAberta(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
                  >
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-medium">
                        {usuarioNome || "Usuário"}
                      </p>
                      <p
                        className="truncate text-xs text-muted"
                        title={usuarioEmail}
                      >
                        {usuarioEmail}
                      </p>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        signOut({ redirectUrl: "/login" });
                      }}
                    >
                      <button
                        type="submit"
                        role="menuitem"
                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-brand hover:bg-background"
                      >
                        Sair
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>{nome} · Uso interno</p>
            <p className="font-mono">Versão {versao}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
