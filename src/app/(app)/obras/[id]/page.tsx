import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgePrioridade, BadgeStatus } from "@/components/badges";
import { STATUS_OBRA, buscarObra, formatarData } from "@/lib/obras-mock";

export async function generateMetadata({
  params,
}: PageProps<"/obras/[id]">): Promise<Metadata> {
  const { id } = await params;
  const obra = buscarObra(id);
  return { title: obra ? obra.titulo : "Solicitação" };
}

export default async function DetalheObraPage({
  params,
}: PageProps<"/obras/[id]">) {
  const { id } = await params;
  const obra = buscarObra(id);
  if (!obra) notFound();

  // Linha do tempo baseada na sequência provisória de status. As etapas de
  // aprovação hierárquica e Presbitério serão inseridas aqui quando o fluxo
  // for definido (docs/03-FLUXO-DA-OBRA.md).
  const indiceAtual = STATUS_OBRA.indexOf(obra.status);
  const etapas = STATUS_OBRA.map((status, i) => ({
    status,
    situacao:
      i < indiceAtual ? "concluida" : i === indiceAtual ? "atual" : "futura",
    data: i === 0 ? formatarData(obra.data) : undefined,
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/obras" className="text-sm text-muted hover:text-brand">
          ← Voltar para Obras
        </Link>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-muted">Solicitação {obra.id}</p>
            <h1 className="text-2xl font-semibold tracking-tight text-brand">
              {obra.titulo}
            </h1>
            <p className="mt-1 text-sm text-muted">{obra.igreja}</p>
          </div>
          <div className="flex gap-2">
            <BadgePrioridade valor={obra.prioridade} />
            <BadgeStatus valor={obra.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-semibold text-brand">Dados da solicitação</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Item rotulo="Igreja solicitante" valor={obra.igreja} />
              <Item rotulo="Tipo da obra" valor={obra.tipo} />
              <Item rotulo="Prioridade" valor={obra.prioridade} />
              <Item rotulo="Data da solicitação" valor={formatarData(obra.data)} />
              <Item rotulo="Situação atual" valor={obra.status} />
            </dl>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-semibold text-brand">Descrição</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
              {obra.descricao}
            </p>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-semibold text-brand">Fotos</h2>
            {obra.fotos.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                Nenhuma foto anexada a esta solicitação.
              </p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {obra.fotos.map((f) => (
                  <li key={f.id}>
                    {/* Espaço reservado: as imagens reais virão com o armazenamento de arquivos. */}
                    <div
                      role="img"
                      aria-label={`Foto: ${f.legenda} (imagem de exemplo)`}
                      className="flex aspect-[4/3] items-center justify-center rounded-md border border-border bg-background text-xs text-muted"
                    >
                      Foto de exemplo
                    </div>
                    <p className="mt-1 text-xs text-muted">{f.legenda}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="rounded-lg border border-border bg-surface p-5 lg:col-span-1">
          <h2 className="font-semibold text-brand">Linha do tempo</h2>
          <p className="mt-1 text-xs text-muted">
            As etapas de aprovação serão adicionadas quando o fluxo for
            definido.
          </p>
          <ol className="mt-5 space-y-0">
            {etapas.map((e, i) => (
              <li key={e.status} className="relative flex gap-3 pb-6 last:pb-0">
                {i < etapas.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-3 left-[7px] h-full w-0.5 ${
                      e.situacao === "concluida" ? "bg-brand" : "bg-border"
                    }`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                    e.situacao === "concluida"
                      ? "border-brand bg-brand"
                      : e.situacao === "atual"
                        ? "border-brand bg-surface ring-4 ring-brand/15"
                        : "border-border bg-surface"
                  }`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm ${
                      e.situacao === "futura"
                        ? "text-muted"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {e.status}
                    {e.situacao === "atual" && (
                      <span className="ml-2 text-xs font-normal text-brand">
                        (atual)
                      </span>
                    )}
                  </p>
                  {e.data && (
                    <p className="text-xs text-muted">{e.data}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function Item({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd className="mt-0.5 text-sm font-medium">{valor}</dd>
    </div>
  );
}
