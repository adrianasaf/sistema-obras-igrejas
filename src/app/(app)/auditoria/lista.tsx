"use client";

import { useMemo, useState } from "react";
import {
  BarraFiltros,
  CampoBusca,
  ContadorResultados,
  GrupoFiltro,
} from "@/components/filtros";
import { CartaoLista, ListaVazia, Tabela } from "@/components/tabela";
import type { LinhaAuditoria } from "@/lib/auditoria";

const ROTULO: Record<string, string> = {
  obra: "Solicitação",
  aprovacao: "Aprovação",
  sgi: "SGI",
  orcamento: "Orçamento",
  croqui: "Croqui",
  estrutura: "Estrutura",
  material: "Material",
  estoque: "Estoque",
};

function formatar(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Fortaleza",
  });
}

// Filtro por tipo de entidade e busca por usuário, sobre os registros já
// carregados pela página.
export function ListaAuditoria({ registros }: { registros: LinhaAuditoria[] }) {
  const [busca, setBusca] = useState("");
  const [entidade, setEntidade] = useState("Todas");

  const entidades = useMemo(
    () => [
      "Todas",
      ...Array.from(new Set(registros.map((r) => r.entidade))).sort(),
    ],
    [registros],
  );

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return registros.filter((r) => {
      const atendeBusca =
        termo === "" ||
        r.usuarioNome.toLowerCase().includes(termo) ||
        r.acao.toLowerCase().includes(termo) ||
        (r.entidadeId ?? "").toLowerCase().includes(termo);
      const atendeEntidade = entidade === "Todas" || r.entidade === entidade;
      return atendeBusca && atendeEntidade;
    });
  }, [registros, busca, entidade]);

  const filtrando = busca !== "" || entidade !== "Todas";

  return (
    <div className="space-y-4">
      <BarraFiltros>
        <CampoBusca
          id="busca-auditoria"
          rotulo="Buscar na auditoria"
          valor={busca}
          aoDigitar={setBusca}
          placeholder="Buscar por usuário, ação ou registro"
          aoLimpar={
            filtrando
              ? () => {
                  setBusca("");
                  setEntidade("Todas");
                }
              : undefined
          }
        />
        <GrupoFiltro
          rotulo="Tipo"
          opcoes={entidades.map((e) => (e === "Todas" ? e : ROTULO[e] ?? e))}
          atual={entidade === "Todas" ? "Todas" : (ROTULO[entidade] ?? entidade)}
          aoEscolher={(rotulo) => {
            if (rotulo === "Todas") return setEntidade("Todas");
            const bruto = Object.keys(ROTULO).find((k) => ROTULO[k] === rotulo);
            setEntidade(bruto ?? rotulo);
          }}
        />
      </BarraFiltros>

      <ContadorResultados
        total={filtrados.length}
        totalGeral={registros.length}
        singular="ação"
        plural="ações"
      />

      {filtrados.length === 0 ? (
        <ListaVazia>
          {registros.length === 0
            ? "Nenhuma ação registrada ainda."
            : "Nenhuma ação encontrada com os filtros aplicados."}
        </ListaVazia>
      ) : (
        <>
          <Tabela colunas={["Quando", "Usuário", "Ação", "Tipo", "Registro", "Detalhe"]}>
            {filtrados.map((r) => (
              <tr key={r.id} className="hover:bg-background">
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {formatar(r.criadoEm)}
                </td>
                <td className="px-4 py-3 font-medium">{r.usuarioNome}</td>
                <td className="px-4 py-3">{r.acao}</td>
                <td className="px-4 py-3">{ROTULO[r.entidade] ?? r.entidade}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {r.entidadeId ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted">{r.detalhe ?? "—"}</td>
              </tr>
            ))}
          </Tabela>

          <ul className="space-y-3 md:hidden">
            {filtrados.map((r) => (
              <CartaoLista
                key={r.id}
                titulo={r.acao}
                subtitulo={`${r.usuarioNome} · ${formatar(r.criadoEm)}`}
                dados={[
                  { rotulo: "Tipo", valor: ROTULO[r.entidade] ?? r.entidade },
                  { rotulo: "Registro", valor: r.entidadeId ?? "—" },
                  { rotulo: "Detalhe", valor: r.detalhe ?? "—" },
                ]}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
