import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { notFound } from "next/navigation";
import { BadgeCadastro, BadgePrioridade, BadgeStatus } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
} from "@/components/estrutura/comuns";
import Link from "next/link";
import { buscarIgreja } from "@/lib/estrutura-db";
import { statusFeminino } from "@/lib/estrutura-tipos";
import { OBRAS, formatarData } from "@/lib/obras-mock";
import { cartao, tituloSecao } from "@/lib/ui";

export async function generateMetadata({
  params,
}: PageProps<"/igrejas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const igreja = await buscarIgreja(id);
  return { title: igreja ? igreja.nome : "Igreja" };
}

export default async function IgrejaPage({
  params,
}: PageProps<"/igrejas/[id]">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const igreja = await buscarIgreja(id);
  if (!igreja) notFound();

  // Obras demonstrativas desta igreja (ligação apenas pelo nome, nos dados de
  // exemplo; não há relação em banco).
  const obras = OBRAS.filter((o) => o.igreja === igreja.nome).sort((a, b) =>
    b.data.localeCompare(a.data),
  );

  return (
    <div className="space-y-6">
      <CabecalhoDetalhe
        voltarHref="/igrejas"
        voltarRotulo="Voltar para Igrejas"
        titulo={igreja.nome}
        subtitulo={`Igreja · ${igreja.poloNome}`}
        cracha={<BadgeCadastro valor={igreja.status} feminino />}
        editarHref={`/igrejas/${igreja.id}/editar`}
        campos={[
          { rotulo: "Código", valor: igreja.codigo },
          { rotulo: "Polo", valor: igreja.poloNome },
          { rotulo: "Área", valor: igreja.areaNome },
          { rotulo: "Região", valor: igreja.regiaoNome },
          { rotulo: "Cidade", valor: igreja.cidade },
          { rotulo: "Status", valor: statusFeminino(igreja.status) },
        ]}
      />

      <section className={`${cartao} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <h2 className={tituloSecao}>Obras desta igreja</h2>
          <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted tabular-nums">
            {obras.length}
          </span>
        </div>
        {obras.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">
            Nenhuma obra registrada para esta igreja.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {obras.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/obras/${o.id}`}
                  className="flex flex-col gap-2 px-5 py-3 hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.titulo}</p>
                    <p className="truncate text-xs text-muted">
                      {o.tipo} · {formatarData(o.data)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <BadgePrioridade valor={o.prioridade} />
                    <BadgeStatus valor={o.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AvisoDemonstrativo />
    </div>
  );
}
