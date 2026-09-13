import type { Metadata } from "next";
import Link from "next/link";
import { sessaoAtual } from "@/lib/sessao";
import { APP_NAME } from "@/lib/app";
import { ROTULO_AREA, type Area } from "@/lib/permissoes";
import { botaoPrimario, botaoSecundario, cartao } from "@/lib/ui";

export const metadata: Metadata = { title: "Acesso não autorizado" };
export const dynamic = "force-dynamic";

export default async function SemPermissaoPage({
  searchParams,
}: PageProps<"/sem-permissao">) {
  const { area, motivo } = await searchParams;
  const sessao = await sessaoAtual();

  const semPerfil = motivo === "sem-perfil" || !sessao?.perfil;
  const nomeArea =
    typeof area === "string" && area in ROTULO_AREA
      ? ROTULO_AREA[area as Area]
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className={`${cartao} w-full max-w-lg p-6 sm:p-8`}>
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {APP_NAME}
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-brand">
          Acesso não autorizado
        </h1>

        {semPerfil ? (
          <p className="mt-4 text-sm leading-relaxed">
            Seu usuário ainda não tem um perfil de acesso definido. Solicite ao
            administrador do sistema que atribua o seu perfil.
          </p>
        ) : (
          <p className="mt-4 text-sm leading-relaxed">
            Seu perfil{" "}
            <span className="font-medium">{sessao?.perfil}</span> não tem acesso
            {nomeArea ? ` à área ${nomeArea}` : " a esta área"}. Se você precisa
            desse acesso, fale com o administrador do sistema.
          </p>
        )}

        {sessao?.email && (
          <dl className="mt-5 grid gap-3 rounded-md border border-border bg-background p-4 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted">Usuário</dt>
              <dd className="mt-0.5 font-medium break-words">{sessao.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Perfil</dt>
              <dd className="mt-0.5 font-medium">
                {sessao.perfil ?? "Não definido"}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={botaoPrimario}>
            Ir para o Dashboard
          </Link>
          <Link href="/login" className={botaoSecundario}>
            Entrar com outro usuário
          </Link>
        </div>
      </div>
    </div>
  );
}
