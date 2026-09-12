import type { Metadata } from "next";
import Link from "next/link";
import { FormularioIgreja } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Nova Igreja" };

export default function NovaIgrejaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/igrejas" className="text-sm text-muted hover:text-brand">
          ← Voltar para Igrejas
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Nova Igreja
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: o cadastro será gravado quando o banco de dados for
          configurado.
        </p>
      </div>
      <FormularioIgreja />
    </div>
  );
}
