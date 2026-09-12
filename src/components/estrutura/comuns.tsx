import Link from "next/link";
import type { ReactNode } from "react";

export function CabecalhoLista({
  titulo,
  descricao,
  novoHref,
  novoRotulo,
}: {
  titulo: string;
  descricao: string;
  novoHref: string;
  novoRotulo: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          {titulo}
        </h1>
        <p className="mt-1 text-sm text-muted">{descricao}</p>
      </div>
      <Link
        href={novoHref}
        className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
      >
        {novoRotulo}
      </Link>
    </div>
  );
}

export function AcoesRegistro({
  verHref,
  editarHref,
  nome,
}: {
  verHref: string;
  editarHref: string;
  nome: string;
}) {
  const botao =
    "inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-background";
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link href={verHref} className={`${botao} text-brand`}>
        Visualizar<span className="sr-only"> {nome}</span>
      </Link>
      <Link href={editarHref} className={botao}>
        Editar<span className="sr-only"> {nome}</span>
      </Link>
    </div>
  );
}

export function Tabela({
  colunas,
  children,
}: {
  colunas: ReactNode[];
  children: ReactNode;
}) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
      <table className="w-full text-sm">
        <thead className="bg-background text-left text-xs tracking-wide text-muted uppercase">
          <tr>
            {colunas.map((c, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {c}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function CartaoRegistro({
  titulo,
  subtitulo,
  cracha,
  dados,
  acoes,
}: {
  titulo: string;
  subtitulo?: string;
  cracha: ReactNode;
  dados: { rotulo: string; valor: string }[];
  acoes: ReactNode;
}) {
  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-brand">{titulo}</p>
          {subtitulo && <p className="text-xs text-muted">{subtitulo}</p>}
        </div>
        {cracha}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
        {dados.map((d) => (
          <div key={d.rotulo}>
            <dt className="text-muted">{d.rotulo}</dt>
            <dd className="font-medium">{d.valor}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4">{acoes}</div>
    </li>
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

      <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface">
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
              className="inline-flex items-center justify-center rounded-md border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-background"
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
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold text-brand">{titulo}</h2>
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
