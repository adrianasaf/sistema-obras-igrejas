"use server";

import { revalidatePath } from "next/cache";
import {
  ErroCadastro,
  atualizarArea,
  atualizarIgreja,
  atualizarPolo,
  atualizarRegiao,
  criarArea,
  criarIgreja,
  criarPolo,
  criarRegiao,
} from "@/lib/estrutura-db";
import type { StatusCadastro } from "@/lib/estrutura-tipos";
import { exigirAcesso } from "@/lib/sessao";

export type Resultado = { ok: boolean; mensagem: string; id?: string };

type Nivel = "regiao" | "area" | "polo" | "igreja";

const ROTA: Record<Nivel, string> = {
  regiao: "/regioes",
  area: "/areas",
  polo: "/polos",
  igreja: "/igrejas",
};

function texto(dados: FormData, campo: string, obrigatorio = true): string {
  const valor = String(dados.get(campo) ?? "").trim();
  if (obrigatorio && !valor) {
    throw new ErroCadastro(`Preencha o campo "${campo}".`);
  }
  return valor;
}

function status(dados: FormData): StatusCadastro {
  return String(dados.get("status")) === "Inativo" ? "Inativo" : "Ativo";
}

// Salva o cadastro (novo ou edição). O acesso à área "estrutura" é conferido
// aqui também, não só na página.
export async function salvarCadastroAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  try {
    await exigirAcesso("estrutura");

    const nivel = String(dados.get("nivel")) as Nivel;
    const id = String(dados.get("id") ?? "");
    const editando = id !== "";

    const comuns = {
      codigo: texto(dados, "codigo"),
      nome: texto(dados, "nome"),
      status: status(dados),
      responsavel: texto(dados, "responsavel", false),
    };

    let novoId = id;

    if (nivel === "regiao") {
      if (editando) await atualizarRegiao(id, comuns);
      else novoId = await criarRegiao(comuns);
    } else if (nivel === "area") {
      const area = { ...comuns, regiaoId: texto(dados, "regiao") };
      if (editando) await atualizarArea(id, area);
      else novoId = await criarArea(area);
    } else if (nivel === "polo") {
      const polo = { ...comuns, areaId: texto(dados, "area") };
      if (editando) await atualizarPolo(id, polo);
      else novoId = await criarPolo(polo);
    } else if (nivel === "igreja") {
      const igreja = {
        codigo: comuns.codigo,
        nome: comuns.nome,
        status: comuns.status,
        cidade: texto(dados, "cidade"),
        poloId: texto(dados, "polo"),
      };
      if (editando) await atualizarIgreja(id, igreja);
      else novoId = await criarIgreja(igreja);
    } else {
      throw new ErroCadastro("Cadastro desconhecido.");
    }

    revalidatePath(ROTA[nivel]);
    revalidatePath(`${ROTA[nivel]}/${novoId}`);
    // As listas dos outros níveis mostram contagens e vínculos.
    Object.values(ROTA).forEach((rota) => revalidatePath(rota));

    return {
      ok: true,
      id: novoId,
      mensagem: editando ? "Alterações salvas." : "Cadastro criado.",
    };
  } catch (erro) {
    return { ok: false, mensagem: descrever(erro) };
  }
}

function descrever(erro: unknown): string {
  if (erro instanceof ErroCadastro) return erro.message;
  const mensagem = erro instanceof Error ? erro.message : "";
  if (mensagem.includes("duplicate key") && mensagem.includes("codigo")) {
    return "Já existe um cadastro com esse código.";
  }
  if (mensagem.includes("duplicate key")) {
    return "Já existe um cadastro com esses dados.";
  }
  if (mensagem.includes("violates foreign key")) {
    return "O vínculo escolhido não existe mais. Recarregue a página.";
  }
  console.error("Erro ao salvar cadastro:", erro);
  return "Não foi possível salvar agora. Tente novamente em instantes.";
}
