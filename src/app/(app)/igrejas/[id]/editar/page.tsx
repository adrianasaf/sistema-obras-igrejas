import type { Metadata } from "next";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import { FormularioIgreja } from "@/components/estrutura/formularios";
import { buscarIgreja } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Editar Igreja" };

export default async function EditarIgrejaPage({
  params,
}: PageProps<"/igrejas/[id]/editar">) {
  const { id } = await params;
  const igreja = buscarIgreja(id);
  if (!igreja) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href={`/igrejas/${igreja.id}`}>Voltar para {igreja.nome}</LinkVoltar>
        <CabecalhoPagina
          titulo="Editar Igreja"
          descricao="Formulário visual: as alterações não são gravadas."
        />
      </div>
      <FormularioIgreja igreja={igreja} />
    </div>
  );
}
