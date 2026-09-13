// Definições do fluxo de aprovação das solicitações de obras.
//
// Sequência corrigida em DEC-013: quatro etapas internas. O Pastor Local
// apenas solicita (ou delega) e não aprova; o Presbitério não decide no
// sistema — depois da aprovação da CONBENS o pedido vai ao SGI (sistema
// externo) e o resultado é registrado à parte (ver `ResultadoSgi`).
//
// Regras do fluxo em DEC-010. PENDENTE DE DEFINIÇÃO: quem reenvia após
// correção e se uma reprovação pode ser reaberta (PEN-024).

export const NIVEIS_APROVACAO = [
  "Coordenador do Polo",
  "Coordenador da Área",
  "Coordenador da Região",
  "Responsável CONBENS",
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
  if (situacao === "Aprovada") return "Aprovada pela CONBENS";
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

/* ------------------------------------------------------- resultado do SGI */

// Depois da aprovação da CONBENS, o pedido é levado ao SGI (sistema externo,
// oficial da Igreja Cristã Maranata) por alguém da equipe da CONBENS. O
// resultado é registrado manualmente no sistema, fora das etapas do fluxo.
// A tela desse registro será feita em etapa futura.
export const SITUACOES_SGI = [
  "Aguardando SGI",
  "Aprovado no SGI",
  "Reprovado no SGI",
] as const;
export type SituacaoSgi = (typeof SITUACOES_SGI)[number];

export type ResultadoSgi = {
  situacao: SituacaoSgi;
  valorAprovado: number | null;
  data: string | null; // ISO (AAAA-MM-DD)
  registradoPor: string | null;
  registradoEm: string | null;
};

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

// Perfis que registram o resultado do SGI (DEC-013): a equipe da CONBENS leva
// o pedido ao SGI, e o Administrador pode registrar em nome dela.
export const PERFIS_SGI = ["Administrador", "Responsável CONBENS"] as const;

// Impedimento para registrar o resultado do SGI, ou null se pode registrar.
// O registro só abre depois da aprovação de todas as etapas.
export function impedimentoParaRegistrarSgi(
  perfil: string | null,
  situacaoFluxo: SituacaoFluxo,
): string | null {
  if (!perfil) return "Seu usuário não tem perfil de acesso definido.";
  if (situacaoFluxo !== "Aprovada") {
    return "O resultado do SGI só pode ser registrado depois da aprovação de todas as etapas.";
  }
  if (!(PERFIS_SGI as readonly string[]).includes(perfil)) {
    return `Seu perfil (${perfil}) não registra o resultado do SGI. Isso é feito pela CONBENS.`;
  }
  return null;
}

export function podeRegistrarSgi(
  perfil: string | null,
  situacaoFluxo: SituacaoFluxo,
): boolean {
  return impedimentoParaRegistrarSgi(perfil, situacaoFluxo) === null;
}

// Validação do resultado informado: o valor aprovado é obrigatório apenas
// quando a situação é "Aprovado no SGI".
export function validarResultadoSgi(dados: {
  situacao: SituacaoSgi;
  valorAprovado: number | null;
}): string | null {
  if (dados.situacao === "Aprovado no SGI") {
    if (dados.valorAprovado === null) {
      return "Informe o valor aprovado no SGI.";
    }
    if (!(dados.valorAprovado > 0)) {
      return "O valor aprovado deve ser maior que zero.";
    }
  }
  return null;
}

// Rótulo do status geral da obra, juntando fluxo interno e resultado do SGI.
export function rotuloStatusGeral(
  situacaoFluxo: SituacaoFluxo,
  etapaAtual: number,
  situacaoSgi: SituacaoSgi,
): string {
  if (situacaoFluxo !== "Aprovada") {
    return rotuloSituacao(situacaoFluxo, etapaAtual);
  }
  if (situacaoSgi === "Aprovado no SGI") return "Aprovada para execução";
  if (situacaoSgi === "Reprovado no SGI") return "Reprovada no SGI";
  return "Aprovada pela CONBENS · aguardando SGI";
}

// Cor do status geral, reaproveitando a paleta das situações de aprovação.
export function corStatusGeral(
  situacaoFluxo: SituacaoFluxo,
  situacaoSgi: SituacaoSgi,
): SituacaoAprovacao {
  if (situacaoFluxo !== "Aprovada") return situacaoComoAprovacao(situacaoFluxo);
  if (situacaoSgi === "Aprovado no SGI") return "Aprovado";
  if (situacaoSgi === "Reprovado no SGI") return "Reprovado";
  return "Aguardando";
}
