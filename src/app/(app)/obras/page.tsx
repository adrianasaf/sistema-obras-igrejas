import type { Metadata } from "next";
import Link from "next/link";
import { OBRAS } from "@/lib/obras-mock";
import { ListaObras } from "./lista";

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

      <ListaObras obras={obras} />
    </div>
  );
}
