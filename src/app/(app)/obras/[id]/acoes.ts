"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { DECISOES, type Decisao } from "@/lib/aprovacao";
import {
  ErroFluxo,
  registrarDecisao,
  reenviarAposCorrecao,
} from "@/lib/fluxo-aprovacao";
import { buscarObra } from "@/lib/obras-mock";

export type Resultado = { ok: boolean; mensagem: string };

// Identifica quem está decidindo. Quais perfis podem decidir em cada etapa
// ainda não está definido (PEN-023): por ora qualquer usuário autenticado
// pode registrar a decisão, e fica registrado quem foi.
async function usuarioAtual() {
  const user = await currentUser();
  if (!user) throw new ErroFluxo("Sessão expirada. Entre novamente.");
  const nome =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.primaryEmailAddress?.emailAddress ||
    "Usuário";
  return {
    id: user.id,
    nome,
    email: user.primaryEmailAddress?.emailAddress,
  };
}

export async function registrarDecisaoAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  const obraId = String(dados.get("obraId") ?? "");
  const etapa = Number(dados.get("etapa"));
  const decisao = String(dados.get("decisao") ?? "") as Decisao;
  const comentario = String(dados.get("comentario") ?? "");

  try {
    if (!buscarObra(obraId)) throw new ErroFluxo("Solicitação não encontrada.");
    if (!DECISOES.includes(decisao)) throw new ErroFluxo("Decisão inválida.");
    if (!Number.isInteger(etapa)) throw new ErroFluxo("Etapa inválida.");
    if (decisao !== "Aprovado" && !comentario.trim()) {
      throw new ErroFluxo(
        "Informe o comentário: reprovação e pedido de correção exigem justificativa.",
      );
    }

    const usuario = await usuarioAtual();
    const fluxo = await registrarDecisao({
      obraId,
      etapa,
      decisao,
      comentario,
      usuario,
    });

    revalidatePath(`/obras/${obraId}`);
    return { ok: true, mensagem: mensagemDe(decisao, fluxo.situacao) };
  } catch (erro) {
    return { ok: false, mensagem: descreverErro(erro) };
  }
}

export async function reenviarAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  const obraId = String(dados.get("obraId") ?? "");
  const comentario = String(dados.get("comentario") ?? "");

  try {
    if (!buscarObra(obraId)) throw new ErroFluxo("Solicitação não encontrada.");
    const usuario = await usuarioAtual();
    await reenviarAposCorrecao({ obraId, comentario, usuario });

    revalidatePath(`/obras/${obraId}`);
    return {
      ok: true,
      mensagem: "Solicitação reenviada para análise na mesma etapa.",
    };
  } catch (erro) {
    return { ok: false, mensagem: descreverErro(erro) };
  }
}

function mensagemDe(decisao: Decisao, situacao: string): string {
  if (decisao === "Reprovado")
    return "Reprovação registrada: o fluxo foi encerrado.";
  if (decisao === "Correção solicitada")
    return "Pedido de correção registrado: a solicitação aguarda ajuste na mesma etapa.";
  return situacao === "Aprovada"
    ? "Aprovação do Presbitério registrada: todas as etapas foram aprovadas."
    : "Aprovação registrada: a solicitação avançou para a próxima etapa.";
}

function descreverErro(erro: unknown): string {
  if (erro instanceof ErroFluxo) return erro.message;
  console.error("Erro no fluxo de aprovação:", erro);
  return "Não foi possível registrar a decisão. Tente novamente em instantes.";
}
