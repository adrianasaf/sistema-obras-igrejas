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
import { listarAreas } from "@/lib/estrutura-db";

export const metadata: Metadata = { title: "Áreas" };

export default async function AreasPage() {
  await exigirAcesso("estrutura");
  const areas = await listarAreas();

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Áreas"
        descricao="Cada área pertence a uma região. Dados demonstrativos."
        acao={
          <Link href="/areas/nova" className={botaoPrimario}>
            Nova Área
          </Link>
        }
      />

      <Tabela
        acoes
        colunas={["Código", "Nome", "Região vinculada", "Polos", "Status"]}
      >
        {areas.map((a) => (
          <tr key={a.id} className="hover:bg-background">
            <td className="px-4 py-3 font-mono text-xs">{a.codigo}</td>
            <td className="px-4 py-3">
              <p className="font-medium">{a.nome}</p>
              <p className="text-xs text-muted">{a.responsavel}</p>
            </td>
            <td className="px-4 py-3">{a.regiaoNome}</td>
            <td className="px-4 py-3 tabular-nums">{a.totalPolos}</td>
            <td className="px-4 py-3">
              <BadgeCadastro valor={a.status} feminino />
            </td>
            <td className="px-4 py-3">
              <AcoesRegistro
                nome={a.nome}
                verHref={`/areas/${a.id}`}
                editarHref={`/areas/${a.id}/editar`}
              />
            </td>
          </tr>
        ))}
      </Tabela>

      <ul className="space-y-3 md:hidden">
        {areas.map((a) => (
          <CartaoLista
            key={a.id}
            titulo={a.nome}
            subtitulo={`Código ${a.codigo}`}
            cracha={<BadgeCadastro valor={a.status} feminino />}
            dados={[
              { rotulo: "Região", valor: a.regiaoNome },
              { rotulo: "Polos", valor: String(a.totalPolos) },
              { rotulo: "Coordenador", valor: a.responsavel },
            ]}
            acoes={
              <AcoesRegistro
                nome={a.nome}
                verHref={`/areas/${a.id}`}
                editarHref={`/areas/${a.id}/editar`}
              />
            }
          />
        ))}
      </ul>

      <AvisoDemonstrativo />
    </div>
  );
}
