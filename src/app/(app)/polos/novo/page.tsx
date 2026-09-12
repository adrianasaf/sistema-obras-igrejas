import type { Metadata } from "next";
import {
  CabecalhoPagina,
  LinkVoltar,
} from "@/components/cabecalho-pagina";
import { FormularioPolo } from "@/components/estrutura/formularios";

export const metadata: Metadata = { title: "Novo Polo" };

export default function NovoPoloPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/polos">Voltar para Polos</LinkVoltar>
        <CabecalhoPagina
          titulo="Novo Polo"
          descricao="Formulário visual: o cadastro será gravado quando o banco de dados for configurado."
        />
      </div>
      <FormularioPolo />
    </div>
  );
}
