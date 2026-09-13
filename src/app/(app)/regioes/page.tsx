import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { BadgeCadastro } from "@/components/badges";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import {
  AcoesRegistro,
  AvisoDemonstrativo,
} from "@/components/estrutura/comuns";
import { CartaoLista, Tabela } from "@/components/tabela";
import { botaoPrimario } from "@/lib/ui";
import Link from "next/link";
import { listarRegioes } from "@/lib/estrutura-db";

export const metadata: Metadata = { title: "Regiões" };

export default async function RegioesPage() {
  await exigirAcesso("estrutura");
  const regioes = await listarRegioes();

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Regiões"
        descricao="Primeiro nível da estrutura administrativa. Dados demonstrativos."
        acao={
          <Link href="/regioes/nova" className={botaoPrimario}>
            Nova Região
          </Link>
        }
      />

      <Tabela
        acoes
        colunas={["Código", "Nome", "Coordenador", "Áreas", "Status"]}
      >
        {regioes.map((r) => (
          <tr key={r.id} className="hover:bg-background">
            <td className="px-4 py-3 font-mono text-xs">{r.codigo}</td>
            <td className="px-4 py-3 font-medium">{r.nome}</td>
            <td className="px-4 py-3">{r.responsavel}</td>
            <td className="px-4 py-3 tabular-nums">
              {r.totalAreas}
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
          <CartaoLista
            key={r.id}
            titulo={r.nome}
            subtitulo={`Código ${r.codigo}`}
            cracha={<BadgeCadastro valor={r.status} feminino />}
            dados={[
              { rotulo: "Coordenador", valor: r.responsavel },
              { rotulo: "Áreas", valor: String(r.totalAreas) },
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
