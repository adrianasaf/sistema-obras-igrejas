"use client";

import { useState } from "react";
import { BadgeOrcamento } from "@/components/badges";
import {
  CATEGORIAS_ORCAMENTO,
  type CategoriaOrcamento,
  type DetalheObra,
} from "@/lib/obra-detalhe-mock";
import { formatarData, formatarValor } from "@/lib/obras-mock";
import { botaoBase, cartao, tituloSecao } from "@/lib/ui";

type Selecao = Record<CategoriaOrcamento, number | null>;

// A seleção do orçamento é apenas visual: nada é gravado e nenhuma regra de
// aprovação é aplicada (quem escolhe e quem aprova: PENDENTE, PEN-008).
export function OrcamentosPainel({
  orcamentos,
  valorAprovado,
}: {
  orcamentos: DetalheObra["orcamentos"];
  valorAprovado?: number;
}) {
  const [selecao, setSelecao] = useState<Selecao>(() => ({
    Material: indiceInicial(orcamentos.Material),
    "Mão de obra": indiceInicial(orcamentos["Mão de obra"]),
  }));

  const totalDe = (categoria: CategoriaOrcamento) => {
    const i = selecao[categoria];
    return i === null ? undefined : orcamentos[categoria][i].valor;
  };

  const totalMaterial = totalDe("Material");
  const totalMaoDeObra = totalDe("Mão de obra");
  const totalEstimado =
    totalMaterial === undefined && totalMaoDeObra === undefined
      ? undefined
      : (totalMaterial ?? 0) + (totalMaoDeObra ?? 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {CATEGORIAS_ORCAMENTO.map((categoria) => (
          <section
            key={categoria}
            className={`${cartao} p-5`}
          >
            <h2 className={tituloSecao}>{categoria}</h2>
            <p className="mt-1 text-xs text-muted">
              Três orçamentos previstos. Quantidade mínima e quem aprova ainda
              não estão definidos.
            </p>

            <ul className="mt-4 space-y-3">
              {orcamentos[categoria].map((o, i) => {
                const escolhido = selecao[categoria] === i;
                const indisponivel = o.situacao === "Não recebido";
                return (
                  <li
                    key={o.rotulo}
                    className={`rounded-md border p-4 transition-colors ${
                      escolhido
                        ? "border-emerald-300 bg-emerald-50/40"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{o.rotulo}</p>
                      <BadgeOrcamento
                        valor={escolhido ? "Selecionado" : o.situacao}
                      />
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-xs text-muted">
                          {categoria === "Material"
                            ? "Fornecedor"
                            : "Prestador"}
                        </dt>
                        <dd className="truncate text-sm">
                          {o.fornecedor ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Valor</dt>
                        <dd className="text-sm font-medium tabular-nums">
                          {o.valor !== undefined ? formatarValor(o.valor) : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Data</dt>
                        <dd className="text-sm">
                          {o.data ? formatarData(o.data) : "—"}
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      disabled={indisponivel}
                      aria-pressed={escolhido}
                      onClick={() =>
                        setSelecao((atual) => ({
                          ...atual,
                          [categoria]: escolhido ? null : i,
                        }))
                      }
                      className={`${botaoBase} mt-4 w-full ${
                        indisponivel
                          ? "cursor-not-allowed border border-border text-muted"
                          : escolhido
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "border border-brand text-brand hover:bg-brand hover:text-white"
                      }`}
                    >
                      {indisponivel
                        ? "Orçamento não recebido"
                        : escolhido
                          ? "✓ Selecionado"
                          : "Selecionar orçamento"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Resumo dos valores */}
      <section className={`${cartao} p-5`}>
        <h2 className={tituloSecao}>Resumo dos valores</h2>
        <p className="mt-1 text-xs text-muted">
          Calculado sobre os orçamentos selecionados nesta tela. A seleção é
          apenas visual e não é gravada.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Valor rotulo="Total material" valor={totalMaterial} />
          <Valor rotulo="Total mão de obra" valor={totalMaoDeObra} />
          <Valor rotulo="Total estimado" valor={totalEstimado} destaque />
          <Valor rotulo="Valor aprovado" valor={valorAprovado} destaque />
        </dl>
      </section>
    </div>
  );
}

function indiceInicial(lista: DetalheObra["orcamentos"][CategoriaOrcamento]) {
  const i = lista.findIndex((o) => o.situacao === "Selecionado");
  return i === -1 ? null : i;
}

function Valor({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string;
  valor?: number;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd
        className={`mt-1 text-lg font-semibold tabular-nums ${
          destaque ? "text-brand" : ""
        }`}
      >
        {valor !== undefined ? formatarValor(valor) : "—"}
      </dd>
    </div>
  );
}
