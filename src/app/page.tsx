const APP_NAME = "Sistema de Gestão de Obras";
const APP_SUBTITLE = "Gestão e acompanhamento das obras das igrejas";
const APP_VERSION = "0.1.0";

// Módulos previstos no roadmap (docs/08-ROADMAP.md). Apenas informativo:
// nenhum deles está implementado nesta versão.
const MODULOS = [
  {
    titulo: "Estrutura administrativa",
    descricao: "Cadastro de Região, Área, Polo e Igreja.",
  },
  {
    titulo: "Solicitações de obra",
    descricao:
      "Reformas, ampliações, construções e manutenções, com prioridade Emergencial, P1, P2 e P3.",
  },
  {
    titulo: "Aprovações e Presbitério",
    descricao: "Fluxo de aprovações hierárquicas, análise e orçamentos.",
  },
  {
    titulo: "Execução em cinco fases",
    descricao: "Acompanhamento da obra, materiais, estoque e fotos.",
  },
  {
    titulo: "Financeiro",
    descricao: "Controle dos valores e gastos de cada obra.",
  },
  {
    titulo: "Relatórios e auditoria",
    descricao: "Indicadores e registro de quem fez o quê e quando.",
  },
];

const HIERARQUIA = ["Região", "Área", "Polo", "Igreja"];

export default function Home() {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand text-sm font-semibold text-white"
          >
            GO
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight text-brand">
              {APP_NAME}
            </p>
            <p className="truncate text-xs text-muted">{APP_SUBTITLE}</p>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-brand text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
              Sistema interno
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {APP_NAME}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
              {APP_SUBTITLE}
            </p>
            <p className="mt-6 max-w-2xl text-sm text-white/70">
              Plataforma privada para centralizar solicitações, aprovações,
              orçamentos, execução e acompanhamento das obras, com
              rastreabilidade de todas as ações.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-lg font-semibold text-brand">
            Estrutura administrativa
          </h2>
          <p className="mt-1 text-sm text-muted">
            Cada igreja pertence a um polo, cada polo a uma área e cada área a
            uma região.
          </p>
          <ol className="mt-6 flex flex-wrap items-center gap-2">
            {HIERARQUIA.map((nivel, i) => (
              <li key={nivel} className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium">
                  {nivel}
                </span>
                {i < HIERARQUIA.length - 1 && (
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="text-lg font-semibold text-brand">
              Módulos previstos
            </h2>
            <p className="mt-1 text-sm text-muted">
              Serão disponibilizados gradualmente conforme o roadmap do
              projeto.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULOS.map((m) => (
                <li
                  key={m.titulo}
                  className="rounded-lg border border-border bg-background p-5"
                >
                  <h3 className="font-medium">{m.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {m.descricao}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{APP_NAME} · Uso interno</p>
          <p className="font-mono">Versão {APP_VERSION}</p>
        </div>
      </footer>
    </>
  );
}
