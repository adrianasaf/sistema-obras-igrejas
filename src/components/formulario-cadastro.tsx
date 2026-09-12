"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export const classeCampo =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none";

// Formulário visual de cadastro: nada é gravado. Os campos oficiais de cada
// cadastro ainda não estão definidos (PEN-002, PEN-011).
export function FormularioCadastro({
  voltarHref,
  rotuloSalvar,
  children,
}: {
  voltarHref: string;
  rotuloSalvar: string;
  children: ReactNode;
}) {
  const [enviado, setEnviado] = useState(false);

  return (
    <form
      className="space-y-6 rounded-lg border border-border bg-surface p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>

      {enviado && (
        <p
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          O cadastro ainda não é gravado: o banco de dados será configurado em
          uma etapa futura. Nenhum dado foi salvo.
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link
          href={voltarHref}
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
        >
          {rotuloSalvar}
        </button>
      </div>
    </form>
  );
}

export function Campo({
  id,
  rotulo,
  ajuda,
  largura = "metade",
  children,
}: {
  id: string;
  rotulo: string;
  ajuda?: string;
  largura?: "metade" | "inteira";
  children: ReactNode;
}) {
  return (
    <div className={largura === "inteira" ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="block text-sm font-medium">
        {rotulo}
      </label>
      <div className="mt-1">{children}</div>
      {ajuda && <p className="mt-1 text-xs text-muted">{ajuda}</p>}
    </div>
  );
}
