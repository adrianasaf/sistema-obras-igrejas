import type { Metadata } from "next";
import { listarRegioes } from "@/lib/estrutura-db";
import { exigirAcesso } from "@/lib/sessao";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { FormularioArea } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Nova Área" };

export default async function NovaAreaPage() {
  await exigirAcesso("estrutura");
  const regioes = await listarRegioes();
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/areas">Voltar para Áreas</LinkVoltar>
        <CabecalhoPagina
          titulo="Nova Área"
          descricao="Formulário visual: o cadastro será gravado quando o banco de dados for configurado."
        />
      </div>
      <FormularioArea regioes={regioes} />
    </div>
  );
}
