import type { Metadata } from "next";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { FormularioIgreja } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Nova Igreja" };

export default function NovaIgrejaPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/igrejas">Voltar para Igrejas</LinkVoltar>
        <CabecalhoPagina
          titulo="Nova Igreja"
          descricao="Formulário visual: o cadastro será gravado quando o banco de dados for configurado."
        />
      </div>
      <FormularioIgreja />
    </div>
  );
}
