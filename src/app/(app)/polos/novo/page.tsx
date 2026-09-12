import type { Metadata } from "next";
import Link from "next/link";
import { FormularioPolo } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Novo Polo" };

export default function NovoPoloPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/polos" className="text-sm text-muted hover:text-brand">
          ← Voltar para Polos
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Novo Polo
        </h1>
        <p className="mt-1 text-sm text-muted">
          Formulário visual: o cadastro será gravado quando o banco de dados for
          configurado.
        </p>
      </div>
      <FormularioPolo />
    </div>
  );
}
