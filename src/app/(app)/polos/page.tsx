import type { Metadata } from "next";
import { BadgeCadastro } from "@/components/badges";
import {
  AcoesRegistro,
  AvisoDemonstrativo,
  CabecalhoLista,
  CartaoRegistro,
  Tabela,
} from "@/components/estrutura/comuns";
import { POLOS, caminhoDoPolo, igrejasDoPolo } from "@/lib/estrutura-mock";

export const metadata: Metadata = { title: "Polos" };

export default function PolosPage() {
  const polos = [...POLOS].sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <div className="space-y-6">
      <CabecalhoLista
        titulo="Polos"
        descricao="Cada polo pertence a uma área. Dados demonstrativos."
        novoHref="/polos/novo"
        novoRotulo="Novo Polo"
      />

      <Tabela
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
            <CartaoRegistro
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
