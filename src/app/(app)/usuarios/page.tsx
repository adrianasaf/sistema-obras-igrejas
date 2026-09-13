import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import {
  listarAreas,
  listarIgrejas,
  listarPolos,
  listarRegioes,
} from "@/lib/estrutura-db";
import { USUARIOS } from "@/lib/usuarios-mock";
import { PainelUsuarios } from "./painel";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsuariosPage() {
  await exigirAcesso("usuarios");
  const usuarios = [...USUARIOS].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

  // Registros da estrutura administrativa (banco) para exibir e escolher o
  // vínculo de cada usuário.
  const [regioes, areas, polos, igrejas] = await Promise.all([
    listarRegioes(),
    listarAreas(),
    listarPolos(),
    listarIgrejas(),
  ]);
  const estrutura = { regiao: regioes, area: areas, polo: polos, igreja: igrejas };

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Usuários e perfis"
        descricao="Acessos ao sistema e vínculo com a estrutura administrativa. Dados demonstrativos."
      />

      <PainelUsuarios usuarios={usuarios} estrutura={estrutura} />

      <p className="text-xs text-muted">
        Tela demonstrativa: nenhuma permissão é aplicada e nenhum cadastro é
        gravado. A autenticação continua sendo feita pelo Clerk, sem relação com
        esta lista.
      </p>
    </div>
  );
}
