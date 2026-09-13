import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import { FormularioArea } from "@/components/estrutura/formularios";
import { buscarArea , listarRegioes } from "@/lib/estrutura-db";

export const metadata: Metadata = { title: "Editar Área" };

export default async function EditarAreaPage({
  params,
}: PageProps<"/areas/[id]/editar">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const area = await buscarArea(id);
  if (!area) notFound();

  const regioes = await listarRegioes();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href={`/areas/${area.id}`}>Voltar para {area.nome}</LinkVoltar>
        <CabecalhoPagina
          titulo="Editar Área"
          descricao="Formulário visual: as alterações não são gravadas."
        />
      </div>
      <FormularioArea area={area} regioes={regioes} />
    </div>
  );
}
