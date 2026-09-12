"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgePrioridade, BadgeStatus } from "@/components/badges";
import { CORES_PRIORIDADE, CORES_STATUS } from "@/lib/cores";
import {
  PRIORIDADES,
  STATUS_OBRA,
  formatarData,
  formatarValor,
  valoresDemonstrativos,
  type Obra,
  type Prioridade,
  type StatusObra,
} from "@/lib/obras-mock";

// Filtros e busca funcionam apenas sobre os dados demonstrativos carregados
// na tela: não há consulta a banco de dados.
export function ListaObras({ obras }: { obras: Obra[] }) {
  const [busca, setBusca] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | "Todas">("Todas");
  const [status, setStatus] = useState<StatusObra | "Todos">("Todos");

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return obras.filter((o) => {
      const atendeBusca =
        termo === "" ||
        [o.igreja, o.titulo, o.tipo, o.id].some((campo) =>
          campo.toLowerCase().includes(termo),
        );
      const atendePrioridade =
        prioridade === "Todas" || o.prioridade === prioridade;
      const atendeStatus = status === "Todos" || o.status === status;
      return atendeBusca && atendePrioridade && atendeStatus;
    });
  }, [obras, busca, prioridade, status]);

  const limpar = () => {
    setBusca("");
    setPrioridade("Todas");
    setStatus("Todos");
  };

  const filtrando =
    busca !== "" || prioridade !== "Todas" || status !== "Todos";

  return (
    <div className="space-y-4">
      {/* Busca e filtros */}
      <div className="space-y-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="busca" className="sr-only">
            Buscar obras
          </label>
          <div className="relative flex-1">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted"
            >
              ⌕
            </span>
            <input
              id="busca"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por igreja, título, tipo ou número"
              className="w-full rounded-md border border-border bg-surface py-2 pr-3 pl-8 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
            />
          </div>
          {filtrando && (
            <button
              type="button"
              onClick={limpar}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-background"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <GrupoFiltro
          rotulo="Prioridade"
          opcoes={["Todas", ...PRIORIDADES]}
          atual={prioridade}
          aoEscolher={(v) => setPrioridade(v as Prioridade | "Todas")}
          cor={(v) =>
            v === "Todas" ? undefined : CORES_PRIORIDADE[v as Prioridade].ponto
          }
        />

        <GrupoFiltro
          rotulo="Status"
          opcoes={["Todos", ...STATUS_OBRA]}
          atual={status}
          aoEscolher={(v) => setStatus(v as StatusObra | "Todos")}
          cor={(v) =>
            v === "Todos" ? undefined : CORES_STATUS[v as StatusObra].ponto
          }
        />
      </div>

      <p className="text-xs text-muted" role="status">
        {filtradas.length} de {obras.length}{" "}
        {obras.length === 1 ? "obra" : "obras"}
      </p>

      {filtradas.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-5 py-8 text-center text-sm text-muted">
          Nenhuma obra encontrada com os filtros aplicados.
        </p>
      ) : (
        <>
          {/* Tabela (tablet e computador) */}
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
            <table className="w-full text-sm">
              <thead className="bg-background text-left text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Igreja</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Prioridade</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Valor estimado
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Detalhes</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtradas.map((o) => (
                  <tr key={o.id} className="hover:bg-background">
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.igreja}</p>
                      <p className="text-xs text-muted">{o.titulo}</p>
                    </td>
                    <td className="px-4 py-3">{o.tipo}</td>
                    <td className="px-4 py-3">
                      <BadgePrioridade valor={o.prioridade} />
                    </td>
                    <td className="px-4 py-3">
                      <BadgeStatus valor={o.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatarData(o.data)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                      {formatarValor(valoresDemonstrativos(o).estimado)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/obras/${o.id}`}
                        className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-brand whitespace-nowrap hover:bg-background"
                      >
                        Abrir detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartões (celular) */}
          <ul className="space-y-3 md:hidden">
            {filtradas.map((o) => (
              <li
                key={o.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <p className="text-xs text-muted">{o.igreja}</p>
                <p className="mt-0.5 font-medium text-brand">{o.titulo}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <BadgePrioridade valor={o.prioridade} />
                  <BadgeStatus valor={o.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-muted">Tipo</dt>
                    <dd className="font-medium">{o.tipo}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Data</dt>
                    <dd className="font-medium">{formatarData(o.data)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted">Valor estimado</dt>
                    <dd className="font-medium tabular-nums">
                      {formatarValor(valoresDemonstrativos(o).estimado)}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/obras/${o.id}`}
                  className="mt-4 flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium text-brand hover:bg-background"
                >
                  Abrir detalhes
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function GrupoFiltro({
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
  cor: (valor: string) => string | undefined;
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
          const ponto = cor(opcao);
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
