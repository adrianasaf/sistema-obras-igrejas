"use client";

import { useActionState } from "react";
import { botaoPrimario } from "@/lib/ui";
import { aplicarMigracaoAction, type Resultado } from "./acoes";

export function BotaoAplicar({ id, titulo }: { id: string; titulo: string }) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    aplicarMigracaoAction,
    null,
  );

  return (
    <form action={enviar} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pendente}
        className={`${botaoPrimario} disabled:opacity-60`}
      >
        {pendente ? "Aplicando…" : `Aplicar migração ${id}`}
      </button>
      <span className="sr-only">{titulo}</span>
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
        </p>
      )}
    </form>
  );
}
