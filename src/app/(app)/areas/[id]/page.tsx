import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { notFound } from "next/navigation";
import { BadgeCadastro } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
  ListaVinculada,
} from "@/components/estrutura/comuns";
import { buscarArea, listarPolos } from "@/lib/estrutura-db";
import { statusFeminino } from "@/lib/estrutura-tipos";

export async function generateMetadata({
  params,
}: PageProps<"/areas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const area = await buscarArea(id);
  return { title: area ? area.nome : "Área" };
}

export default async function AreaPage({ params }: PageProps<"/areas/[id]">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const area = await buscarArea(id);
  if (!area) notFound();

  const polos = (await listarPolos()).filter((p) => p.areaId === area.id);

  return (
    <div className="space-y-6">
      <CabecalhoDetalhe
        voltarHref="/areas"
        voltarRotulo="Voltar para Áreas"
        titulo={area.nome}
        subtitulo={`Área · ${area.regiaoNome}`}
        cracha={<BadgeCadastro valor={area.status} feminino />}
        editarHref={`/areas/${area.id}/editar`}
        campos={[
          { rotulo: "Código", valor: area.codigo },
          { rotulo: "Região vinculada", valor: area.regiaoNome },
          { rotulo: "Coordenador da Área", valor: area.responsavel },
          { rotulo: "Polos vinculados", valor: String(polos.length) },
          { rotulo: "Status", valor: statusFeminino(area.status) },
        ]}
      />

      <ListaVinculada
        titulo="Polos desta área"
        itens={polos.map((p) => ({
          id: p.id,
          href: `/polos/${p.id}`,
          nome: p.nome,
          detalhe: `${p.codigo} · ${p.totalIgrejas} igreja(s) · ${p.responsavel}`,
          cracha: <BadgeCadastro valor={p.status} />,
        }))}
        vazio="Nenhum polo vinculado a esta área."
      />

      <AvisoDemonstrativo />
    </div>
  );
}
