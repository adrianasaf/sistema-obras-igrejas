"use client";

import { useState } from "react";
import { botaoBase, botaoPrimario } from "@/lib/ui";

// Botões visuais: nenhuma movimentação é registrada. As regras de estoque
// (central ou por igreja/polo, quem lança entradas e saídas) estão
// PENDENTES DE DEFINIÇÃO (PEN-014).
export function AcoesEstoque() {
  const [acao, setAcao] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAcao("Entrada")}
          className={`${botaoBase} border border-emerald-300 text-emerald-700 hover:bg-emerald-50`}
        >
          + Entrada
        </button>
        <button
          type="button"
          onClick={() => setAcao("Saída")}
          className={`${botaoBase} border border-amber-300 text-amber-800 hover:bg-amber-50`}
        >
          − Saída
        </button>
        <button
          type="button"
          onClick={() => setAcao("Novo material")}
          className={botaoPrimario}
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
