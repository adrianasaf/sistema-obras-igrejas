import type { Metadata } from "next";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { FormularioRegiao } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Nova Região" };

export default function NovaRegiaoPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/regioes">Voltar para Regiões</LinkVoltar>
        <CabecalhoPagina
          titulo="Nova Região"
          descricao="Formulário visual: o cadastro será gravado quando o banco de dados for configurado."
        />
      </div>
      <FormularioRegiao />
    </div>
  );
}
