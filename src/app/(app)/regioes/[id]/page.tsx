import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { notFound } from "next/navigation";
import { BadgeCadastro } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
  ListaVinculada,
} from "@/components/estrutura/comuns";
import { buscarRegiao, listarAreas } from "@/lib/estrutura-db";
import { statusFeminino } from "@/lib/estrutura-tipos";

export async function generateMetadata({
  params,
}: PageProps<"/regioes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const regiao = await buscarRegiao(id);
  return { title: regiao ? regiao.nome : "Região" };
}

export default async function RegiaoPage({
  params,
}: PageProps<"/regioes/[id]">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const regiao = await buscarRegiao(id);
  if (!regiao) notFound();

  const areas = (await listarAreas()).filter((a) => a.regiaoId === regiao.id);

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
          { rotulo: "Áreas vinculadas", valor: String(regiao.totalAreas) },
          { rotulo: "Status", valor: statusFeminino(regiao.status) },
        ]}
      />

      <ListaVinculada
        titulo="Áreas desta região"
        itens={areas.map((a) => ({
          id: a.id,
          href: `/areas/${a.id}`,
          nome: a.nome,
          detalhe: `${a.codigo} · ${a.totalPolos} polo(s) · ${a.responsavel}`,
          cracha: <BadgeCadastro valor={a.status} feminino />,
        }))}
        vazio="Nenhuma área vinculada a esta região."
      />

      <AvisoDemonstrativo />
    </div>
  );
}
