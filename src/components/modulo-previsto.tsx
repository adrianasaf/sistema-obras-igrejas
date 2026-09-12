import Link from "next/link";
import type { ReactNode } from "react";

// Tela de módulo ainda não desenvolvido: apenas apresenta o espaço na
// navegação e o que está previsto no roadmap. Sem dados e sem regras.
export function ModuloPrevisto({
  titulo,
  descricao,
  fase,
  itens,
}: {
  titulo: string;
  descricao: string;
  fase: string;
  itens: ReactNode[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          {titulo}
        </h1>
        <p className="mt-1 text-sm text-muted">{descricao}</p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
          {fase}
        </span>
        <h2 className="mt-4 font-semibold text-brand">Previsto para este módulo</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {itens.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-muted">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">
          Consulte o{" "}
          <Link href="/historico" className="text-brand hover:underline">
            histórico de desenvolvimento
          </Link>{" "}
          para acompanhar o andamento.
        </p>
      </section>
    </div>
  );
}
