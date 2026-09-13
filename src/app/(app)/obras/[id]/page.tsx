import type { Metadata } from "next";
import {
  podeAcessarArea,
  podeDecidirEtapa,
  type Perfil,
} from "@/lib/permissoes";
import { exigirAcesso } from "@/lib/sessao";
import { LinkVoltar } from "@/components/cabecalho-pagina";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Abas } from "@/components/abas";
import {
  BadgeAprovacao,
  BadgeFase,
  BadgePrioridade,
} from "@/components/badges";
import { GaleriaFotos } from "@/components/galeria-fotos";
import {
  NIVEIS_APROVACAO,
  fluxoEncerrado,
  nivelDaEtapa,
  rotuloSituacao,
  situacaoComoAprovacao,
  type SituacaoAprovacao,
} from "@/lib/aprovacao";
import {
  obterAprovacoes,
  type DecisaoRegistrada,
  type Fluxo,
} from "@/lib/fluxo-aprovacao";
import { OrcamentosPainel } from "@/components/orcamentos-painel";
import { PainelDecisao, PainelReenvio } from "./painel-aprovacao";
import { CORES_APROVACAO, CORES_FASE } from "@/lib/cores";
import { cartao, tituloSecao } from "@/lib/ui";
import {
  type DetalheObra,
  detalheDemonstrativo,
} from "@/lib/obra-detalhe-mock";
import { buscarObra, type Obra } from "@/lib/obras-db";
import { formatarData, formatarValor } from "@/lib/obras-tipos";

export async function generateMetadata({
  params,
}: PageProps<"/obras/[id]">): Promise<Metadata> {
  const { id } = await params;
  const obra = await buscarObra(id);
  return { title: obra ? obra.titulo : "Solicitação" };
}

export default async function DetalheObraPage({
  params,
}: PageProps<"/obras/[id]">) {
  const sessao = await exigirAcesso("obras");
  const { id } = await params;
  const obra = await buscarObra(id);
  if (!obra) notFound();

  // As abas de Orçamentos, Execução e Conclusão continuam demonstrativas até
  // os respectivos módulos existirem; recebem apenas o básico da obra real.
  const detalhe = detalheDemonstrativo({
    id: obra.id,
    tipo: obra.tipo,
    data: obra.data,
    aprovada: obra.situacao === "Aprovada",
  });

  // Abas conforme o perfil: Orçamentos é do Presbitério (e do Administrador);
  // Execução e Conclusão, por ora, só do Administrador (PEN-026).
  const verOrcamentos = podeAcessarArea(sessao.perfil, "orcamentos");
  const verExecucao = podeAcessarArea(sessao.perfil, "execucao");

  // Fluxo de aprovação: dados reais (banco). Se o banco não responder, a tela
  // continua abrindo e avisa — as demais abas não dependem dele.
  let aprovacoes: { fluxo: Fluxo; decisoes: DecisaoRegistrada[] } | null = null;
  let erroBanco = false;
  try {
    aprovacoes = await obterAprovacoes(obra.id);
  } catch (erro) {
    console.error("Falha ao ler o fluxo de aprovação:", erro);
    erroBanco = true;
  }

  return (
    <div className="space-y-6">
      <Cabecalho obra={obra} fluxo={aprovacoes?.fluxo} />

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
            conteudo: (
              <Aprovacoes
                obraId={obra.id}
                dados={aprovacoes}
                erroBanco={erroBanco}
                perfil={sessao.perfil}
              />
            ),
          },
          ...(verOrcamentos
            ? [
                {
                  id: "orcamentos",
                  rotulo: "Orçamentos",
                  conteudo: (
                    <OrcamentosPainel
                      orcamentos={detalhe.orcamentos}
                      valorAprovado={aprovacoes?.fluxo.sgi.valorAprovado ?? undefined}
                    />
                  ),
                },
              ]
            : []),
          ...(verExecucao
            ? [
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
              ]
            : []),
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

function Cabecalho({ obra, fluxo }: { obra: Obra; fluxo?: Fluxo }) {
  return (
    <div>
      <LinkVoltar href="/obras">Voltar para Obras</LinkVoltar>

      <div className={`${cartao} mt-3 overflow-hidden`}>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted">
              {obra.igrejaNome} · {obra.cidade}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-brand sm:text-2xl">
              {obra.titulo}
            </h1>
            <p className="mt-1 font-mono text-xs text-muted">
              Solicitação {obra.id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {obra.prioridade ? (
              <BadgePrioridade valor={obra.prioridade} />
            ) : (
              <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
                Prioridade não definida
              </span>
            )}
            <BadgeAprovacao
              valor={fluxo ? situacaoComoAprovacao(fluxo.situacao) : obra.statusCor}
              rotulo={
                fluxo
                  ? rotuloSituacao(fluxo.situacao, fluxo.etapaAtual)
                  : obra.statusRotulo
              }
            />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          <Campo rotulo="Igreja" valor={obra.igrejaNome} />
          <Campo rotulo="Obra" valor={obra.titulo} />
          <Campo rotulo="Tipo" valor={obra.tipo} />
          <Campo
            rotulo="Prioridade"
            valor={obra.prioridade ?? "Não definida"}
          />
          <Campo
            rotulo="Status atual"
            valor={
              fluxo
                ? rotuloSituacao(fluxo.situacao, fluxo.etapaAtual)
                : obra.statusRotulo
            }
          />
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
          descricao="O envio de fotos será implementado em etapa futura."
        >
          <GaleriaFotos
            fotos={[]}
            vazio="Nenhuma foto anexada a esta solicitação."
          />
        </Cartao>
      </div>

      <Cartao titulo="Informações da solicitação">
        <dl className="space-y-3">
          <Linha rotulo="Igreja solicitante" valor={obra.igrejaNome} />
          <Linha rotulo="Cidade" valor={obra.cidade} />
          <Linha rotulo="Polo / Área / Região" valor="Ver cadastro da igreja" />
          <Linha rotulo="Tipo da obra" valor={obra.tipo} />
          <Linha
            rotulo="Prioridade"
            valor={obra.prioridade ?? "Não definida"}
          />
          <Linha rotulo="Data da solicitação" valor={formatarData(obra.data)} />
          <Linha rotulo="Status atual" valor={obra.statusRotulo} />
          <Linha
            rotulo="Registrada por"
            valor={obra.responsavel ?? "—"}
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

type Aprovacoes = { fluxo: Fluxo; decisoes: DecisaoRegistrada[] };

function Aprovacoes({
  obraId,
  dados,
  erroBanco,
  perfil,
}: {
  obraId: string;
  dados: Aprovacoes | null;
  erroBanco: boolean;
  perfil: Perfil;
}) {
  if (!dados) {
    return (
      <Cartao titulo="Aprovações">
        <p className="text-sm text-muted">
          {erroBanco
            ? "Não foi possível consultar o fluxo de aprovação agora. Recarregue a página em instantes."
            : "Fluxo de aprovação indisponível."}
        </p>
      </Cartao>
    );
  }

  const { fluxo, decisoes } = dados;
  const encerrado = fluxoEncerrado(fluxo.situacao);
  // O painel de decisão só aparece para o perfil da etapa atual — e a Server
  // Action confere de novo, no servidor.
  const podeDecidir = podeDecidirEtapa(perfil, fluxo.etapaAtual);

  return (
    <div className="space-y-6">
      {/* Situação atual */}
      <Cartao titulo="Situação da solicitação">
        <div className="flex flex-wrap items-center gap-3">
          <BadgeAprovacao
            valor={situacaoComoAprovacao(fluxo.situacao)}
            rotulo={rotuloSituacao(fluxo.situacao, fluxo.etapaAtual)}
          />
          <p className="text-sm text-muted">
            Etapa {fluxo.etapaAtual} de {NIVEIS_APROVACAO.length}
            {fluxo.atualizadoEm &&
              ` · última movimentação em ${formatarDataHora(fluxo.atualizadoEm)}`}
          </p>
        </div>
      </Cartao>

      {/* Decisão da etapa atual */}
      {!encerrado && !podeDecidir && (
        <Cartao titulo={`Decisão — ${nivelDaEtapa(fluxo.etapaAtual)}`}>
          <p className="text-sm text-muted">
            Esta etapa é decidida pelo perfil{" "}
            <span className="font-medium">{nivelDaEtapa(fluxo.etapaAtual)}</span>
            . Seu perfil ({perfil}) acompanha o andamento, mas não registra a
            decisão desta etapa.
          </p>
        </Cartao>
      )}

      {!encerrado &&
        podeDecidir &&
        (fluxo.situacao === "Em correção" ? (
          <Cartao
            titulo="Correção solicitada"
            descricao="A solicitação volta para a mesma etapa depois do reenvio; o fluxo não é encerrado."
          >
            <PainelReenvio obraId={obraId} />
          </Cartao>
        ) : (
          <Cartao
            titulo={`Decisão — ${nivelDaEtapa(fluxo.etapaAtual)}`}
            descricao="Quais perfis podem decidir em cada etapa ainda não está definido: a decisão fica registrada com o usuário, a data e a hora."
          >
            <PainelDecisao
              obraId={obraId}
              etapa={fluxo.etapaAtual}
              nivel={nivelDaEtapa(fluxo.etapaAtual)}
            />
          </Cartao>
        ))}

      {/* Linha do tempo */}
      <Cartao
        titulo="Linha do tempo das aprovações"
        descricao="Sequência informada pelo responsável do projeto. A solicitação só avança após a aprovação da etapa atual."
      >
        <ol>
          {NIVEIS_APROVACAO.map((nivel, i) => {
            const etapa = i + 1;
            const registros = decisoes.filter((d) => d.etapa === etapa);
            const ultima = registros
              .filter((d) => d.decisao !== "Reenviada após correção")
              .at(-1);

            const situacao: SituacaoAprovacao =
              ultima?.decisao === "Aprovado"
                ? "Aprovado"
                : ultima?.decisao === "Reprovado"
                  ? "Reprovado"
                  : ultima?.decisao === "Correção solicitada" &&
                      fluxo.situacao === "Em correção" &&
                      fluxo.etapaAtual === etapa
                    ? "Correção solicitada"
                    : ultima?.decisao === "Correção solicitada"
                      ? "Correção solicitada"
                      : "Aguardando";

            const cor = CORES_APROVACAO[situacao];
            const atual = fluxo.etapaAtual === etapa && !encerrado;

            return (
              <li key={nivel} className="relative flex gap-4 pb-6 last:pb-0">
                {i < NIVEIS_APROVACAO.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-5 left-[9px] h-full w-0.5 ${
                      registros.length > 0 ? cor.barra : "bg-border"
                    }`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative mt-1 size-5 shrink-0 rounded-full border-2 border-surface ${cor.ponto} ring-2 ${
                    atual ? "ring-brand/40" : "ring-border"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {etapa}. {nivel}
                    </p>
                    <BadgeAprovacao valor={situacao} />
                    {atual && (
                      <span className="text-xs text-brand">(etapa atual)</span>
                    )}
                  </div>

                  {registros.length === 0 ? (
                    <p className="mt-1 text-xs text-muted">
                      Sem decisão registrada.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {registros.map((r) => (
                        <li
                          key={r.id}
                          className="rounded-md border border-border bg-background px-3 py-2"
                        >
                          <p className="text-xs font-medium">
                            {r.decisao} · {r.usuarioNome}
                          </p>
                          <p className="text-xs text-muted">
                            {formatarDataHora(r.criadoEm)}
                            {r.usuarioEmail ? ` · ${r.usuarioEmail}` : ""}
                          </p>
                          {r.comentario && (
                            <p className="mt-1.5 text-xs leading-relaxed">
                              {r.comentario}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-xs text-muted">
          O histórico é preservado: cada decisão gera um registro novo e nada é
          alterado nem apagado.
        </p>
      </Cartao>
    </div>
  );
}

function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Fortaleza",
  });
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
