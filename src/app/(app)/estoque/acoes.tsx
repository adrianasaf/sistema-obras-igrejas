"use client";

import { useState } from "react";

// Botões visuais: nenhuma movimentação é registrada. As regras de estoque
// (central ou por igreja/polo, quem lança entradas e saídas) estão
// PENDENTES DE DEFINIÇÃO (PEN-014).
export function AcoesEstoque() {
  const [acao, setAcao] = useState<string | null>(null);

  const botao =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAcao("Entrada")}
          className={`${botao} border border-emerald-300 text-emerald-700 hover:bg-emerald-50`}
        >
          + Entrada
        </button>
        <button
          type="button"
          onClick={() => setAcao("Saída")}
          className={`${botao} border border-amber-300 text-amber-800 hover:bg-amber-50`}
        >
          − Saída
        </button>
        <button
          type="button"
          onClick={() => setAcao("Novo material")}
          className={`${botao} bg-brand text-white hover:bg-brand-strong`}
        >
          Novo material
        </button>
      </div>

      {acao && (
        <p
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          &quot;{acao}&quot; é apenas visual nesta etapa: o módulo de estoque
          está previsto para a Fase 6 do roadmap. Nenhum dado foi alterado.
        </p>
      )}
    </div>
  );
}
