"use client";

import type { ReactNode } from "react";
import { cartao, classeCampo } from "@/lib/ui";

// Barra de busca e filtros usada nas listas (Obras e Usuários).
export function BarraFiltros({ children }: { children: ReactNode }) {
  return <div className={`${cartao} space-y-4 p-4 sm:p-5`}>{children}</div>;
}

export function CampoBusca({
  id,
  rotulo,
  valor,
  aoDigitar,
  placeholder,
  aoLimpar,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoDigitar: (valor: string) => void;
  placeholder: string;
  aoLimpar?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label htmlFor={id} className="sr-only">
        {rotulo}
      </label>
      <div className="relative flex-1">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted"
        >
          ⌕
        </span>
        <input
          id={id}
          type="search"
          value={valor}
          onChange={(e) => aoDigitar(e.target.value)}
          placeholder={placeholder}
          className={`${classeCampo} pr-3 pl-8`}
        />
      </div>
      {aoLimpar && (
        <button
          type="button"
          onClick={aoLimpar}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-background"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

// Grupo de pílulas de filtro. `cor` devolve a classe do ponto colorido de cada
// opção (ou undefined para a opção "Todos").
export function GrupoFiltro({
  rotulo,
  opcoes,
  atual,
  aoEscolher,
  cor,
}: {
  rotulo: string;
  opcoes: readonly string[];
  atual: string;
  aoEscolher: (valor: string) => void;
  cor?: (valor: string) => string | undefined;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-xs font-medium text-muted sm:w-20">
        {rotulo}
      </span>
      <div
        role="group"
        aria-label={`Filtrar por ${rotulo.toLowerCase()}`}
        className="flex flex-wrap gap-2"
      >
        {opcoes.map((opcao) => {
          const ativa = opcao === atual;
          const ponto = cor?.(opcao);
          return (
            <button
              key={opcao}
              type="button"
              aria-pressed={ativa}
              onClick={() => aoEscolher(opcao)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                ativa
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {ponto && (
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${ativa ? "bg-white" : ponto}`}
                />
              )}
              {opcao}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ContadorResultados({
  total,
  totalGeral,
  singular,
  plural,
}: {
  total: number;
  totalGeral: number;
  singular: string;
  plural: string;
}) {
  return (
    <p className="text-xs text-muted" role="status">
      {total} de {totalGeral} {totalGeral === 1 ? singular : plural}
    </p>
  );
}
