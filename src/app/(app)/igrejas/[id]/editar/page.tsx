import type { Metadata } from "next";
import Link from "next/link";
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
      <div>
        <Link
          href={`/igrejas/${igreja.id}`}
          className="text-sm text-muted hover:text-brand"
        >
          ← Voltar para {igreja.nome}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Editar Igreja
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: as alterações não são gravadas.
        </p>
      </div>
      <FormularioIgreja igreja={igreja} />
    </div>
  );
}
