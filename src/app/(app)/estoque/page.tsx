import type { Metadata } from "next";
import { ModuloPrevisto } from "@/components/modulo-previsto";

export const metadata: Metadata = { title: "Estoque" };

export default function EstoquePage() {
  return (
    <ModuloPrevisto
      titulo="Estoque"
      descricao="Controle de materiais e movimentações."
      fase="Fase 6 — prevista no roadmap"
      itens={[
        "Cadastro de materiais.",
        "Entradas, saídas e saldo por material.",
        "Materiais aplicados em cada obra.",
      ]}
    />
  );
}
