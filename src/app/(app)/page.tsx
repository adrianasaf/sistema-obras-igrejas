import type { Metadata } from "next";
import Link from "next/link";
import { BadgePrioridade, BadgeStatus } from "@/components/badges";
import { CORES_PRIORIDADE, CORES_STATUS } from "@/lib/cores";
import {
  OBRAS,
  formatarData,
  formatarValor,
  valoresDemonstrativos,
  type Obra,
} from "@/lib/obras-mock";

export const metadata: Metadata = { title: "Dashboard" };

// Indicadores calculados sobre os dados DEMONSTRATIVOS de src/lib/obras-mock.ts.
// A apuração no banco será feita em etapa futura (docs/08-ROADMAP.md).
const contar = (filtro: (o: Obra) => boolean) => OBRAS.filter(filtro).length;

const CARTOES = [
  {
    rotulo: "Obras totais",
    total: OBRAS.length,
    barra: "bg-brand",
    texto: "text-brand",
    href: "/obras",
  },
  {
    rotulo: "Emergenciais",
    total: contar((o) => o.prioridade === "Emergencial"),
    ...CORES_PRIORIDADE.Emergencial,
    href: "/obras",
  },
  {
    rotulo: "Prioridade 1",
    total: contar((o) => o.prioridade === "Prioridade 1"),
    ...CORES_PRIORIDADE["Prioridade 1"],
    href: "/obras",
  },
  {
    rotulo: "Prioridade 2",
    total: contar((o) => o.prioridade === "Prioridade 2"),
    ...CORES_PRIORIDADE["Prioridade 2"],
    href: "/obras",
  },
  {
    rotulo: "Prioridade 3",
    total: contar((o) => o.prioridade === "Prioridade 3"),
    ...CORES_PRIORIDADE["Prioridade 3"],
    href: "/obras",
  },
  {
    rotulo: "Em análise",
    total: contar((o) => o.status === "Em análise"),
    ...CORES_STATUS["Em análise"],
    href: "/obras",
  },
  {
    rotulo: "Em execução",
    total: contar((o) => o.status === "Em execução"),
    ...CORES_STATUS["Em execução"],
    href: "/obras",
  },
  {
    rotulo: "Concluídas",
    total: contar((o) => o.status === "Concluída"),
    ...CORES_STATUS.Concluída,
    href: "/obras",
  },
];

// Totais monetários demonstrativos: soma dos valores de exemplo de cada obra.
const VALORES = OBRAS.map(valoresDemonstrativos);
const TOTAL_ESTIMADO = VALORES.reduce((t, v) => t + v.estimado, 0);
const TOTAL_APROVADO = VALORES.reduce((t, v) => t + (v.aprovado ?? 0), 0);

const porData = (a: Obra, b: Obra) => b.data.localeCompare(a.data);

export default function Dashboard() {
  const recentes = [...OBRAS].sort(porData).slice(0, 5);

  // "Aguardando aprovação": solicitações ainda sem decisão. Os estágios oficiais
  // de aprovação estão PENDENTES DE DEFINIÇÃO (docs/11-PENDENCIAS.md, PEN-004).
  const aguardando = [...OBRAS]
    .filter((o) => o.status === "Solicitada" || o.status === "Em análise")
    .sort(porData);

  const andamento = [...OBRAS]
    .filter((o) => o.status === "Em execução")
    .sort(porData);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Visão geral das obras das igrejas. Dados demonstrativos.
        </p>
      </div>

      {/* Cartões de resumo */}
      <section aria-labelledby="resumo">
        <h2 id="resumo" className="sr-only">
          Resumo das obras
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
          {CARTOES.map((c) => (
            <li key={c.rotulo}>
              <Link
                href={c.href}
                className="flex h-full overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-md"
              >
                <span aria-hidden="true" className={`w-1.5 shrink-0 ${c.barra}`} />
                <span className="flex min-w-0 flex-1 flex-col justify-between p-4">
                  <span className="truncate text-xs font-medium text-muted">
                    {c.rotulo}
                  </span>
                  <span
                    className={`mt-2 text-3xl leading-none font-semibold tabular-nums ${c.texto}`}
                  >
                    {c.total}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:gap-4">
          <li>
            <CartaoValor
              rotulo="Valor total estimado"
              valor={TOTAL_ESTIMADO}
              descricao="Material e mão de obra de todas as obras."
            />
          </li>
          <li>
            <CartaoValor
              rotulo="Valor total aprovado"
              valor={TOTAL_APROVADO}
              descricao="Obras aprovadas, em execução e concluídas."
              destaque
            />
          </li>
        </ul>

        <p className="mt-3 text-xs text-muted">
          Indicadores demonstrativos; ainda não calculados a partir do banco de
          dados.
        </p>
      </section>

      {/* Obras recentes */}
      <Painel
        titulo="Obras recentes"
        descricao="Últimas solicitações registradas."
        vazio="Nenhuma obra registrada."
        obras={recentes}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Painel
          titulo="Aguardando aprovação"
          descricao="Solicitadas ou em análise."
          vazio="Nada aguardando aprovação."
          obras={aguardando}
        />
        <Painel
          titulo="Obras em andamento"
          descricao="Obras em execução."
          vazio="Nenhuma obra em execução."
          obras={andamento}
        />
      </div>
    </div>
  );
}

function CartaoValor({
  rotulo,
  valor,
  descricao,
  destaque,
}: {
  rotulo: string;
  valor: number;
  descricao: string;
  destaque?: boolean;
}) {
  return (
    <div
      className={`flex h-full overflow-hidden rounded-lg border bg-surface ${
        destaque ? "border-brand/30" : "border-border"
      }`}
    >
      <span
        aria-hidden="true"
        className={`w-1.5 shrink-0 ${destaque ? "bg-accent" : "bg-brand"}`}
      />
      <div className="min-w-0 flex-1 p-4">
        <p className="text-xs font-medium text-muted">{rotulo}</p>
        <p className="mt-2 text-2xl leading-none font-semibold tabular-nums text-brand">
          {formatarValor(valor)}
        </p>
        <p className="mt-2 text-xs text-muted">{descricao}</p>
      </div>
    </div>
  );
}

function Painel({
  titulo,
  descricao,
  vazio,
  obras,
}: {
  titulo: string;
  descricao: string;
  vazio: string;
  obras: Obra[];
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold text-brand">{titulo}</h2>
          <p className="text-xs text-muted">{descricao}</p>
        </div>
        <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted tabular-nums">
          {obras.length}
        </span>
      </div>

      {obras.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">{vazio}</p>
      ) : (
        <ul className="divide-y divide-border">
          {obras.map((o) => (
            <li key={o.id}>
              <Link
                href={`/obras/${o.id}`}
                className="flex flex-col gap-2 px-5 py-3 hover:bg-background sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.titulo}</p>
                  <p className="truncate text-xs text-muted">
                    {o.igreja} · {o.tipo} · {formatarData(o.data)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <BadgePrioridade valor={o.prioridade} />
                  <BadgeStatus valor={o.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
