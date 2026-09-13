import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import { FormularioPolo } from "@/components/estrutura/formularios";
import { buscarPolo , listarAreas } from "@/lib/estrutura-db";

export const metadata: Metadata = { title: "Editar Polo" };

export default async function EditarPoloPage({
  params,
}: PageProps<"/polos/[id]/editar">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const polo = await buscarPolo(id);
  if (!polo) notFound();

  const areas = await listarAreas();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href={`/polos/${polo.id}`}>Voltar para {polo.nome}</LinkVoltar>
        <CabecalhoPagina
          titulo="Editar Polo"
          descricao="Formulário visual: as alterações não são gravadas."
        />
      </div>
      <FormularioPolo polo={polo} areas={areas} />
    </div>
  );
}
