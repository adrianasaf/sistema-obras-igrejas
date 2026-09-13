import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import { FormularioRegiao } from "@/components/estrutura/formularios";
import { buscarRegiao } from "@/lib/estrutura-db";

export const metadata: Metadata = { title: "Editar Região" };

export default async function EditarRegiaoPage({
  params,
}: PageProps<"/regioes/[id]/editar">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const regiao = await buscarRegiao(id);
  if (!regiao) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href={`/regioes/${regiao.id}`}>Voltar para {regiao.nome}</LinkVoltar>
        <CabecalhoPagina
          titulo="Editar Região"
          descricao="Formulário visual: as alterações não são gravadas."
        />
      </div>
      <FormularioRegiao regiao={regiao} />
    </div>
  );
}
