import type { Metadata } from "next";
import Link from "next/link";
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
      <div>
        <Link
          href={`/areas/${area.id}`}
          className="text-sm text-muted hover:text-brand"
        >
          ← Voltar para {area.nome}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Editar Área
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: as alterações não são gravadas.
        </p>
      </div>
      <FormularioArea area={area} />
    </div>
  );
}
