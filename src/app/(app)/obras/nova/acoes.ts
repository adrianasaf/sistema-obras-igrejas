"use server";

import { revalidatePath } from "next/cache";
import { ErroObra, criarObra } from "@/lib/obras-db";
import { TIPOS_OBRA, type TipoObra } from "@/lib/obras-tipos";
import { exigirAcesso } from "@/lib/sessao";

export type Resultado = { ok: boolean; mensagem: string; id?: string };

// Grava a solicitação e abre o fluxo de aprovação. A prioridade não é
// informada aqui: quem define é o pastor responsável da CONBENS (DEC-013).
export async function criarSolicitacaoAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  try {
    const sessao = await exigirAcesso("obras");

    const igrejaId = String(dados.get("igreja") ?? "").trim();
    const tipo = String(dados.get("tipo") ?? "") as TipoObra;
    const titulo = String(dados.get("titulo") ?? "").trim();
    const descricao = String(dados.get("descricao") ?? "").trim();

    if (!igrejaId) throw new ErroObra("Escolha a igreja solicitante.");
    if (!TIPOS_OBRA.includes(tipo)) throw new ErroObra("Escolha o tipo da obra.");
    if (!titulo) throw new ErroObra("Informe o título da necessidade.");
    if (!descricao) throw new ErroObra("Descreva a necessidade.");

    const id = await criarObra({
      igrejaId,
      tipo,
      titulo,
      descricao,
      // Quem registrou a solicitação. O vínculo com o cadastro de usuários
      // depende de PEN-025; por ora fica o nome de quem estava logado.
      responsavel: sessao.nome || sessao.email,
    });

    revalidatePath("/obras");
    revalidatePath(`/obras/${id}`);

    return {
      ok: true,
      id,
      mensagem: `Solicitação ${id} registrada. O fluxo começou na etapa 1 (Coordenador do Polo).`,
    };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

function descrever(erro: unknown): string {
  if (erro instanceof ErroObra) return erro.message;
  const mensagem = erro instanceof Error ? erro.message : "";
  if (mensagem.includes("violates foreign key")) {
    return "A igreja escolhida não existe mais. Recarregue a página.";
  }
  console.error("Erro ao criar solicitação:", erro);
  return "Não foi possível registrar a solicitação agora. Tente novamente em instantes.";
}
