import type { Metadata } from "next";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { FormularioSolicitacao } from "./formulario";

export const metadata: Metadata = { title: "Nova Solicitação" };

export default function NovaSolicitacaoPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/obras">Voltar para Obras</LinkVoltar>
        <CabecalhoPagina
          titulo="Nova Solicitação"
          descricao="Registre a necessidade da igreja. O envio será habilitado quando o banco de dados for configurado."
        />
      </div>
      <FormularioSolicitacao />
    </div>
  );
}
