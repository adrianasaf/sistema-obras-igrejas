import type { Metadata } from "next";
import Link from "next/link";
import { FormularioSolicitacao } from "./formulario";

export const metadata: Metadata = { title: "Nova Solicitação" };

export default function NovaSolicitacaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/obras" className="text-sm text-muted hover:text-brand">
          ← Voltar para Obras
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand">
          Nova Solicitação
        </h1>
        <p className="mt-1 text-sm text-muted">
          Registre a necessidade da igreja. O envio será habilitado quando o
          banco de dados for configurado.
        </p>
      </div>
      <FormularioSolicitacao />
    </div>
  );
}
