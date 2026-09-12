// Paleta única de prioridades e status das obras.
// Toda a interface (crachás, cartões do dashboard, listas) usa estas classes,
// para que a mesma prioridade tenha sempre a mesma cor em qualquer tela.

import type { StatusMaterial } from "@/lib/estoque-mock";
import type { StatusCadastro } from "@/lib/estrutura-mock";
import type {
  SituacaoAprovacao,
  SituacaoFase,
  SituacaoOrcamento,
} from "@/lib/obra-detalhe-mock";
import type { Prioridade, StatusObra } from "@/lib/obras-mock";

export type Paleta = {
  cracha: string; // crachá (borda + fundo + texto)
  ponto: string; // marcador circular
  barra: string; // faixa lateral/superior de cartões
  texto: string; // números e destaques
};

export const CORES_PRIORIDADE: Record<Prioridade, Paleta> = {
  Emergencial: {
    cracha: "border-red-200 bg-red-50 text-red-700",
    ponto: "bg-red-600",
    barra: "bg-red-600",
    texto: "text-red-700",
  },
  "Prioridade 1": {
    cracha: "border-orange-200 bg-orange-50 text-orange-700",
    ponto: "bg-orange-500",
    barra: "bg-orange-500",
    texto: "text-orange-700",
  },
  "Prioridade 2": {
    cracha: "border-amber-200 bg-amber-50 text-amber-800",
    ponto: "bg-amber-400",
    barra: "bg-amber-400",
    texto: "text-amber-700",
  },
  "Prioridade 3": {
    cracha: "border-sky-200 bg-sky-50 text-sky-700",
    ponto: "bg-sky-500",
    barra: "bg-sky-500",
    texto: "text-sky-700",
  },
};

export const CORES_STATUS: Record<StatusObra, Paleta> = {
  Solicitada: {
    cracha: "border-slate-200 bg-slate-50 text-slate-700",
    ponto: "bg-slate-400",
    barra: "bg-slate-400",
    texto: "text-slate-700",
  },
  "Em análise": {
    cracha: "border-blue-200 bg-blue-50 text-blue-700",
    ponto: "bg-blue-500",
    barra: "bg-blue-500",
    texto: "text-blue-700",
  },
  Aprovada: {
    cracha: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ponto: "bg-emerald-500",
    barra: "bg-emerald-500",
    texto: "text-emerald-700",
  },
  "Em execução": {
    cracha: "border-violet-200 bg-violet-50 text-violet-700",
    ponto: "bg-violet-500",
    barra: "bg-violet-500",
    texto: "text-violet-700",
  },
  Concluída: {
    cracha: "border-green-200 bg-green-100 text-green-800",
    ponto: "bg-green-600",
    barra: "bg-green-600",
    texto: "text-green-700",
  },
};

// Situações de cada aprovação hierárquica (aba Aprovações).
export const CORES_APROVACAO: Record<SituacaoAprovacao, Paleta> = {
  Aguardando: {
    cracha: "border-slate-200 bg-slate-50 text-slate-600",
    ponto: "bg-slate-300",
    barra: "bg-slate-300",
    texto: "text-slate-600",
  },
  Aprovado: {
    cracha: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ponto: "bg-emerald-500",
    barra: "bg-emerald-500",
    texto: "text-emerald-700",
  },
  Reprovado: {
    cracha: "border-red-200 bg-red-50 text-red-700",
    ponto: "bg-red-600",
    barra: "bg-red-600",
    texto: "text-red-700",
  },
  "Correção solicitada": {
    cracha: "border-amber-200 bg-amber-50 text-amber-800",
    ponto: "bg-amber-500",
    barra: "bg-amber-500",
    texto: "text-amber-700",
  },
};

// Situações das cinco fases de execução (aba Execução).
export const CORES_FASE: Record<SituacaoFase, Paleta> = {
  "Não iniciada": {
    cracha: "border-slate-200 bg-slate-50 text-slate-600",
    ponto: "bg-slate-300",
    barra: "bg-slate-300",
    texto: "text-slate-600",
  },
  "Em andamento": {
    cracha: "border-violet-200 bg-violet-50 text-violet-700",
    ponto: "bg-violet-500",
    barra: "bg-violet-500",
    texto: "text-violet-700",
  },
  Concluída: {
    cracha: "border-green-200 bg-green-100 text-green-800",
    ponto: "bg-green-600",
    barra: "bg-green-600",
    texto: "text-green-700",
  },
};

// Situações de cada orçamento recebido (aba Orçamentos).
export const CORES_ORCAMENTO: Record<SituacaoOrcamento, Paleta> = {
  "Não recebido": {
    cracha: "border-slate-200 bg-surface text-slate-600",
    ponto: "bg-slate-300",
    barra: "bg-slate-300",
    texto: "text-slate-600",
  },
  Recebido: {
    cracha: "border-blue-200 bg-blue-50 text-blue-700",
    ponto: "bg-blue-500",
    barra: "bg-blue-500",
    texto: "text-blue-700",
  },
  Selecionado: {
    cracha: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ponto: "bg-emerald-500",
    barra: "bg-emerald-500",
    texto: "text-emerald-700",
  },
};

// Situação do saldo de cada material (tela Estoque).
export const CORES_ESTOQUE: Record<StatusMaterial, Paleta> = {
  Normal: {
    cracha: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ponto: "bg-emerald-500",
    barra: "bg-emerald-500",
    texto: "text-emerald-700",
  },
  "Abaixo do mínimo": {
    cracha: "border-amber-200 bg-amber-50 text-amber-800",
    ponto: "bg-amber-500",
    barra: "bg-amber-500",
    texto: "text-amber-700",
  },
  "Em falta": {
    cracha: "border-red-200 bg-red-50 text-red-700",
    ponto: "bg-red-600",
    barra: "bg-red-600",
    texto: "text-red-700",
  },
};

// Situação dos cadastros da estrutura administrativa (região, área, polo,
// igreja).
export const CORES_CADASTRO: Record<StatusCadastro, Paleta> = {
  Ativo: {
    cracha: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ponto: "bg-emerald-500",
    barra: "bg-emerald-500",
    texto: "text-emerald-700",
  },
  Inativo: {
    cracha: "border-slate-200 bg-slate-50 text-slate-600",
    ponto: "bg-slate-400",
    barra: "bg-slate-400",
    texto: "text-slate-600",
  },
};
