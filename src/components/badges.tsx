import {
  CORES_APROVACAO,
  CORES_FASE,
  CORES_PRIORIDADE,
  CORES_STATUS,
} from "@/lib/cores";
import type {
  SituacaoAprovacao,
  SituacaoFase,
} from "@/lib/obra-detalhe-mock";
import type { Prioridade, StatusObra } from "@/lib/obras-mock";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function BadgePrioridade({ valor }: { valor: Prioridade }) {
  const cor = CORES_PRIORIDADE[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}

export function BadgeStatus({ valor }: { valor: StatusObra }) {
  const cor = CORES_STATUS[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}

export function BadgeAprovacao({ valor }: { valor: SituacaoAprovacao }) {
  const cor = CORES_APROVACAO[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}

export function BadgeFase({ valor }: { valor: SituacaoFase }) {
  const cor = CORES_FASE[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}
