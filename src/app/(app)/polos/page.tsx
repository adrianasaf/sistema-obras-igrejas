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
import { POLOS, caminhoDoPolo, igrejasDoPolo } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Polos" };

export default async function PolosPage() {
  await exigirAcesso("estrutura");
  const polos = [...POLOS].sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Polos"
        descricao="Cada polo pertence a uma área. Dados demonstrativos."
        acao={
          <Link href="/polos/novo" className={botaoPrimario}>
            Novo Polo
          </Link>
        }
      />

      <Tabela
        acoes
        colunas={[
          "Código",
          "Nome",
          "Área vinculada",
          "Região",
          "Igrejas",
          "Status",
        ]}
      >
        {polos.map((p) => {
          const { area, regiao } = caminhoDoPolo(p);
          return (
            <tr key={p.id} className="hover:bg-background">
              <td className="px-4 py-3 font-mono text-xs">{p.codigo}</td>
              <td className="px-4 py-3">
                <p className="font-medium">{p.nome}</p>
                <p className="text-xs text-muted">{p.responsavel}</p>
              </td>
              <td className="px-4 py-3">{area?.nome ?? "—"}</td>
              <td className="px-4 py-3">{regiao?.nome ?? "—"}</td>
              <td className="px-4 py-3 tabular-nums">
                {igrejasDoPolo(p.id).length}
              </td>
              <td className="px-4 py-3">
                <BadgeCadastro valor={p.status} />
              </td>
              <td className="px-4 py-3">
                <AcoesRegistro
                  nome={p.nome}
                  verHref={`/polos/${p.id}`}
                  editarHref={`/polos/${p.id}/editar`}
                />
              </td>
            </tr>
          );
        })}
      </Tabela>

      <ul className="space-y-3 md:hidden">
        {polos.map((p) => {
          const { area, regiao } = caminhoDoPolo(p);
          return (
            <CartaoLista
              key={p.id}
              titulo={p.nome}
              subtitulo={`Código ${p.codigo}`}
              cracha={<BadgeCadastro valor={p.status} />}
              dados={[
                { rotulo: "Área", valor: area?.nome ?? "—" },
                { rotulo: "Região", valor: regiao?.nome ?? "—" },
                {
                  rotulo: "Igrejas",
                  valor: String(igrejasDoPolo(p.id).length),
                },
                { rotulo: "Coordenador", valor: p.responsavel },
              ]}
              acoes={
                <AcoesRegistro
                  nome={p.nome}
                  verHref={`/polos/${p.id}`}
                  editarHref={`/polos/${p.id}/editar`}
                />
              }
            />
          );
        })}
      </ul>

      <AvisoDemonstrativo />
    </div>
  );
}
