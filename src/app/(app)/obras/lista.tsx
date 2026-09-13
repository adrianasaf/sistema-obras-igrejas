"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeAprovacao, BadgePrioridade } from "@/components/badges";
import {
  BarraFiltros,
  CampoBusca,
  ContadorResultados,
  GrupoFiltro,
} from "@/components/filtros";
import { CartaoLista, ListaVazia, Tabela } from "@/components/tabela";
import {
  SITUACOES_FLUXO,
  type SituacaoFluxo,
} from "@/lib/aprovacao";
import { CORES_APROVACAO, CORES_PRIORIDADE } from "@/lib/cores";
import type { Obra } from "@/lib/obras-db";
import {
  PRIORIDADES,
  formatarData,
  type Prioridade,
} from "@/lib/obras-tipos";
import { botaoAcao } from "@/lib/ui";

// Filtros e busca funcionam sobre as solicitações já carregadas na tela (a
// consulta ao banco é feita pela página). A prioridade pode estar vazia: quem
// define é o pastor responsável da COMBENS (DEC-013).
export function ListaObras({ obras }: { obras: Obra[] }) {
  const [busca, setBusca] = useState("");
  type FiltroPrioridade = Prioridade | "Todas" | "Não definida";
  const [prioridade, setPrioridade] = useState<FiltroPrioridade>("Todas");
  const [status, setStatus] = useState<SituacaoFluxo | "Todos">("Todos");

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return obras.filter((o) => {
      const atendeBusca =
        termo === "" ||
        [o.igrejaNome, o.titulo, o.tipo, o.id].some((campo) =>
          campo.toLowerCase().includes(termo),
        );
      const atendePrioridade =
        prioridade === "Todas" ||
        (prioridade === "Não definida"
          ? o.prioridade === null
          : o.prioridade === prioridade);
      const atendeStatus = status === "Todos" || o.situacao === status;
      return atendeBusca && atendePrioridade && atendeStatus;
    });
  }, [obras, busca, prioridade, status]);

  const limpar = () => {
    setBusca("");
    setPrioridade("Todas");
    setStatus("Todos");
  };

  const filtrando =
    busca !== "" || prioridade !== "Todas" || status !== "Todos";

  return (
    <div className="space-y-4">
      {/* Busca e filtros */}
      <BarraFiltros>
        <CampoBusca
          id="busca-obras"
          rotulo="Buscar obras"
          valor={busca}
          aoDigitar={setBusca}
          placeholder="Buscar por igreja, título, tipo ou número"
          aoLimpar={filtrando ? limpar : undefined}
        />

        <GrupoFiltro
          rotulo="Prioridade"
          opcoes={["Todas", ...PRIORIDADES, "Não definida"]}
          atual={prioridade}
          aoEscolher={(v) => setPrioridade(v as FiltroPrioridade)}
          cor={(v) =>
            v === "Todas" || v === "Não definida"
              ? undefined
              : CORES_PRIORIDADE[v as Prioridade].ponto
          }
        />

        <GrupoFiltro
          rotulo="Status"
          opcoes={["Todos", ...SITUACOES_FLUXO]}
          atual={status}
          aoEscolher={(v) => setStatus(v as SituacaoFluxo | "Todos")}
          cor={(v) =>
            v === "Todos"
              ? undefined
              : CORES_APROVACAO[
                  v === "Aprovada"
                    ? "Aprovado"
                    : v === "Reprovada"
                      ? "Reprovado"
                      : v === "Em correção"
                        ? "Correção solicitada"
                        : "Aguardando"
                ].ponto
          }
        />
      </BarraFiltros>

      <ContadorResultados
        total={filtradas.length}
        totalGeral={obras.length}
        singular="obra"
        plural="obras"
      />

      {filtradas.length === 0 ? (
        <ListaVazia>
          {obras.length === 0
            ? "Nenhuma solicitação registrada ainda."
            : "Nenhuma obra encontrada com os filtros aplicados."}
        </ListaVazia>
      ) : (
        <>
          {/* Tabela (tablet e computador) */}
          <Tabela
            acoes
            colunas={["Igreja", "Tipo", "Prioridade", "Status", "Data"]}
          >
            {filtradas.map((o) => (
              <tr key={o.id} className="hover:bg-background">
                <td className="px-4 py-3">
                  <p className="font-medium">{o.igrejaNome}</p>
                  <p className="text-xs text-muted">{o.titulo}</p>
                </td>
                <td className="px-4 py-3">{o.tipo}</td>
                <td className="px-4 py-3">
                  {o.prioridade ? (
                    <BadgePrioridade valor={o.prioridade} />
                  ) : (
                    <span className="text-xs text-muted">Não definida</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <BadgeAprovacao valor={o.statusCor} rotulo={o.statusRotulo} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatarData(o.data)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/obras/${o.id}`} className={`${botaoAcao} text-brand`}>
                    Abrir detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </Tabela>

          {/* Cartões (celular) */}
          <ul className="space-y-3 md:hidden">
            {filtradas.map((o) => (
              <CartaoLista
                key={o.id}
                titulo={o.titulo}
                subtitulo={o.igrejaNome}
                cracha={
                  <>
                    {o.prioridade && <BadgePrioridade valor={o.prioridade} />}
                    <BadgeAprovacao valor={o.statusCor} rotulo={o.statusRotulo} />
                  </>
                }
                dados={[
                  { rotulo: "Tipo", valor: o.tipo },
                  { rotulo: "Data", valor: formatarData(o.data) },
                  {
                    rotulo: "Prioridade",
                    valor: o.prioridade ?? "Não definida",
                  },
                ]}
                acoes={
                  <Link
                    href={`/obras/${o.id}`}
                    className={`${botaoAcao} w-full text-brand`}
                  >
                    Abrir detalhes
                  </Link>
                }
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
