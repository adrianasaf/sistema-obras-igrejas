import type { Metadata } from "next";
import { CabecalhoPagina, LinkVoltar } from "@/components/cabecalho-pagina";
import { listarMigracoes, type EstadoMigracao } from "@/lib/migrador";
import { exigirAcesso } from "@/lib/sessao";
import { cartao, tituloSecao } from "@/lib/ui";
import { BotaoAplicar } from "./aplicar";

export const metadata: Metadata = { title: "Banco de dados" };

export default async function BancoPage() {
  await exigirAcesso("configuracoes");

  let migracoes: EstadoMigracao[] = [];
  let erro: string | null = null;
  try {
    migracoes = await listarMigracoes();
  } catch (e) {
    console.error("Falha ao consultar as migrações:", e);
    erro =
      "Não foi possível consultar o banco agora. Confira a variável DATABASE_URL e tente de novo.";
  }

  const pendentes = migracoes.filter((m) => !m.aplicadaEm);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LinkVoltar href="/configuracoes">Voltar para Configurações</LinkVoltar>
        <CabecalhoPagina
          titulo="Banco de dados"
          descricao="Migrações do sistema. Cada uma é aplicada uma única vez e fica registrada."
        />
      </div>

      {erro ? (
        <p className={`${cartao} px-5 py-6 text-sm text-muted`}>{erro}</p>
      ) : (
        <>
          <p className={`${cartao} px-5 py-4 text-sm`}>
            {pendentes.length === 0
              ? "Todas as migrações estão aplicadas."
              : `${pendentes.length} migração(ões) pendente(s). Aplique na ordem.`}
          </p>

          <ol className="space-y-4">
            {migracoes.map(({ migracao, aplicadaEm }) => (
              <li key={migracao.id} className={`${cartao} p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className={tituloSecao}>
                      <span className="font-mono text-sm">{migracao.id}</span> ·{" "}
                      {migracao.titulo}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {migracao.descricao}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
                      aplicadaEm
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        aplicadaEm ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {aplicadaEm ? "Aplicada" : "Pendente"}
                  </span>
                </div>

                <p className="mt-3 text-xs text-muted">
                  {migracao.comandos.length} comando(s)
                  {aplicadaEm &&
                    ` · aplicada em ${new Date(aplicadaEm).toLocaleString("pt-BR", {
                      timeZone: "America/Fortaleza",
                    })}`}
                </p>

                {!aplicadaEm && (
                  <div className="mt-4">
                    <BotaoAplicar id={migracao.id} titulo={migracao.titulo} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      <p className="text-xs text-muted">
        As migrações já aplicadas manualmente no console do Neon (001) podem
        aparecer como pendentes: aplicar de novo é seguro, os comandos usam
        &quot;if not exists&quot;.
      </p>
    </div>
  );
}
