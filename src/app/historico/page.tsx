import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Histórico de Desenvolvimento" };

const ARQUIVO = path.join(
  process.cwd(),
  "docs",
  "10-HISTORICO-DESENVOLVIMENTO.md",
);

export default async function HistoricoPage() {
  const markdown = await readFile(ARQUIVO, "utf8");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Histórico de Desenvolvimento
        </h1>
        <p className="mt-1 text-sm text-muted">
          Conteúdo de <code className="font-mono">docs/10-HISTORICO-DESENVOLVIMENTO.md</code>.
        </p>
      </div>
      <article className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        {renderizarMarkdown(markdown)}
      </article>
    </div>
  );
}

// Renderizador mínimo para o subconjunto de Markdown usado nos docs do projeto
// (títulos, listas com dois níveis, blocos de código, negrito e separadores).
function renderizarMarkdown(md: string): ReactNode[] {
  const linhas = md.replace(/\r\n/g, "\n").split("\n");
  const saida: ReactNode[] = [];
  let lista: { texto: string; nivel: number }[] = [];
  let codigo: string[] | null = null;

  const fecharLista = () => {
    if (lista.length === 0) return;
    saida.push(<Lista key={`l${saida.length}`} itens={lista} />);
    lista = [];
  };

  linhas.forEach((linha, i) => {
    if (linha.startsWith("```")) {
      if (codigo === null) {
        fecharLista();
        codigo = [];
      } else {
        saida.push(
          <pre
            key={`c${i}`}
            className="my-3 overflow-x-auto rounded-md bg-background p-3 font-mono text-xs"
          >
            {codigo.join("\n")}
          </pre>,
        );
        codigo = null;
      }
      return;
    }
    if (codigo !== null) {
      codigo.push(linha);
      return;
    }

    const item = /^(\s*)- (.*)$/.exec(linha);
    if (item) {
      lista.push({ texto: item[2], nivel: item[1].length >= 2 ? 1 : 0 });
      return;
    }
    fecharLista();

    if (linha.startsWith("# ")) {
      saida.push(
        <h2 key={i} className="text-lg font-semibold text-brand">
          {inline(linha.slice(2))}
        </h2>,
      );
    } else if (linha.startsWith("## ")) {
      saida.push(
        <h3 key={i} className="mt-6 text-base font-semibold text-brand">
          {inline(linha.slice(3))}
        </h3>,
      );
    } else if (linha.trim() === "---") {
      saida.push(<hr key={i} className="my-6 border-border" />);
    } else if (linha.trim() !== "") {
      saida.push(
        <p key={i} className="my-2 text-sm leading-relaxed">
          {inline(linha)}
        </p>,
      );
    }
  });
  fecharLista();
  return saida;
}

function Lista({ itens }: { itens: { texto: string; nivel: number }[] }) {
  return (
    <ul className="my-2 space-y-1 text-sm">
      {itens.map((it, i) => (
        <li
          key={i}
          className={`list-disc ${it.nivel === 1 ? "ml-10" : "ml-5"}`}
        >
          {inline(it.texto)}
        </li>
      ))}
    </ul>
  );
}

function inline(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((parte, i) => {
    if (parte.startsWith("**")) {
      return <strong key={i}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith("`")) {
      return (
        <code key={i} className="font-mono text-xs">
          {parte.slice(1, -1)}
        </code>
      );
    }
    return parte;
  });
}
