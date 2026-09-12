import type { Metadata } from "next";
import { BadgeCadastro } from "@/components/badges";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import {
  AcoesRegistro,
  AvisoDemonstrativo,
} from "@/components/estrutura/comuns";
import { CartaoLista, Tabela } from "@/components/tabela";
import { botaoPrimario } from "@/lib/ui";
import Link from "next/link";
import { IGREJAS, caminhoDaIgreja } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Igrejas" };

export default function IgrejasPage() {
  const igrejas = [...IGREJAS].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

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
          const { polo, area, regiao } = caminhoDaIgreja(i);
          return (
            <tr key={i.id} className="hover:bg-background">
              <td className="px-4 py-3 font-mono text-xs">{i.codigo}</td>
              <td className="px-4 py-3 font-medium">{i.nome}</td>
              <td className="px-4 py-3">{polo?.nome ?? "—"}</td>
              <td className="px-4 py-3">{area?.nome ?? "—"}</td>
              <td className="px-4 py-3">{regiao?.nome ?? "—"}</td>
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
          const { polo, area, regiao } = caminhoDaIgreja(i);
          return (
            <CartaoLista
              key={i.id}
              titulo={i.nome}
              subtitulo={`Código ${i.codigo} · ${i.cidade}`}
              cracha={<BadgeCadastro valor={i.status} feminino />}
              dados={[
                { rotulo: "Polo", valor: polo?.nome ?? "—" },
                { rotulo: "Área", valor: area?.nome ?? "—" },
                { rotulo: "Região", valor: regiao?.nome ?? "—" },
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
