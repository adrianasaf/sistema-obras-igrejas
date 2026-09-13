"use server";

import { revalidatePath } from "next/cache";
import { impedimentoParaOrcar } from "@/lib/escopo";
import { obterFluxo } from "@/lib/fluxo-aprovacao";
import { buscarObra } from "@/lib/obras-db";
import {
  CATEGORIAS,
  ErroOrcamento,
  salvarCotacao,
  salvarCroqui,
  selecionarCotacao,
  type CategoriaOrcamento,
} from "@/lib/orcamentos-db";
import { sessaoAtual } from "@/lib/sessao";

export type Resultado = { ok: boolean; mensagem: string };

// Quem pode lançar/editar: quem tem escopo sobre a obra — a igreja
// solicitante — e os perfis de abrangência geral (Administrador e Responsável
// CONBENS). O módulo só abre depois da aprovação de todas as etapas (DEC-013).
async function autorizar(obraId: string) {
  const sessao = await sessaoAtual();
  if (!sessao) throw new ErroOrcamento("Sessão expirada. Entre novamente.");
  if (!sessao.perfil) {
    throw new ErroOrcamento(
      "Seu usuário não tem perfil de acesso definido. Fale com o administrador.",
    );
  }

  const obra = await buscarObra(obraId);
  if (!obra) throw new ErroOrcamento("Solicitação não encontrada.");

  const fluxo = await obterFluxo(obraId);
  const impedimento = impedimentoParaOrcar(sessao, obra, fluxo.situacao);
  if (impedimento) throw new ErroOrcamento(impedimento);

  return { obra, usuario: sessao.nome || sessao.email };
}

function categoria(dados: FormData): CategoriaOrcamento {
  const valor = String(dados.get("categoria") ?? "");
  if (!CATEGORIAS.includes(valor as CategoriaOrcamento)) {
    throw new ErroOrcamento("Categoria inválida.");
  }
  return valor as CategoriaOrcamento;
}

function numero(dados: FormData): number {
  const valor = Number(dados.get("numero"));
  if (!Number.isInteger(valor)) throw new ErroOrcamento("Cotação inválida.");
  return valor;
}

// Valor em reais aceitando "1234,56" ou "1234.56".
function valorMonetario(bruto: string): number | null {
  const texto = bruto.trim();
  if (!texto) return null;
  const numerico = Number(texto.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(numerico) || numerico < 0) {
    throw new ErroOrcamento("Informe um valor válido.");
  }
  return numerico;
}

function dataOpcional(bruto: string): string | null {
  const texto = bruto.trim();
  return texto ? texto : null;
}

export async function salvarCotacaoAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  const obraId = String(dados.get("obraId") ?? "");
  try {
    const { usuario } = await autorizar(obraId);

    const valor = valorMonetario(String(dados.get("valor") ?? ""));
    const fornecedor = String(dados.get("fornecedor") ?? "").trim();

    await salvarCotacao({
      obraId,
      categoria: categoria(dados),
      numero: numero(dados),
      fornecedor,
      valor,
      dataCotacao: dataOpcional(String(dados.get("dataCotacao") ?? "")),
      validade: dataOpcional(String(dados.get("validade") ?? "")),
      observacoes: String(dados.get("observacoes") ?? "").trim(),
      // Cotação com fornecedor e valor conta como recebida.
      status: fornecedor && valor !== null ? "Recebido" : "Não recebido",
      usuario,
    });

    revalidatePath(`/obras/${obraId}`);
    return { ok: true, mensagem: "Cotação salva." };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

export async function selecionarCotacaoAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  const obraId = String(dados.get("obraId") ?? "");
  try {
    await autorizar(obraId);
    await selecionarCotacao(obraId, categoria(dados), numero(dados));
    revalidatePath(`/obras/${obraId}`);
    return { ok: true, mensagem: "Cotação selecionada." };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

export async function salvarCroquiAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  const obraId = String(dados.get("obraId") ?? "");
  try {
    const { usuario } = await autorizar(obraId);
    await salvarCroqui({
      obraId,
      descricao: String(dados.get("descricao") ?? "").trim(),
      arquivoUrl: String(dados.get("arquivoUrl") ?? "").trim(),
      usuario,
    });
    revalidatePath(`/obras/${obraId}`);
    return { ok: true, mensagem: "Croqui registrado." };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

function descrever(erro: unknown): string {
  if (erro instanceof ErroOrcamento) return erro.message;
  const mensagem = erro instanceof Error ? erro.message : "";
  if (mensagem.includes("orcamentos_obra_selecionado_idx")) {
    return "Já existe uma cotação selecionada nesta categoria. Recarregue a página.";
  }
  if (mensagem.includes("numero_check") || mensagem.includes("orcamentos_obra_unico_idx")) {
    return "Cada categoria aceita no máximo 3 cotações.";
  }
  console.error("Erro no módulo de orçamento:", erro);
  return "Não foi possível salvar agora. Tente novamente em instantes.";
}
