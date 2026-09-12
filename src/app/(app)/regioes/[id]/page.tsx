import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCadastro } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
  ListaVinculada,
} from "@/components/estrutura/comuns";
import {
  areasDaRegiao,
  buscarRegiao,
  polosDaArea,
  statusFeminino,
} from "@/lib/estrutura-mock";

export async function generateMetadata({
  params,
}: PageProps<"/regioes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const regiao = buscarRegiao(id);
  return { title: regiao ? regiao.nome : "Região" };
}

export default async function RegiaoPage({
  params,
}: PageProps<"/regioes/[id]">) {
  const { id } = await params;
  const regiao = buscarRegiao(id);
  if (!regiao) notFound();

  const areas = areasDaRegiao(regiao.id);

  return (
    <div className="space-y-6">
      <CabecalhoDetalhe
        voltarHref="/regioes"
        voltarRotulo="Voltar para Regiões"
        titulo={regiao.nome}
        subtitulo="Região"
        cracha={<BadgeCadastro valor={regiao.status} feminino />}
        editarHref={`/regioes/${regiao.id}/editar`}
        campos={[
          { rotulo: "Código", valor: regiao.codigo },
          { rotulo: "Coordenador da Região", valor: regiao.responsavel },
          { rotulo: "Áreas vinculadas", valor: String(areas.length) },
          { rotulo: "Status", valor: statusFeminino(regiao.status) },
        ]}
      />

      <ListaVinculada
        titulo="Áreas desta região"
        itens={areas.map((a) => ({
          id: a.id,
          href: `/areas/${a.id}`,
          nome: a.nome,
          detalhe: `${a.codigo} · ${polosDaArea(a.id).length} polo(s) · ${a.responsavel}`,
          cracha: <BadgeCadastro valor={a.status} feminino />,
        }))}
        vazio="Nenhuma área vinculada a esta região."
      />

      <AvisoDemonstrativo />
    </div>
  );
}
