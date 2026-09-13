import type { Metadata } from "next";
import { exigirAcesso } from "@/lib/sessao";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { BadgeAlteracao } from "@/components/badges";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { CORES_ALTERACAO } from "@/lib/cores";
import { cartao, tituloSecao } from "@/lib/ui";
import {
  TIPOS_ALTERACAO,
  VERSOES,
  formatarDataVersao,
  type VersaoSistema,
} from "@/lib/historico-mock";

export const metadata: Metadata = { title: "Histórico de Desenvolvimento" };

const ARQUIVO = path.join(
  process.cwd(),
  "docs",
  "10-HISTORICO-DESENVOLVIMENTO.md",
);

export default async function HistoricoPage() {
  await exigirAcesso("historico");
  const markdown = await readFile(ARQUIVO, "utf8");
  const versoes = [...VERSOES].sort((a, b) => b.data.localeCompare(a.data));
  const atual = versoes[0];

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Histórico de Desenvolvimento"
        descricao="Linha do tempo das versões do sistema. Dados demonstrativos."
      />

      {/* Resumo e legenda dos tipos */}
      <div className={`${cartao} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className="text-xs text-muted">Versão mais recente</p>
          <p className="mt-1 font-mono text-2xl leading-none font-semibold text-brand">
            {atual.versao}
          </p>
          <p className="mt-1 text-xs text-muted">
            {formatarDataVersao(atual.data)} · {versoes.length} versões
            registradas
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {TIPOS_ALTERACAO.map((tipo) => (
            <li key={tipo}>
              <BadgeAlteracao valor={tipo} />
            </li>
          ))}
        </ul>
      </div>

      {/* Linha do tempo */}
      <ol className="space-y-0">
        {versoes.map((v, i) => (
          <ItemVersao
            key={v.versao}
            versao={v}
            ultimo={i === versoes.length - 1}
          />
        ))}
      </ol>

      {/* Documento real do projeto, preservado */}
      <details className={cartao}>
        <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-brand">
          Documento de histórico do projeto (docs/10-HISTORICO-DESENVOLVIMENTO.md)
        </summary>
        <article className="border-t border-border px-5 py-5 sm:px-6">
          {renderizarMarkdown(markdown)}
        </article>
      </details>

      <p className="text-xs text-muted">
        As versões acima são fictícias e servem para demonstrar a interface. O
        registro real do desenvolvimento é o documento do projeto.
      </p>
    </div>
  );
}

function ItemVersao({
  versao,
  ultimo,
}: {
  versao: VersaoSistema;
  ultimo: boolean;
}) {
  const cor = CORES_ALTERACAO[versao.tipo];

  return (
    <li className="relative flex gap-4 pb-5 last:pb-0">
      {!ultimo && (
        <span
          aria-hidden="true"
          className="absolute top-6 left-[9px] h-full w-0.5 bg-border"
        />
      )}
      <span
        aria-hidden="true"
        className={`relative mt-5 size-5 shrink-0 rounded-full border-2 border-surface ring-2 ring-border ${cor.ponto}`}
      />

      <div className={`${cartao} min-w-0 flex-1 overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-background px-2 py-0.5 font-mono text-xs font-semibold text-brand">
                {versao.versao}
              </span>
              <span className="text-xs text-muted">
                {formatarDataVersao(versao.data)}
              </span>
            </div>
            <h2 className={`mt-2 ${tituloSecao}`}>{versao.titulo}</h2>
          </div>
          <div className="sm:shrink-0">
            <BadgeAlteracao valor={versao.tipo} />
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm leading-relaxed">{versao.resumo}</p>
          <ul className="mt-3 space-y-1.5">
            {versao.itens.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <span aria-hidden="true" className={cor.texto}>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
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
