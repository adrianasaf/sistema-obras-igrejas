"use server";

import { revalidatePath } from "next/cache";
import { ErroMigracao, aplicarMigracao } from "@/lib/migrador";
import { exigirAcesso } from "@/lib/sessao";

export type Resultado = { ok: boolean; mensagem: string };

export async function aplicarMigracaoAction(
  _anterior: Resultado | null,
  dados: FormData,
): Promise<Resultado> {
  try {
    await exigirAcesso("configuracoes");
    const id = String(dados.get("id") ?? "");
    const mensagem = await aplicarMigracao(id);
    revalidatePath("/configuracoes/banco");
    return { ok: true, mensagem };
  } catch (erro) {
    if (erro instanceof ErroMigracao) {
      return { ok: false, mensagem: erro.message };
    }
    console.error("Erro ao aplicar migração:", erro);
    return {
      ok: false,
      mensagem:
        erro instanceof Error
          ? `Falha ao aplicar: ${erro.message}`
          : "Falha ao aplicar a migração.",
    };
  }
}
