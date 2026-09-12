import type { Metadata } from "next";
import { BadgeEstoque } from "@/components/badges";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { CartaoLista, Tabela } from "@/components/tabela";
import { cartao } from "@/lib/ui";
import {
  MATERIAIS,
  formatarQuantidade,
  statusMaterial,
} from "@/lib/estoque-mock";
import { AcoesEstoque } from "./acoes";

export const metadata: Metadata = { title: "Estoque" };

export default function EstoquePage() {
  const materiais = [...MATERIAIS].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

  const emFalta = materiais.filter((m) => statusMaterial(m) === "Em falta");
  const abaixo = materiais.filter(
    (m) => statusMaterial(m) === "Abaixo do mínimo",
  );

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Estoque"
        descricao="Materiais e saldos. Dados demonstrativos."
      />

      <AcoesEstoque />

      {/* Resumo */}
      <ul className="grid grid-cols-3 gap-3">
        <Resumo rotulo="Materiais" total={materiais.length} />
        <Resumo
          rotulo="Abaixo do mínimo"
          total={abaixo.length}
          cor="text-amber-700"
        />
        <Resumo rotulo="Em falta" total={emFalta.length} cor="text-red-700" />
      </ul>

      {/* Tabela (tablet e computador) */}
      <Tabela
        colunas={[
          "Material",
          "Categoria",
          "Unidade",
          { rotulo: "Quantidade atual", direita: true },
          { rotulo: "Estoque mínimo", direita: true },
          "Status",
        ]}
      >
        {materiais.map((m) => (
          <tr key={m.id} className="hover:bg-background">
            <td className="px-4 py-3 font-medium">{m.nome}</td>
            <td className="px-4 py-3">{m.categoria}</td>
            <td className="px-4 py-3">{m.unidade}</td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatarQuantidade(m.quantidade)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-muted">
              {formatarQuantidade(m.minimo)}
            </td>
            <td className="px-4 py-3">
              <BadgeEstoque valor={statusMaterial(m)} />
            </td>
          </tr>
        ))}
      </Tabela>

      {/* Cartões (celular) */}
      <ul className="space-y-3 md:hidden">
        {materiais.map((m) => (
          <CartaoLista
            key={m.id}
            titulo={m.nome}
            subtitulo={m.categoria}
            cracha={<BadgeEstoque valor={statusMaterial(m)} />}
            dados={[
              { rotulo: "Unidade", valor: m.unidade },
              { rotulo: "Quantidade atual", valor: formatarQuantidade(m.quantidade) },
              { rotulo: "Estoque mínimo", valor: formatarQuantidade(m.minimo) },
            ]}
          />
        ))}
      </ul>

      <p className="text-xs text-muted">
        Tela demonstrativa: o módulo de estoque está previsto para a Fase 6 do
        roadmap. Nenhuma movimentação é registrada.
      </p>
    </div>
  );
}

function Resumo({
  rotulo,
  total,
  cor,
}: {
  rotulo: string;
  total: number;
  cor?: string;
}) {
  return (
    <li className={`${cartao} p-4`}>
      <p className="truncate text-xs text-muted">{rotulo}</p>
      <p
        className={`mt-1 text-2xl leading-none font-semibold tabular-nums ${cor ?? "text-brand"}`}
      >
        {total}
      </p>
    </li>
  );
}
