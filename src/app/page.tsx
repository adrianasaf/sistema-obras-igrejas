import Link from "next/link";
import { BadgePrioridade, BadgeStatus } from "@/components/badges";
import { APP_SUBTITLE } from "@/lib/app";
import { OBRAS, formatarData } from "@/lib/obras-mock";

const HIERARQUIA = ["Região", "Área", "Polo", "Igreja"];

// Módulos previstos no roadmap (docs/08-ROADMAP.md). Apenas informativo.
const MODULOS = [
  { titulo: "Estrutura administrativa", descricao: "Cadastro de Região, Área, Polo e Igreja." },
  { titulo: "Aprovações e Presbitério", descricao: "Fluxo de aprovações hierárquicas, análise e orçamentos." },
  { titulo: "Execução em cinco fases", descricao: "Acompanhamento da obra, materiais, estoque e fotos." },
  { titulo: "Financeiro", descricao: "Controle dos valores e gastos de cada obra." },
  { titulo: "Relatórios e auditoria", descricao: "Indicadores e registro de quem fez o quê e quando." },
];

export default function Dashboard() {
  const recentes = [...OBRAS]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 4);

  const totalPorStatus = OBRAS.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">{APP_SUBTITLE}</p>
      </div>

      <section aria-labelledby="resumo">
        <h2 id="resumo" className="sr-only">
          Resumo das obras (dados demonstrativos)
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(totalPorStatus).map(([status, total]) => (
            <li
              key={status}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <p className="text-xs text-muted">{status}</p>
              <p className="mt-1 text-2xl font-semibold">{total}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Dados demonstrativos.</p>
      </section>

      <section className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-brand">Solicitações recentes</h2>
          <Link href="/obras" className="text-sm text-brand hover:underline">
            Ver todas
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {recentes.map((o) => (
            <li key={o.id}>
              <Link
                href={`/obras/${o.id}`}
                className="flex flex-col gap-2 px-5 py-3 hover:bg-background sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.titulo}</p>
                  <p className="text-xs text-muted">
                    {o.igreja} · {o.tipo} · {formatarData(o.data)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <BadgePrioridade valor={o.prioridade} />
                  <BadgeStatus valor={o.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-brand">Estrutura administrativa</h2>
        <p className="mt-1 text-sm text-muted">
          Cada igreja pertence a um polo, cada polo a uma área e cada área a
          uma região.
        </p>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {HIERARQUIA.map((nivel, i) => (
            <li key={nivel} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium">
                {nivel}
              </span>
              {i < HIERARQUIA.length - 1 && (
                <span aria-hidden="true" className="text-muted">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-semibold text-brand">Módulos previstos</h2>
        <p className="mt-1 text-sm text-muted">
          Serão disponibilizados gradualmente conforme o roadmap do projeto.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULOS.map((m) => (
            <li
              key={m.titulo}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="font-medium">{m.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {m.descricao}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
