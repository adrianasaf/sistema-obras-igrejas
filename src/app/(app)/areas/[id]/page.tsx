import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { notFound } from "next/navigation";
import { BadgeCadastro } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
  ListaVinculada,
} from "@/components/estrutura/comuns";
import {
  buscarArea,
  buscarRegiao,
  igrejasDoPolo,
  polosDaArea,
  statusFeminino,
} from "@/lib/estrutura-mock";

export async function generateMetadata({
  params,
}: PageProps<"/areas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const area = buscarArea(id);
  return { title: area ? area.nome : "Área" };
}

export default async function AreaPage({ params }: PageProps<"/areas/[id]">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const area = buscarArea(id);
  if (!area) notFound();

  const regiao = buscarRegiao(area.regiaoId);
  const polos = polosDaArea(area.id);

  return (
    <div className="space-y-6">
      <CabecalhoDetalhe
        voltarHref="/areas"
        voltarRotulo="Voltar para Áreas"
        titulo={area.nome}
        subtitulo={regiao ? `Área · ${regiao.nome}` : "Área"}
        cracha={<BadgeCadastro valor={area.status} feminino />}
        editarHref={`/areas/${area.id}/editar`}
        campos={[
          { rotulo: "Código", valor: area.codigo },
          { rotulo: "Região vinculada", valor: regiao?.nome ?? "—" },
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
          detalhe: `${p.codigo} · ${igrejasDoPolo(p.id).length} igreja(s) · ${p.responsavel}`,
          cracha: <BadgeCadastro valor={p.status} />,
        }))}
        vazio="Nenhum polo vinculado a esta área."
      />

      <AvisoDemonstrativo />
    </div>
  );
}
