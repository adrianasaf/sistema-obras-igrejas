import Link from "next/link";
import type { ReactNode } from "react";
import { botaoAcao, botaoAcaoBase, cartao, tituloSecao } from "@/lib/ui";

export function AcoesRegistro({
  verHref,
  editarHref,
  nome,
}: {
  verHref: string;
  editarHref: string;
  nome: string;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link href={verHref} className={`${botaoAcao} text-brand`}>
        Visualizar<span className="sr-only"> {nome}</span>
      </Link>
      <Link href={editarHref} className={botaoAcao}>
        Editar<span className="sr-only"> {nome}</span>
      </Link>
    </div>
  );
}

export function AvisoDemonstrativo() {
  return (
    <p className="text-xs text-muted">
      Tela demonstrativa: os dados são fictícios e nenhum cadastro é gravado.
    </p>
  );
}

export function CabecalhoDetalhe({
  voltarHref,
  voltarRotulo,
  titulo,
  subtitulo,
  cracha,
  editarHref,
  campos,
}: {
  voltarHref: string;
  voltarRotulo: string;
  titulo: string;
  subtitulo?: string;
  cracha: ReactNode;
  editarHref: string;
  campos: { rotulo: string; valor: string }[];
}) {
  return (
    <div>
      <Link href={voltarHref} className="text-sm text-muted hover:text-brand">
        ← {voltarRotulo}
      </Link>

      <div className={`${cartao} mt-3 overflow-hidden`}>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {subtitulo && (
              <p className="text-sm font-medium text-muted">{subtitulo}</p>
            )}
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-brand sm:text-2xl">
              {titulo}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {cracha}
            <Link
              href={editarHref}
              className={`${botaoAcaoBase} border border-brand text-brand hover:bg-background`}
            >
              Editar
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
          {campos.map((c) => (
            <div key={c.rotulo} className="bg-surface px-5 py-3">
              <dt className="text-xs text-muted">{c.rotulo}</dt>
              <dd className="mt-0.5 truncate text-sm font-medium" title={c.valor}>
                {c.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function ListaVinculada({
  titulo,
  descricao,
  itens,
  vazio,
}: {
  titulo: string;
  descricao?: string;
  itens: { id: string; href: string; nome: string; detalhe: string; cracha: ReactNode }[];
  vazio: string;
}) {
  return (
    <section className={`${cartao} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <div>
          <h2 className={tituloSecao}>{titulo}</h2>
          {descricao && <p className="text-xs text-muted">{descricao}</p>}
        </div>
        <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted tabular-nums">
          {itens.length}
        </span>
      </div>
      {itens.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">{vazio}</p>
      ) : (
        <ul className="divide-y divide-border">
          {itens.map((i) => (
            <li key={i.id}>
              <Link
                href={i.href}
                className="flex flex-col gap-2 px-5 py-3 hover:bg-background sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{i.nome}</p>
                  <p className="truncate text-xs text-muted">{i.detalhe}</p>
                </div>
                {i.cracha}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
