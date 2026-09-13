"use server";

import { revalidatePath } from "next/cache";
import { DECISOES, type Decisao } from "@/lib/aprovacao";
import { motivoSemEscopo, temEscopoSobreObra } from "@/lib/escopo";
import { podeDecidirEtapa } from "@/lib/permissoes";
import { sessaoAtual } from "@/lib/sessao";
import {
  ErroFluxo,
  registrarDecisao,
  reenviarAposCorrecao,
} from "@/lib/fluxo-aprovacao";
import { buscarObra } from "@/lib/obras-db";

export type Resultado = { ok: boolean; mensagem: string };

// Identifica quem está agindo e confere, no servidor: perfil definido, etapa
// do seu nível (DEC-011) e escopo sobre a obra (DEC-014) — um Coordenador de
// Polo só decide obras do seu polo.
async function autorizar(obraId: string, etapa?: number) {
  const sessao = await sessaoAtual();
  if (!sessao) throw new ErroFluxo("Sessão expirada. Entre novamente.");
  if (!sessao.perfil) {
    throw new ErroFluxo(
      "Seu usuário não tem perfil de acesso definido. Fale com o administrador.",
    );
  }
  if (etapa !== undefined && !podeDecidirEtapa(sessao.perfil, etapa)) {
    throw new ErroFluxo(
      `Seu perfil (${sessao.perfil}) não pode registrar a decisão desta etapa.`,
    );
  }

  const obra = await buscarObra(obraId);
  if (!obra) throw new ErroFluxo("Solicitação não encontrada.");
  if (!temEscopoSobreObra(sessao, obra)) {
    throw new ErroFluxo(motivoSemEscopo(sessao));
  }

  return { id: sessao.id, nome: sessao.nome, email: sessao.email };
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
    if (!DECISOES.includes(decisao)) throw new ErroFluxo("Decisão inválida.");
    if (!Number.isInteger(etapa)) throw new ErroFluxo("Etapa inválida.");
    if (decisao !== "Aprovado" && !comentario.trim()) {
      throw new ErroFluxo(
        "Informe o comentário: reprovação e pedido de correção exigem justificativa.",
      );
    }

    const usuario = await autorizar(obraId, etapa);
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
    const usuario = await autorizar(obraId);
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
