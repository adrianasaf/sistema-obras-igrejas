"use server";

import { revalidatePath } from "next/cache";
import {
  ErroEstoque,
  atualizarMaterial,
  criarMaterial,
  registrarEntrada,
} from "@/lib/estoque-db";
import { exigirAcesso } from "@/lib/sessao";

export type Resultado = { ok: boolean; mensagem: string };

// Todas as ações conferem o acesso à área "estoque" no servidor. A
// visibilidade é ampla (DEC-015): não há filtro por vínculo aqui.
async function usuario() {
  const sessao = await exigirAcesso("estoque");
  return { id: sessao.id, nome: sessao.nome || sessao.email };
}

function texto(dados: FormData, campo: string, obrigatorio = true): string {
  const valor = String(dados.get(campo) ?? "").trim();
  if (obrigatorio && !valor) throw new ErroEstoque(`Preencha "${campo}".`);
  return valor;
}

function numero(bruto: string, rotulo: string, obrigatorio = true): number | null {
  const limpo = bruto.trim().replace(/\./g, "").replace(",", ".");
  if (!limpo) {
    if (obrigatorio) throw new ErroEstoque(`Informe ${rotulo}.`);
    return null;
  }
  const valor = Number(limpo);
  if (!Number.isFinite(valor) || valor < 0) {
    throw new ErroEstoque(`Informe ${rotulo} com um número válido.`);
  }
  return valor;
}

export async function salvarMaterialAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  try {
    const autor = await usuario();
    const id = String(dados.get("id") ?? "").trim();
    const igreja = String(dados.get("igrejaId") ?? "").trim();

    const material = {
      nome: texto(dados, "nome"),
      categoria: texto(dados, "categoria"),
      unidade: texto(dados, "unidade"),
      minimo: numero(String(dados.get("minimo") ?? "0"), "o estoque mínimo") ?? 0,
      // Vazio = estoque geral (DEC-015).
      igrejaId: igreja || null,
    };

    if (id) {
      await atualizarMaterial(id, material, autor);
    } else {
      await criarMaterial(material, autor);
    }

    revalidatePath("/estoque");
    return {
      ok: true,
      mensagem: id ? "Material atualizado." : "Material cadastrado.",
    };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

export async function registrarEntradaAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  try {
    const autor = await usuario();

    await registrarEntrada(
      {
        materialId: texto(dados, "materialId"),
        quantidade: numero(String(dados.get("quantidade") ?? ""), "a quantidade") ?? 0,
        fornecedor: texto(dados, "fornecedor", false),
        valorUnitario: numero(
          String(dados.get("valorUnitario") ?? ""),
          "o valor unitário",
          false,
        ),
        data: String(dados.get("data") ?? "").trim() || null,
      },
      autor,
    );

    revalidatePath("/estoque");
    return { ok: true, mensagem: "Entrada registrada." };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

function descrever(erro: unknown): string {
  if (erro instanceof ErroEstoque) return erro.message;
  const mensagem = erro instanceof Error ? erro.message : "";
  if (mensagem.includes("violates foreign key")) {
    return "A igreja escolhida não existe mais. Recarregue a página.";
  }
  console.error("Erro no estoque:", erro);
  return "Não foi possível salvar agora. Tente novamente em instantes.";
}
