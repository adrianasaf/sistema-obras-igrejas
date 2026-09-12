import type { Metadata } from "next";
import Link from "next/link";
import { FormularioArea } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Nova Área" };

export default function NovaAreaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/areas" className="text-sm text-muted hover:text-brand">
          ← Voltar para Áreas
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Nova Área
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: o cadastro será gravado quando o banco de dados for
          configurado.
        </p>
      </div>
      <FormularioArea />
    </div>
  );
}
