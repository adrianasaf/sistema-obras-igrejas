// Definições do fluxo de aprovação das solicitações de obras.
//
// Sequência e situações informadas pelo responsável do projeto (DEC-008) e
// regras do fluxo registradas em DEC-010. PENDENTE DE DEFINIÇÃO: quem pode
// decidir em cada etapa (PEN-023), quem reenvia após correção e se uma
// reprovação pode ser reaberta (PEN-024), além de prazos e alçadas (PEN-004).

export const NIVEIS_APROVACAO = [
  "Pastor Local",
  "Coordenador do Polo",
  "Coordenador da Área",
  "Coordenador da Região",
  "Responsável COMBENS",
  "Presbitério",
] as const;
export type NivelAprovacao = (typeof NIVEIS_APROVACAO)[number];

export const TOTAL_ETAPAS = NIVEIS_APROVACAO.length;

// Decisões possíveis em cada etapa.
export const DECISOES = [
  "Aprovado",
  "Reprovado",
  "Correção solicitada",
] as const;
export type Decisao = (typeof DECISOES)[number];

// Registro de reenvio após correção (não é decisão de etapa, mas entra no
// histórico para o fluxo ficar rastreável).
export const REENVIO = "Reenviada após correção";
export type RegistroDecisao = Decisao | typeof REENVIO;

// Situações possíveis de cada aprovação na linha do tempo.
export const SITUACOES_APROVACAO = [
  "Aguardando",
  "Aprovado",
  "Reprovado",
  "Correção solicitada",
] as const;
export type SituacaoAprovacao = (typeof SITUACOES_APROVACAO)[number];

// Situação do fluxo como um todo.
export const SITUACOES_FLUXO = [
  "Em andamento",
  "Em correção",
  "Reprovada",
  "Aprovada",
] as const;
export type SituacaoFluxo = (typeof SITUACOES_FLUXO)[number];

export function nivelDaEtapa(etapa: number): NivelAprovacao {
  return NIVEIS_APROVACAO[etapa - 1];
}

// Etapa (1 a 6) do nível informado.
export function etapaDoNivel(nivel: NivelAprovacao): number {
  return NIVEIS_APROVACAO.indexOf(nivel) + 1;
}

// Texto do status atual da solicitação, para exibição.
export function rotuloSituacao(
  situacao: SituacaoFluxo,
  etapaAtual: number,
): string {
  if (situacao === "Aprovada") return "Aprovada em todas as etapas";
  if (situacao === "Reprovada") return "Reprovada";
  if (situacao === "Em correção") return "Correção solicitada";
  return `Aguardando ${nivelDaEtapa(etapaAtual)}`;
}

// Cor (crachá) equivalente à situação do fluxo, reaproveitando a paleta das
// situações de aprovação.
export function situacaoComoAprovacao(
  situacao: SituacaoFluxo,
): SituacaoAprovacao {
  if (situacao === "Aprovada") return "Aprovado";
  if (situacao === "Reprovada") return "Reprovado";
  if (situacao === "Em correção") return "Correção solicitada";
  return "Aguardando";
}

export function fluxoEncerrado(situacao: SituacaoFluxo): boolean {
  return situacao === "Aprovada" || situacao === "Reprovada";
}

export type EstadoFluxo = { etapaAtual: number; situacao: SituacaoFluxo };

// Próximo estado depois de uma decisão na etapa atual.
export function proximoEstado(
  etapa: number,
  decisao: Decisao,
): EstadoFluxo {
  if (decisao === "Reprovado") {
    return { etapaAtual: etapa, situacao: "Reprovada" };
  }
  if (decisao === "Correção solicitada") {
    return { etapaAtual: etapa, situacao: "Em correção" };
  }
  // Aprovado: avança uma etapa; na última etapa, conclui o fluxo.
  return etapa >= TOTAL_ETAPAS
    ? { etapaAtual: etapa, situacao: "Aprovada" }
    : { etapaAtual: etapa + 1, situacao: "Em andamento" };
}

// Devolve a mensagem do impedimento, ou null se a decisão pode ser registrada.
export function impedimentoParaDecidir(
  estado: EstadoFluxo,
  etapa: number,
): string | null {
  if (estado.situacao === "Aprovada") {
    return "O fluxo já foi concluído: todas as etapas foram aprovadas.";
  }
  if (estado.situacao === "Reprovada") {
    return "O fluxo foi encerrado por reprovação.";
  }
  if (estado.situacao === "Em correção") {
    return "A solicitação está aguardando correção. Reenvie para análise antes de registrar uma nova decisão.";
  }
  if (etapa !== estado.etapaAtual) {
    return `Etapa inválida: a solicitação está na etapa ${estado.etapaAtual} (${nivelDaEtapa(estado.etapaAtual)}). Não é possível pular etapas.`;
  }
  return null;
}

// Devolve a mensagem do impedimento para reenviar, ou null se pode reenviar.
export function impedimentoParaReenviar(estado: EstadoFluxo): string | null {
  return estado.situacao === "Em correção"
    ? null
    : "Só é possível reenviar uma solicitação que está com correção solicitada.";
}
