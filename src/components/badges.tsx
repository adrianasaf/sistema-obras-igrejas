import {
  CORES_ALTERACAO,
  CORES_APROVACAO,
  CORES_CADASTRO,
  CORES_ESTOQUE,
  CORES_FASE,
  CORES_ORCAMENTO,
  CORES_PERFIL,
  CORES_PRIORIDADE,
  CORES_STATUS,
} from "@/lib/cores";
import type { StatusMaterial } from "@/lib/estoque-db";
import {
  statusFeminino,
  type StatusCadastro,
} from "@/lib/estrutura-tipos";
import type { TipoAlteracao } from "@/lib/historico-mock";
import type { Perfil } from "@/lib/usuarios-mock";
import type { SituacaoAprovacao } from "@/lib/aprovacao";
import type { SituacaoFase } from "@/lib/obra-detalhe-mock";
import type { StatusCotacao } from "@/lib/orcamentos-db";
import type { StatusObra } from "@/lib/obras-mock";
import type { Prioridade } from "@/lib/obras-tipos";

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

// `rotulo` permite exibir um texto próprio (ex.: "Aguardando Presbitério")
// mantendo a cor da situação.
export function BadgeAprovacao({
  valor,
  rotulo,
}: {
  valor: SituacaoAprovacao;
  rotulo?: string;
}) {
  const cor = CORES_APROVACAO[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {rotulo ?? valor}
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

export function BadgeOrcamento({ valor }: { valor: StatusCotacao }) {
  const cor = CORES_ORCAMENTO[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}

export function BadgeEstoque({ valor }: { valor: StatusMaterial }) {
  const cor = CORES_ESTOQUE[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}

// `feminino` ajusta o rótulo para região, área e igreja (Ativa/Inativa).
export function BadgeCadastro({
  valor,
  feminino,
}: {
  valor: StatusCadastro;
  feminino?: boolean;
}) {
  const cor = CORES_CADASTRO[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {feminino ? statusFeminino(valor) : valor}
    </span>
  );
}

export function BadgeAlteracao({ valor }: { valor: TipoAlteracao }) {
  const cor = CORES_ALTERACAO[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}

export function BadgePerfil({ valor }: { valor: Perfil }) {
  const cor = CORES_PERFIL[valor];
  return (
    <span className={`${base} ${cor.cracha}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${cor.ponto}`} />
      {valor}
    </span>
  );
}
