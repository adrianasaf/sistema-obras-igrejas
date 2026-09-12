"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgePrioridade, BadgeStatus } from "@/components/badges";
import {
  BarraFiltros,
  CampoBusca,
  ContadorResultados,
  GrupoFiltro,
} from "@/components/filtros";
import { CartaoLista, ListaVazia, Tabela } from "@/components/tabela";
import { CORES_PRIORIDADE, CORES_STATUS } from "@/lib/cores";
import { botaoAcao } from "@/lib/ui";
import {
  PRIORIDADES,
  STATUS_OBRA,
  formatarData,
  formatarValor,
  valoresDemonstrativos,
  type Obra,
  type Prioridade,
  type StatusObra,
} from "@/lib/obras-mock";

// Filtros e busca funcionam apenas sobre os dados demonstrativos carregados
// na tela: não há consulta a banco de dados.
export function ListaObras({ obras }: { obras: Obra[] }) {
  const [busca, setBusca] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | "Todas">("Todas");
  const [status, setStatus] = useState<StatusObra | "Todos">("Todos");

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return obras.filter((o) => {
      const atendeBusca =
        termo === "" ||
        [o.igreja, o.titulo, o.tipo, o.id].some((campo) =>
          campo.toLowerCase().includes(termo),
        );
      const atendePrioridade =
        prioridade === "Todas" || o.prioridade === prioridade;
      const atendeStatus = status === "Todos" || o.status === status;
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
          opcoes={["Todas", ...PRIORIDADES]}
          atual={prioridade}
          aoEscolher={(v) => setPrioridade(v as Prioridade | "Todas")}
          cor={(v) =>
            v === "Todas" ? undefined : CORES_PRIORIDADE[v as Prioridade].ponto
          }
        />

        <GrupoFiltro
          rotulo="Status"
          opcoes={["Todos", ...STATUS_OBRA]}
          atual={status}
          aoEscolher={(v) => setStatus(v as StatusObra | "Todos")}
          cor={(v) =>
            v === "Todos" ? undefined : CORES_STATUS[v as StatusObra].ponto
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
        <ListaVazia>Nenhuma obra encontrada com os filtros aplicados.</ListaVazia>
      ) : (
        <>
          {/* Tabela (tablet e computador) */}
          <Tabela
            acoes
            colunas={[
              "Igreja",
              "Tipo",
              "Prioridade",
              "Status",
              "Data",
              { rotulo: "Valor estimado", direita: true },
            ]}
          >
            {filtradas.map((o) => (
              <tr key={o.id} className="hover:bg-background">
                <td className="px-4 py-3">
                  <p className="font-medium">{o.igreja}</p>
                  <p className="text-xs text-muted">{o.titulo}</p>
                </td>
                <td className="px-4 py-3">{o.tipo}</td>
                <td className="px-4 py-3">
                  <BadgePrioridade valor={o.prioridade} />
                </td>
                <td className="px-4 py-3">
                  <BadgeStatus valor={o.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatarData(o.data)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                  {formatarValor(valoresDemonstrativos(o).estimado)}
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
                subtitulo={o.igreja}
                cracha={
                  <>
                    <BadgePrioridade valor={o.prioridade} />
                    <BadgeStatus valor={o.status} />
                  </>
                }
                dados={[
                  { rotulo: "Tipo", valor: o.tipo },
                  { rotulo: "Data", valor: formatarData(o.data) },
                  {
                    rotulo: "Valor estimado",
                    valor: formatarValor(valoresDemonstrativos(o).estimado),
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
