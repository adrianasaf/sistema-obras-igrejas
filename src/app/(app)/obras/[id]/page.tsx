import type { Metadata } from "next";
import { LinkVoltar } from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Abas } from "@/components/abas";
import {
  BadgeAprovacao,
  BadgeFase,
  BadgePrioridade,
  BadgeStatus,
} from "@/components/badges";
import { GaleriaFotos } from "@/components/galeria-fotos";
import { OrcamentosPainel } from "@/components/orcamentos-painel";
import { CORES_APROVACAO, CORES_FASE } from "@/lib/cores";
import { cartao, tituloSecao } from "@/lib/ui";
import {
  type Aprovacao,
  type DetalheObra,
  detalheDemonstrativo,
} from "@/lib/obra-detalhe-mock";
import {
  buscarObra,
  formatarData,
  formatarValor,
  valoresDemonstrativos,
  type Obra,
} from "@/lib/obras-mock";

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

  const detalhe = detalheDemonstrativo(obra);
  const valores = valoresDemonstrativos(obra);

  return (
    <div className="space-y-6">
      <Cabecalho obra={obra} />

      <Abas
        itens={[
          {
            id: "visao-geral",
            rotulo: "Visão Geral",
            conteudo: <VisaoGeral obra={obra} />,
          },
          {
            id: "aprovacoes",
            rotulo: "Aprovações",
            conteudo: <Aprovacoes aprovacoes={detalhe.aprovacoes} />,
          },
          {
            id: "orcamentos",
            rotulo: "Orçamentos",
            conteudo: (
              <OrcamentosPainel
                orcamentos={detalhe.orcamentos}
                valorAprovado={valores.aprovado}
              />
            ),
          },
          {
            id: "execucao",
            rotulo: "Execução",
            conteudo: <Execucao fases={detalhe.fases} />,
          },
          {
            id: "conclusao",
            rotulo: "Conclusão",
            conteudo: <Conclusao conclusao={detalhe.conclusao} />,
          },
        ]}
      />

      <p className="text-xs text-muted">
        Tela demonstrativa: os dados são fictícios e as etapas ainda não têm
        funcionamento real.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- cabeçalho */

function Cabecalho({ obra }: { obra: Obra }) {
  return (
    <div>
      <LinkVoltar href="/obras">Voltar para Obras</LinkVoltar>

      <div className={`${cartao} mt-3 overflow-hidden`}>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted">{obra.igreja}</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-brand sm:text-2xl">
              {obra.titulo}
            </h1>
            <p className="mt-1 font-mono text-xs text-muted">
              Solicitação {obra.id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <BadgePrioridade valor={obra.prioridade} />
            <BadgeStatus valor={obra.status} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          <Campo rotulo="Igreja" valor={obra.igreja} />
          <Campo rotulo="Obra" valor={obra.titulo} />
          <Campo rotulo="Tipo" valor={obra.tipo} />
          <Campo rotulo="Prioridade" valor={obra.prioridade} />
          <Campo rotulo="Status atual" valor={obra.status} />
          <Campo rotulo="Data da solicitação" valor={formatarData(obra.data)} />
        </dl>
      </div>
    </div>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="bg-surface px-5 py-3">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium" title={valor}>
        {valor}
      </dd>
    </div>
  );
}

/* -------------------------------------------------------------- visão geral */

function VisaoGeral({ obra }: { obra: Obra }) {
  const valores = valoresDemonstrativos(obra);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Cartao titulo="Descrição da necessidade">
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {obra.descricao}
          </p>
        </Cartao>

        <Cartao
          titulo="Fotos da situação atual"
          descricao="Enviadas junto com a solicitação."
        >
          <GaleriaFotos
            fotos={obra.fotos}
            vazio="Nenhuma foto anexada a esta solicitação."
          />
        </Cartao>
      </div>

      <Cartao titulo="Informações da solicitação">
        <dl className="space-y-3">
          <Linha rotulo="Igreja solicitante" valor={obra.igreja} />
          <Linha rotulo="Tipo da obra" valor={obra.tipo} />
          <Linha rotulo="Prioridade" valor={obra.prioridade} />
          <Linha rotulo="Data da solicitação" valor={formatarData(obra.data)} />
          <Linha rotulo="Status atual" valor={obra.status} />
          <Linha
            rotulo="Estimado — material"
            valor={formatarValor(valores.material)}
          />
          <Linha
            rotulo="Estimado — mão de obra"
            valor={formatarValor(valores.maoDeObra)}
          />
          <Linha
            rotulo="Total estimado"
            valor={formatarValor(valores.estimado)}
          />
          <Linha
            rotulo="Valor aprovado"
            valor={
              valores.aprovado !== undefined
                ? formatarValor(valores.aprovado)
                : "—"
            }
          />
          <Linha rotulo="Número da solicitação" valor={obra.id} />
        </dl>
      </Cartao>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd className="text-sm font-medium">{valor}</dd>
    </div>
  );
}

/* --------------------------------------------------------------- aprovações */

function Aprovacoes({ aprovacoes }: { aprovacoes: Aprovacao[] }) {
  return (
    <Cartao
      titulo="Linha do tempo das aprovações"
      descricao="Sequência informada pelo responsável do projeto. Alçadas, prazos e efeitos de reprovação ainda não estão definidos."
    >
      <ol>
        {aprovacoes.map((a, i) => {
          const cor = CORES_APROVACAO[a.situacao];
          const ultimo = i === aprovacoes.length - 1;
          const respondido = a.situacao !== "Aguardando";
          return (
            <li key={a.nivel} className="relative flex gap-4 pb-6 last:pb-0">
              {!ultimo && (
                <span
                  aria-hidden="true"
                  className={`absolute top-5 left-[9px] h-full w-0.5 ${
                    respondido ? cor.barra : "bg-border"
                  }`}
                />
              )}
              <span
                aria-hidden="true"
                className={`relative mt-1 size-5 shrink-0 rounded-full border-2 border-surface ${cor.ponto} ring-2 ring-border`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{a.nivel}</p>
                  <BadgeAprovacao valor={a.situacao} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {a.responsavel}
                  {a.data ? ` · ${formatarData(a.data)}` : " · sem data"}
                </p>
                {a.observacao && (
                  <p className="mt-2 rounded-md border border-border bg-background px-3 py-2 text-xs leading-relaxed">
                    {a.observacao}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Cartao>
  );
}

/* ------------------------------------------------------------------ execução */

function Execucao({ fases }: { fases: DetalheObra["fases"] }) {
  const media = Math.round(
    fases.reduce((t, f) => t + f.percentual, 0) / fases.length,
  );
  const custoExecutado = fases.reduce((t, f) => t + f.custo, 0);

  return (
    <div className="space-y-6">
      <Cartao
        titulo="Andamento geral"
        descricao="Média das cinco fases. O conteúdo de cada fase ainda não está definido."
      >
        <div className="flex items-center gap-4">
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-background"
            role="progressbar"
            aria-label="Andamento geral da obra"
            aria-valuenow={media}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${media}%` }}
            />
          </div>
          <p className="text-lg font-semibold tabular-nums text-brand">
            {media}%
          </p>
        </div>
        <p className="mt-3 text-xs text-muted">
          Custo das fases já executadas:{" "}
          <span className="font-medium tabular-nums text-foreground">
            {custoExecutado > 0 ? formatarValor(custoExecutado) : "—"}
          </span>
        </p>
      </Cartao>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fases.map((f) => {
          const cor = CORES_FASE[f.situacao];
          return (
            <li
              key={f.rotulo}
              className={`${cartao} flex overflow-hidden`}
            >
              <span aria-hidden="true" className={`w-1.5 shrink-0 ${cor.barra}`} />
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{f.rotulo}</p>
                  <span className={`text-sm font-semibold tabular-nums ${cor.texto}`}>
                    {f.percentual}%
                  </span>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-background"
                  role="progressbar"
                  aria-label={`Andamento da ${f.rotulo}`}
                  aria-valuenow={f.percentual}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full ${cor.barra}`}
                    style={{ width: `${f.percentual}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <BadgeFase valor={f.situacao} />
                  {f.inicio && (
                    <span className="text-xs text-muted">
                      Início em {formatarData(f.inicio)}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.descricao}
                </p>

                <div className="mt-3">
                  <p className="text-xs font-medium text-muted">
                    Materiais utilizados
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {f.materiais.map((m) => (
                      <li
                        key={m}
                        className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted">Custo da fase</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {f.custo > 0 ? formatarValor(f.custo) : "—"}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------- conclusão */

function Conclusao({ conclusao }: { conclusao: DetalheObra["conclusao"] }) {
  const concluida = conclusao.data !== undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Cartao titulo="Resumo da obra">
          {conclusao.resumo ? (
            <p className="text-sm leading-relaxed">{conclusao.resumo}</p>
          ) : (
            <p className="text-sm text-muted">
              O resumo será preenchido quando a obra for concluída.
            </p>
          )}
        </Cartao>

        <Cartao titulo="Fotos finais">
          <GaleriaFotos
            fotos={conclusao.fotos}
            vazio="As fotos finais serão anexadas na conclusão da obra."
          />
        </Cartao>
      </div>

      <Cartao titulo="Encerramento">
        <dl className="space-y-3">
          <Linha
            rotulo="Valor final"
            valor={
              conclusao.valorFinal !== undefined
                ? formatarValor(conclusao.valorFinal)
                : "—"
            }
          />
          <Linha
            rotulo="Data de conclusão"
            valor={conclusao.data ? formatarData(conclusao.data) : "—"}
          />
          <Linha
            rotulo="Fotos finais"
            valor={String(conclusao.fotos.length)}
          />
        </dl>
        {!concluida && (
          <p className="mt-4 text-xs text-muted">
            Área preparada: os critérios de conclusão da obra ainda não estão
            definidos.
          </p>
        )}
      </Cartao>
    </div>
  );
}

/* -------------------------------------------------------------------- comum */

function Cartao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${cartao} p-5`}>
      <h2 className={tituloSecao}>{titulo}</h2>
      {descricao && <p className="mt-1 text-xs text-muted">{descricao}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
