import type { Metadata } from "next";
import Link from "next/link";
import { BadgePrioridade, BadgeStatus } from "@/components/badges";
import { OBRAS, formatarData } from "@/lib/obras-mock";

export const metadata: Metadata = { title: "Obras" };

export default function ObrasPage() {
  const obras = [...OBRAS].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand">
            Obras
          </h1>
          <p className="mt-1 text-sm text-muted">
            Solicitações e obras das igrejas. Dados demonstrativos.
          </p>
        </div>
        <Link
          href="/obras/nova"
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
        >
          Nova Solicitação
        </Link>
      </div>

      {/* Tabela (computador) */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
        <table className="w-full text-sm">
          <thead className="bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Igreja</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Prioridade</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {obras.map((o) => (
              <tr key={o.id} className="hover:bg-background">
                <td className="px-4 py-3">
                  <Link
                    href={`/obras/${o.id}`}
                    className="font-medium text-brand hover:underline"
                  >
                    {o.igreja}
                  </Link>
                  <p className="text-xs text-muted">{o.titulo}</p>
                </td>
                <td className="px-4 py-3">{o.tipo}</td>
                <td className="px-4 py-3">
                  <BadgePrioridade valor={o.prioridade} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatarData(o.data)}
                </td>
                <td className="px-4 py-3">
                  <BadgeStatus valor={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartões (celular) */}
      <ul className="space-y-3 md:hidden">
        {obras.map((o) => (
          <li key={o.id}>
            <Link
              href={`/obras/${o.id}`}
              className="block rounded-lg border border-border bg-surface p-4"
            >
              <p className="font-medium text-brand">{o.igreja}</p>
              <p className="text-sm">{o.titulo}</p>
              <p className="mt-1 text-xs text-muted">
                {o.tipo} · {formatarData(o.data)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <BadgePrioridade valor={o.prioridade} />
                <BadgeStatus valor={o.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
