import Link from "next/link";
import type { ReactNode } from "react";
import { tituloPagina } from "@/lib/ui";

// Cabeçalho padrão das páginas: título, descrição e, quando houver, uma ação
// principal à direita (em celular, abaixo do título).
export function CabecalhoPagina({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={tituloPagina}>{titulo}</h1>
        <p className="mt-1 text-sm text-muted">{descricao}</p>
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  );
}

export function LinkVoltar({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex text-sm text-muted transition-colors hover:text-brand"
    >
      ← {children}
    </Link>
  );
}
