import type { Metadata } from "next";
import { BadgeCadastro } from "@/components/badges";
import {
  AcoesRegistro,
  AvisoDemonstrativo,
  CabecalhoLista,
  CartaoRegistro,
  Tabela,
} from "@/components/estrutura/comuns";
import { REGIOES, areasDaRegiao } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Regiões" };

export default function RegioesPage() {
  const regioes = [...REGIOES].sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <div className="space-y-6">
      <CabecalhoLista
        titulo="Regiões"
        descricao="Primeiro nível da estrutura administrativa. Dados demonstrativos."
        novoHref="/regioes/nova"
        novoRotulo="Nova Região"
      />

      <Tabela colunas={["Código", "Nome", "Coordenador", "Áreas", "Status"]}>
        {regioes.map((r) => (
          <tr key={r.id} className="hover:bg-background">
            <td className="px-4 py-3 font-mono text-xs">{r.codigo}</td>
            <td className="px-4 py-3 font-medium">{r.nome}</td>
            <td className="px-4 py-3">{r.responsavel}</td>
            <td className="px-4 py-3 tabular-nums">
              {areasDaRegiao(r.id).length}
            </td>
            <td className="px-4 py-3">
              <BadgeCadastro valor={r.status} feminino />
            </td>
            <td className="px-4 py-3">
              <AcoesRegistro
                nome={r.nome}
                verHref={`/regioes/${r.id}`}
                editarHref={`/regioes/${r.id}/editar`}
              />
            </td>
          </tr>
        ))}
      </Tabela>

      <ul className="space-y-3 md:hidden">
        {regioes.map((r) => (
          <CartaoRegistro
            key={r.id}
            titulo={r.nome}
            subtitulo={`Código ${r.codigo}`}
            cracha={<BadgeCadastro valor={r.status} feminino />}
            dados={[
              { rotulo: "Coordenador", valor: r.responsavel },
              { rotulo: "Áreas", valor: String(areasDaRegiao(r.id).length) },
            ]}
            acoes={
              <AcoesRegistro
                nome={r.nome}
                verHref={`/regioes/${r.id}`}
                editarHref={`/regioes/${r.id}/editar`}
              />
            }
          />
        ))}
      </ul>

      <AvisoDemonstrativo />
    </div>
  );
}
