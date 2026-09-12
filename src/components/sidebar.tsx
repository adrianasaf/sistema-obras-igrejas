"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ITENS = [
  { href: "/", rotulo: "Dashboard" },
  { href: "/obras", rotulo: "Obras" },
  { href: "/historico", rotulo: "Histórico de Desenvolvimento" },
] as const;

function ativo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Sidebar({
  nome,
  subtitulo,
  usuarioEmail,
  acaoSair,
}: {
  nome: string;
  subtitulo: string;
  usuarioEmail: string;
  acaoSair: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  const rodape = (
    <div className="mt-auto border-t border-white/10 p-3">
      <p className="truncate px-3 text-xs text-white/60" title={usuarioEmail}>
        {usuarioEmail}
      </p>
      <form action={acaoSair}>
        <button
          type="submit"
          className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          Sair
        </button>
      </form>
    </div>
  );

  const nav = (
    <nav aria-label="Menu principal" className="flex flex-col gap-1 p-3">
      {ITENS.map((item) => {
        const atual = ativo(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setAberto(false)}
            aria-current={atual ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              atual
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Barra superior (celular) */}
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
        <button
          type="button"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
          className="rounded-md border border-border px-2.5 py-1.5 text-sm"
        >
          ☰
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand">{nome}</p>
          <p className="truncate text-xs text-muted">{subtitulo}</p>
        </div>
      </header>

      {/* Menu lateral (computador) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-sm font-semibold leading-tight">{nome}</p>
          <p className="mt-1 text-xs text-white/60">{subtitulo}</p>
        </div>
        {nav}
        {rodape}
      </aside>

      {/* Menu lateral (celular, sobreposto) */}
      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-brand text-white shadow-xl">
            <div className="border-b border-white/10 px-5 py-5">
              <p className="text-sm font-semibold leading-tight">{nome}</p>
              <p className="mt-1 text-xs text-white/60">{subtitulo}</p>
            </div>
            {nav}
            {rodape}
          </aside>
        </div>
      )}
    </>
  );
}
