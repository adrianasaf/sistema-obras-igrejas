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
import { listarIgrejas } from "@/lib/estrutura-db";

export const metadata: Metadata = { title: "Igrejas" };

export default async function IgrejasPage() {
  await exigirAcesso("estrutura");
  const igrejas = await listarIgrejas();

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Igrejas"
        descricao="Cada igreja pertence a um polo. Dados demonstrativos."
        acao={
          <Link href="/igrejas/nova" className={botaoPrimario}>
            Nova Igreja
          </Link>
        }
      />

      <Tabela
        acoes
        colunas={["Código", "Nome", "Polo", "Área", "Região", "Cidade", "Status"]}
      >
        {igrejas.map((i) => {
          return (
            <tr key={i.id} className="hover:bg-background">
              <td className="px-4 py-3 font-mono text-xs">{i.codigo}</td>
              <td className="px-4 py-3 font-medium">{i.nome}</td>
              <td className="px-4 py-3">{i.poloNome}</td>
              <td className="px-4 py-3">{i.areaNome}</td>
              <td className="px-4 py-3">{i.regiaoNome}</td>
              <td className="px-4 py-3">{i.cidade}</td>
              <td className="px-4 py-3">
                <BadgeCadastro valor={i.status} feminino />
              </td>
              <td className="px-4 py-3">
                <AcoesRegistro
                  nome={i.nome}
                  verHref={`/igrejas/${i.id}`}
                  editarHref={`/igrejas/${i.id}/editar`}
                />
              </td>
            </tr>
          );
        })}
      </Tabela>

      <ul className="space-y-3 md:hidden">
        {igrejas.map((i) => {
          return (
            <CartaoLista
              key={i.id}
              titulo={i.nome}
              subtitulo={`Código ${i.codigo} · ${i.cidade}`}
              cracha={<BadgeCadastro valor={i.status} feminino />}
              dados={[
                { rotulo: "Polo", valor: i.poloNome },
                { rotulo: "Área", valor: i.areaNome },
                { rotulo: "Região", valor: i.regiaoNome },
                { rotulo: "Cidade", valor: i.cidade },
              ]}
              acoes={
                <AcoesRegistro
                  nome={i.nome}
                  verHref={`/igrejas/${i.id}`}
                  editarHref={`/igrejas/${i.id}/editar`}
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
