"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import {
  salvarCadastroAction,
  type Resultado,
} from "@/components/estrutura/acoes";
import {
  botaoPrimario,
  botaoSecundario,
  cartao,
  classeCampo,
  classeRotulo,
} from "@/lib/ui";

export { classeCampo };

// Formulário de cadastro da estrutura administrativa. Grava no banco pela
// Server Action, que também confere a permissão.
export function FormularioCadastro({
  nivel,
  id,
  voltarHref,
  rotuloSalvar,
  children,
}: {
  nivel: "regiao" | "area" | "polo" | "igreja";
  id?: string;
  voltarHref: string;
  rotuloSalvar: string;
  children: ReactNode;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    salvarCadastroAction,
    null,
  );

  return (
    <form action={enviar} className={`${cartao} space-y-6 p-5 sm:p-6`}>
      <input type="hidden" name="nivel" value={nivel} />
      {id && <input type="hidden" name="id" value={id} />}

      <div className="grid gap-5 sm:grid-cols-2">{children}</div>

      {resultado && !pendente && (
        <p
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${
            resultado.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {resultado.mensagem}
          {resultado.ok && (
            <>
              {" "}
              <Link href={voltarHref} className="font-medium underline">
                Ver a lista
              </Link>
            </>
          )}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link href={voltarHref} className={botaoSecundario}>
          {resultado?.ok ? "Voltar" : "Cancelar"}
        </Link>
        <button
          type="submit"
          disabled={pendente}
          className={`${botaoPrimario} disabled:opacity-60`}
        >
          {pendente ? "Salvando…" : rotuloSalvar}
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
      <label htmlFor={id} className={classeRotulo}>
        {rotulo}
      </label>
      <div className="mt-1">{children}</div>
      {ajuda && <p className="mt-1 text-xs text-muted">{ajuda}</p>}
    </div>
  );
}
