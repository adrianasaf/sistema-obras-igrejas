"use client";

import { useId, useState, type ReactNode } from "react";

export type Aba = { id: string; rotulo: string; conteudo: ReactNode };

// Abas acessíveis (tablist/tab/tabpanel) com navegação por teclado.
// A lista rola horizontalmente em telas estreitas.
export function Abas({ itens }: { itens: Aba[] }) {
  const [atual, setAtual] = useState(itens[0]?.id);
  const base = useId();

  const irPara = (passo: number) => {
    const i = itens.findIndex((a) => a.id === atual);
    const proximo = (i + passo + itens.length) % itens.length;
    setAtual(itens[proximo].id);
    document.getElementById(`${base}-aba-${itens[proximo].id}`)?.focus();
  };

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="Etapas da obra"
          className="flex min-w-max gap-1 border-b border-border"
        >
          {itens.map((aba) => {
            const ativa = aba.id === atual;
            return (
              <button
                key={aba.id}
                id={`${base}-aba-${aba.id}`}
                role="tab"
                type="button"
                aria-selected={ativa}
                aria-controls={`${base}-painel-${aba.id}`}
                tabIndex={ativa ? 0 : -1}
                onClick={() => setAtual(aba.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    irPara(1);
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    irPara(-1);
                  }
                }}
                className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 ${
                  ativa
                    ? "border-brand text-brand"
                    : "border-transparent text-muted hover:border-border hover:text-foreground"
                }`}
              >
                {aba.rotulo}
              </button>
            );
          })}
        </div>
      </div>

      {itens.map((aba) => (
        <div
          key={aba.id}
          id={`${base}-painel-${aba.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-aba-${aba.id}`}
          hidden={aba.id !== atual}
          className="pt-6"
        >
          {aba.id === atual && aba.conteudo}
        </div>
      ))}
    </div>
  );
}
