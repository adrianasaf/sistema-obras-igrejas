import type { Metadata } from "next";
import { listarIgrejas } from "@/lib/estrutura-db";
import { exigirAcesso } from "@/lib/sessao";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { FormularioSolicitacao } from "./formulario";

export const metadata: Metadata = { title: "Nova Solicitação" };

export default async function NovaSolicitacaoPage() {
  await exigirAcesso("obras");
  const igrejas = await listarIgrejas();
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/obras">Voltar para Obras</LinkVoltar>
        <CabecalhoPagina
          titulo="Nova Solicitação"
          descricao="Registre a necessidade da igreja. Ao enviar, a solicitação entra no fluxo de aprovação na etapa 1 (Coordenador do Polo)."
        />
      </div>
      <FormularioSolicitacao igrejas={igrejas} />
    </div>
  );
}
