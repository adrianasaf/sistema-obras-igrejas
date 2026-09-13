import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { BadgeEstoque } from "@/components/badges";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { CartaoLista, Tabela } from "@/components/tabela";
import { cartao } from "@/lib/ui";
import { listarIgrejas } from "@/lib/estrutura-db";
import { formatarQuantidade, listarMateriais } from "@/lib/estoque-db";
import { AcoesEstoque } from "./acoes-estoque";

export const metadata: Metadata = { title: "Estoque" };

export default async function EstoquePage() {
  await exigirAcesso("estoque");
  const [materiais, igrejas] = await Promise.all([
    listarMateriais(),
    listarIgrejas(),
  ]);

  const emFalta = materiais.filter((m) => m.status === "Em falta");
  const abaixo = materiais.filter((m) => m.status === "Abaixo do mínimo");

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Estoque"
        descricao="Materiais de todas as igrejas e do estoque geral."
      />

      <AcoesEstoque materiais={materiais} igrejas={igrejas} />

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
          "Igreja",
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
            <td className="px-4 py-3">{m.igrejaNome}</td>
            <td className="px-4 py-3">{m.categoria}</td>
            <td className="px-4 py-3">{m.unidade}</td>
            <td className="px-4 py-3 text-right tabular-nums">
              {formatarQuantidade(m.quantidade)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-muted">
              {formatarQuantidade(m.minimo)}
            </td>
            <td className="px-4 py-3">
              <BadgeEstoque valor={m.status} />
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
            subtitulo={`${m.igrejaNome} · ${m.categoria}`}
            cracha={<BadgeEstoque valor={m.status} />}
            dados={[
              { rotulo: "Unidade", valor: m.unidade },
              { rotulo: "Quantidade atual", valor: formatarQuantidade(m.quantidade) },
              { rotulo: "Estoque mínimo", valor: formatarQuantidade(m.minimo) },
            ]}
          />
        ))}
      </ul>

      <p className="text-xs text-muted">
        Todos os materiais ficam visíveis a quem acessa esta área, para
        permitir o remanejamento entre igrejas. A saída de estoque será
        liberada quando as cinco fases da execução forem definidas.
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
