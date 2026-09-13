import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import Link from "next/link";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";
import { cartao, tituloSecao } from "@/lib/ui";
import { Preferencias } from "./preferencias";

export const metadata: Metadata = { title: "Configurações" };

// Informações institucionais ainda não definidas ficam marcadas como
// PENDENTE DE DEFINIÇÃO (docs/11-PENDENCIAS.md). Nada aqui é inventado.
const INSTITUCIONAIS = [
  { rotulo: "Nome oficial da instituição", valor: "PENDENTE DE DEFINIÇÃO" },
  { rotulo: "Abrangência", valor: "Paraíba" },
  {
    rotulo: "Estrutura administrativa",
    valor: "Região → Área → Polo → Igreja",
  },
  { rotulo: "Responsável pelo sistema", valor: "PENDENTE DE DEFINIÇÃO" },
  { rotulo: "Contato de suporte", valor: "PENDENTE DE DEFINIÇÃO" },
  { rotulo: "Uso", valor: "Interno, acesso restrito" },
];

export default async function ConfiguracoesPage() {
  await exigirAcesso("configuracoes");
  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Configurações"
        descricao="Informações do sistema e preferências de interface."
      />

      {/* Sistema */}
      <section className={`${cartao} p-5 sm:p-6`}>
        <h2 className={tituloSecao}>Sistema</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Item rotulo="Nome do sistema" valor={APP_NAME} />
          <Item rotulo="Descrição" valor={APP_SUBTITLE} />
          <Item rotulo="Versão atual" valor={APP_VERSION} mono />
          <Item rotulo="Ambiente" valor="Produção (Vercel)" />
          <Item rotulo="Autenticação" valor="Clerk (e-mail e senha)" />
          <Item rotulo="Banco de dados" valor="Neon PostgreSQL (sem tabelas)" />
        </dl>
        <p className="mt-4 text-xs text-muted">
          O nome do sistema é provisório e a identidade visual oficial ainda não
          foi definida.
        </p>
      </section>

      {/* Banco de dados */}
      <section className={`${cartao} p-5 sm:p-6`}>
        <h2 className={tituloSecao}>Banco de dados</h2>
        <p className="mt-1 text-sm text-muted">
          Aplicação das migrações do sistema (só Administrador).
        </p>
        <Link
          href="/configuracoes/banco"
          className="mt-4 inline-flex text-sm font-medium text-brand hover:underline"
        >
          Abrir migrações →
        </Link>
      </section>

      <Preferencias />

      {/* Informações institucionais */}
      <section className={`${cartao} p-5 sm:p-6`}>
        <h2 className={tituloSecao}>Informações institucionais</h2>
        <p className="mt-1 text-xs text-muted">
          Os campos marcados como pendentes serão preenchidos quando forem
          definidos pelo responsável.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUCIONAIS.map((i) => (
            <Item key={i.rotulo} rotulo={i.rotulo} valor={i.valor} />
          ))}
        </dl>
      </section>

      <p className="text-xs text-muted">
        Tela demonstrativa: nenhuma configuração é salva nesta etapa.
      </p>
    </div>
  );
}

function Item({
  rotulo,
  valor,
  mono,
}: {
  rotulo: string;
  valor: string;
  mono?: boolean;
}) {
  const pendente = valor === "PENDENTE DE DEFINIÇÃO";
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd
        className={`mt-1 text-sm font-medium ${mono ? "font-mono" : ""} ${
          pendente ? "text-muted" : ""
        }`}
      >
        {valor}
      </dd>
    </div>
  );
}
