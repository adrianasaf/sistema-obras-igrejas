import type { Prioridade, StatusObra } from "@/lib/obras-mock";

const base =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

const corPrioridade: Record<Prioridade, string> = {
  Emergencial: "border-red-200 bg-red-50 text-red-700",
  "Prioridade 1": "border-orange-200 bg-orange-50 text-orange-700",
  "Prioridade 2": "border-amber-200 bg-amber-50 text-amber-700",
  "Prioridade 3": "border-slate-200 bg-slate-50 text-slate-700",
};

const corStatus: Record<StatusObra, string> = {
  Solicitada: "border-slate-200 bg-slate-50 text-slate-700",
  "Em análise": "border-blue-200 bg-blue-50 text-blue-700",
  Aprovada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Em execução": "border-violet-200 bg-violet-50 text-violet-700",
  Concluída: "border-green-200 bg-green-100 text-green-800",
};

export function BadgePrioridade({ valor }: { valor: Prioridade }) {
  return <span className={`${base} ${corPrioridade[valor]}`}>{valor}</span>;
}

export function BadgeStatus({ valor }: { valor: StatusObra }) {
  return <span className={`${base} ${corStatus[valor]}`}>{valor}</span>;
}
