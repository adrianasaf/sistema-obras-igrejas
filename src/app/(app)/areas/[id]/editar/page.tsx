import type { Metadata } from "next";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import { FormularioArea } from "@/components/estrutura/formularios";
import { buscarArea } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Editar Área" };

export default async function EditarAreaPage({
  params,
}: PageProps<"/areas/[id]/editar">) {
  const { id } = await params;
  const area = buscarArea(id);
  if (!area) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href={`/areas/${area.id}`}>Voltar para {area.nome}</LinkVoltar>
        <CabecalhoPagina
          titulo="Editar Área"
          descricao="Formulário visual: as alterações não são gravadas."
        />
      </div>
      <FormularioArea area={area} />
    </div>
  );
}
