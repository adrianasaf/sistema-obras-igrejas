import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioPolo } from "@/components/estrutura/formularios";
import { buscarPolo } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Editar Polo" };

export default async function EditarPoloPage({
  params,
}: PageProps<"/polos/[id]/editar">) {
  const { id } = await params;
  const polo = buscarPolo(id);
  if (!polo) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/polos/${polo.id}`}
          className="text-sm text-muted hover:text-brand"
        >
          ← Voltar para {polo.nome}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Editar Polo
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: as alterações não são gravadas.
        </p>
      </div>
      <FormularioPolo polo={polo} />
    </div>
  );
}
