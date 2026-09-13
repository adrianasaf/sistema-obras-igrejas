import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { notFound } from "next/navigation";
import { BadgeCadastro } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
  ListaVinculada,
} from "@/components/estrutura/comuns";
import { buscarPolo, listarIgrejas } from "@/lib/estrutura-db";

export async function generateMetadata({
  params,
}: PageProps<"/polos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const polo = await buscarPolo(id);
  return { title: polo ? polo.nome : "Polo" };
}

export default async function PoloPage({ params }: PageProps<"/polos/[id]">) {
  await exigirAcesso("estrutura");
  const { id } = await params;
  const polo = await buscarPolo(id);
  if (!polo) notFound();

  const igrejas = (await listarIgrejas()).filter((i) => i.poloId === polo.id);

  return (
    <div className="space-y-6">
      <CabecalhoDetalhe
        voltarHref="/polos"
        voltarRotulo="Voltar para Polos"
        titulo={polo.nome}
        subtitulo={`Polo · ${polo.areaNome}`}
        cracha={<BadgeCadastro valor={polo.status} />}
        editarHref={`/polos/${polo.id}/editar`}
        campos={[
          { rotulo: "Código", valor: polo.codigo },
          { rotulo: "Área vinculada", valor: polo.areaNome },
          { rotulo: "Região", valor: polo.regiaoNome },
          { rotulo: "Coordenador do Polo", valor: polo.responsavel },
          { rotulo: "Igrejas vinculadas", valor: String(igrejas.length) },
          { rotulo: "Status", valor: polo.status },
        ]}
      />

      <ListaVinculada
        titulo="Igrejas deste polo"
        itens={igrejas.map((i) => ({
          id: i.id,
          href: `/igrejas/${i.id}`,
          nome: i.nome,
          detalhe: `${i.codigo} · ${i.cidade}`,
          cracha: <BadgeCadastro valor={i.status} feminino />,
        }))}
        vazio="Nenhuma igreja vinculada a este polo."
      />

      <AvisoDemonstrativo />
    </div>
  );
}
