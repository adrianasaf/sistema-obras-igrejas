import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCadastro } from "@/components/badges";
import {
  AvisoDemonstrativo,
  CabecalhoDetalhe,
  ListaVinculada,
} from "@/components/estrutura/comuns";
import {
  buscarPolo,
  caminhoDoPolo,
  igrejasDoPolo,
} from "@/lib/estrutura-mock";

export async function generateMetadata({
  params,
}: PageProps<"/polos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const polo = buscarPolo(id);
  return { title: polo ? polo.nome : "Polo" };
}

export default async function PoloPage({ params }: PageProps<"/polos/[id]">) {
  const { id } = await params;
  const polo = buscarPolo(id);
  if (!polo) notFound();

  const { area, regiao } = caminhoDoPolo(polo);
  const igrejas = igrejasDoPolo(polo.id);

  return (
    <div className="space-y-6">
      <CabecalhoDetalhe
        voltarHref="/polos"
        voltarRotulo="Voltar para Polos"
        titulo={polo.nome}
        subtitulo={area ? `Polo · ${area.nome}` : "Polo"}
        cracha={<BadgeCadastro valor={polo.status} />}
        editarHref={`/polos/${polo.id}/editar`}
        campos={[
          { rotulo: "Código", valor: polo.codigo },
          { rotulo: "Área vinculada", valor: area?.nome ?? "—" },
          { rotulo: "Região", valor: regiao?.nome ?? "—" },
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
