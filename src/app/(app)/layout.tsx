import { AppShell } from "@/components/app-shell";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";
import { areasDoPerfil } from "@/lib/permissoes";
import { exigirPerfil } from "@/lib/sessao";

// Páginas internas dependem da sessão: sempre renderizadas a cada requisição.
export const dynamic = "force-dynamic";

// Layout das páginas internas: exige usuário autenticado e com perfil
// definido no Clerk. Cada página ainda verifica a sua própria área
// (`exigirAcesso`), e o proxy faz a checagem extra quando o perfil está no
// token da sessão.
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const sessao = await exigirPerfil();

  return (
    <AppShell
      nome={APP_NAME}
      subtitulo={APP_SUBTITLE}
      versao={APP_VERSION}
      usuarioNome={sessao.nome}
      usuarioEmail={sessao.email}
      perfil={sessao.perfil}
      areas={[...areasDoPerfil(sessao.perfil)]}
    >
      {children}
    </AppShell>
  );
}
