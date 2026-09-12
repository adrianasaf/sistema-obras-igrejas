import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioRegiao } from "@/components/estrutura/formularios";
import { buscarRegiao } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Editar Região" };

export default async function EditarRegiaoPage({
  params,
}: PageProps<"/regioes/[id]/editar">) {
  const { id } = await params;
  const regiao = buscarRegiao(id);
  if (!regiao) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/regioes/${regiao.id}`}
          className="text-sm text-muted hover:text-brand"
        >
          ← Voltar para {regiao.nome}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Editar Região
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: as alterações não são gravadas.
        </p>
      </div>
      <FormularioRegiao regiao={regiao} />
    </div>
  );
}
