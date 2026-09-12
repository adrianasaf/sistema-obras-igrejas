import type { Metadata } from "next";
import { ModuloPrevisto } from "@/components/modulo-previsto";

export const metadata: Metadata = { title: "Igrejas" };

export default function IgrejasPage() {
  return (
    <ModuloPrevisto
      titulo="Igrejas"
      descricao="Cadastro das igrejas e da estrutura administrativa."
      fase="Fase 1 — em desenvolvimento"
      itens={[
        "Cadastro de Região, Área, Polo e Igreja.",
        "Consulta das igrejas por região, área e polo.",
        "Vínculo de cada obra à igreja correspondente.",
      ]}
    />
  );
}
