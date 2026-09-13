"use server";

import { revalidatePath } from "next/cache";
import {
  SITUACOES_SGI,
  impedimentoParaRegistrarSgi,
  type SituacaoSgi,
} from "@/lib/aprovacao";
import {
  ErroFluxo,
  obterFluxo,
  registrarResultadoSgi,
} from "@/lib/fluxo-aprovacao";
import { buscarObra } from "@/lib/obras-db";
import { sessaoAtual } from "@/lib/sessao";

export type Resultado = { ok: boolean; mensagem: string };

// Registro do resultado que veio do SGI (sistema externo). Quem registra é a
// CONBENS ou o Administrador, e só depois da aprovação de todas as etapas
// (DEC-013). Não há escopo por vínculo aqui: os dois perfis são de
// abrangência geral.
export async function registrarSgiAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  const obraId = String(dados.get("obraId") ?? "");

  try {
    const sessao = await sessaoAtual();
    if (!sessao) throw new ErroFluxo("Sessão expirada. Entre novamente.");
    if (!(await buscarObra(obraId))) {
      throw new ErroFluxo("Solicitação não encontrada.");
    }

    const fluxo = await obterFluxo(obraId);
    const impedimento = impedimentoParaRegistrarSgi(
      sessao.perfil,
      fluxo.situacao,
    );
    if (impedimento) throw new ErroFluxo(impedimento);

    const situacao = String(dados.get("situacao") ?? "") as SituacaoSgi;
    if (!SITUACOES_SGI.includes(situacao)) {
      throw new ErroFluxo("Situação do SGI inválida.");
    }

    const atualizado = await registrarResultadoSgi({
      obraId,
      situacao,
      valorAprovado: valorMonetario(String(dados.get("valorAprovado") ?? "")),
      data: dataOpcional(String(dados.get("data") ?? "")),
      usuario: {
        id: sessao.id,
        nome: sessao.nome || sessao.email,
        email: sessao.email,
      },
    });

    revalidatePath(`/obras/${obraId}`);
    revalidatePath("/obras");

    return { ok: true, mensagem: mensagemDe(atualizado.sgi.situacao) };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

function mensagemDe(situacao: SituacaoSgi): string {
  if (situacao === "Aprovado no SGI") {
    return "Resultado registrado: a obra está aprovada para execução.";
  }
  if (situacao === "Reprovado no SGI") {
    return "Resultado registrado: reprovada no SGI.";
  }
  return "Registro atualizado: aguardando o resultado do SGI.";
}

// Aceita "48500", "48.500,00" ou "48500.00".
function valorMonetario(bruto: string): number | null {
  const texto = bruto.trim();
  if (!texto) return null;
  const numerico = Number(texto.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(numerico) || numerico < 0) {
    throw new ErroFluxo("Informe um valor aprovado válido.");
  }
  return numerico;
}

function dataOpcional(bruto: string): string | null {
  const texto = bruto.trim();
  return texto ? texto : null;
}

function descrever(erro: unknown): string {
  if (erro instanceof ErroFluxo) return erro.message;
  console.error("Erro ao registrar o resultado do SGI:", erro);
  return "Não foi possível registrar o resultado agora. Tente novamente em instantes.";
}
