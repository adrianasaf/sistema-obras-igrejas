import type { Metadata } from "next";
import { BadgeEstoque } from "@/components/badges";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand">
            Estoque
          </h1>
          <p className="mt-1 text-sm text-muted">
            Materiais e saldos. Dados demonstrativos.
          </p>
        </div>
        <AcoesEstoque />
      </div>

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
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
        <table className="w-full text-sm">
          <thead className="bg-background text-left text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Material</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Unidade</th>
              <th className="px-4 py-3 text-right font-medium">
                Quantidade atual
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Estoque mínimo
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
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
          </tbody>
        </table>
      </div>

      {/* Cartões (celular) */}
      <ul className="space-y-3 md:hidden">
        {materiais.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{m.nome}</p>
                <p className="text-xs text-muted">{m.categoria}</p>
              </div>
              <BadgeEstoque valor={statusMaterial(m)} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div>
                <dt className="text-muted">Unidade</dt>
                <dd className="font-medium">{m.unidade}</dd>
              </div>
              <div>
                <dt className="text-muted">Atual</dt>
                <dd className="font-medium tabular-nums">
                  {formatarQuantidade(m.quantidade)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Mínimo</dt>
                <dd className="font-medium tabular-nums">
                  {formatarQuantidade(m.minimo)}
                </dd>
              </div>
            </dl>
          </li>
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
    <li className="rounded-lg border border-border bg-surface p-4">
      <p className="truncate text-xs text-muted">{rotulo}</p>
      <p
        className={`mt-1 text-2xl leading-none font-semibold tabular-nums ${cor ?? "text-brand"}`}
      >
        {total}
      </p>
    </li>
  );
}
