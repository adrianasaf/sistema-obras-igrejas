import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import Link from "next/link";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { OBRAS } from "@/lib/obras-mock";
import { botaoPrimario } from "@/lib/ui";
import { ListaObras } from "./lista";

export const metadata: Metadata = { title: "Obras" };

export default async function ObrasPage() {
  await exigirAcesso("obras");
  const obras = [...OBRAS].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Obras"
        descricao="Solicitações e obras das igrejas. Dados demonstrativos."
        acao={
          <Link href="/obras/nova" className={botaoPrimario}>
            Nova Solicitação
          </Link>
        }
      />

      <ListaObras obras={obras} />
    </div>
  );
}
