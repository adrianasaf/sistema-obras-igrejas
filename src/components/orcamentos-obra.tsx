"use client";

import { useActionState } from "react";
import { BadgeOrcamento } from "@/components/badges";
import {
  MAXIMO_POR_CATEGORIA,
  ROTULO_CATEGORIA,
  type CategoriaOrcamento,
  type Cotacao,
  type Croqui,
  type OrcamentoDaObra,
} from "@/lib/orcamentos-db";
import { formatarData, formatarValor } from "@/lib/obras-tipos";
import {
  botaoBase,
  botaoPrimario,
  cartao,
  classeCampo,
  classeRotulo,
  tituloSecao,
} from "@/lib/ui";
import {
  salvarCotacaoAction,
  salvarCroquiAction,
  selecionarCotacaoAction,
  type Resultado,
} from "@/app/(app)/obras/[id]/orcamentos-acoes";

// Aba Orçamentos com dados reais. O lançamento só aparece quando o fluxo está
// aprovado (DEC-013) e para quem tem escopo sobre a obra; a Server Action
// confere as duas coisas de novo, no servidor.
export function OrcamentosObra({
  obraId,
  orcamento,
  habilitado,
  podeEditar,
  aviso,
  valorAprovadoSgi,
}: {
  obraId: string;
  orcamento: OrcamentoDaObra;
  habilitado: boolean;
  podeEditar: boolean;
  aviso: string | null;
  valorAprovadoSgi: number | null;
}) {
  return (
    <div className="space-y-6">
      {aviso && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {aviso}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {(["material", "mao_de_obra"] as CategoriaOrcamento[]).map(
          (categoria) => (
            <section key={categoria} className={`${cartao} p-5`}>
              <h2 className={tituloSecao}>{ROTULO_CATEGORIA[categoria]}</h2>
              <p className="mt-1 text-xs text-muted">
                Até {MAXIMO_POR_CATEGORIA} cotações, uma selecionada.
              </p>

              <ul className="mt-4 space-y-3">
                {[1, 2, 3].map((numero) => (
                  <li key={numero}>
                    <Cartao
                      obraId={obraId}
                      categoria={categoria}
                      numero={numero}
                      cotacao={orcamento.cotacoes[categoria].find(
                        (c) => c.numero === numero,
                      )}
                      habilitado={habilitado && podeEditar}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ),
        )}
      </div>

      {/* Resumo dos valores */}
      <section className={`${cartao} p-5`}>
        <h2 className={tituloSecao}>Resumo dos valores</h2>
        <p className="mt-1 text-xs text-muted">
          Os totais usam as cotações selecionadas. O valor aprovado vem do
          registro do SGI.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Valor rotulo="Menor material" valor={orcamento.menorMaterial} />
          <Valor rotulo="Menor mão de obra" valor={orcamento.menorMaoDeObra} />
          <Valor
            rotulo="Total material"
            valor={orcamento.selecionadoMaterial}
            destaque
          />
          <Valor
            rotulo="Total mão de obra"
            valor={orcamento.selecionadoMaoDeObra}
            destaque
          />
          <Valor
            rotulo="Total estimado"
            valor={orcamento.totalEstimado}
            destaque
          />
        </dl>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Valor rotulo="Valor aprovado (SGI)" valor={valorAprovadoSgi} />
        </dl>
      </section>

      <CroquiForm
        obraId={obraId}
        croqui={orcamento.croqui}
        habilitado={habilitado && podeEditar}
      />
    </div>
  );
}

function Cartao({
  obraId,
  categoria,
  numero,
  cotacao,
  habilitado,
}: {
  obraId: string;
  categoria: CategoriaOrcamento;
  numero: number;
  cotacao?: Cotacao;
  habilitado: boolean;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    salvarCotacaoAction,
    null,
  );
  const escolhido = cotacao?.status === "Selecionado";

  return (
    <div
      className={`rounded-md border p-4 ${
        escolhido ? "border-emerald-300 bg-emerald-50/40" : "border-border bg-background"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Orçamento {numero}</p>
        <BadgeOrcamento valor={cotacao?.status ?? "Não recebido"} />
      </div>

      {!habilitado ? (
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <Campo
            rotulo={categoria === "material" ? "Fornecedor" : "Prestador"}
            valor={cotacao?.fornecedor ?? "—"}
          />
          <Campo
            rotulo="Valor"
            valor={cotacao?.valor != null ? formatarValor(cotacao.valor) : "—"}
          />
          <Campo
            rotulo="Data"
            valor={cotacao?.dataCotacao ? formatarData(cotacao.dataCotacao) : "—"}
          />
          <Campo
            rotulo="Validade"
            valor={cotacao?.validade ? formatarData(cotacao.validade) : "—"}
          />
          {cotacao?.observacoes && (
            <div className="col-span-2">
              <dt className="text-xs text-muted">Observações</dt>
              <dd className="text-sm">{cotacao.observacoes}</dd>
            </div>
          )}
        </dl>
      ) : (
        <>
          <form action={enviar} className="mt-3 space-y-3">
            <input type="hidden" name="obraId" value={obraId} />
            <input type="hidden" name="categoria" value={categoria} />
            <input type="hidden" name="numero" value={numero} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor={`forn-${categoria}-${numero}`}
                  className={classeRotulo}
                >
                  {categoria === "material" ? "Fornecedor" : "Prestador"}
                </label>
                <input
                  id={`forn-${categoria}-${numero}`}
                  name="fornecedor"
                  type="text"
                  maxLength={120}
                  defaultValue={cotacao?.fornecedor ?? ""}
                  className={`${classeCampo} mt-1`}
                />
              </div>
              <div>
                <label
                  htmlFor={`valor-${categoria}-${numero}`}
                  className={classeRotulo}
                >
                  Valor (R$)
                </label>
                <input
                  id={`valor-${categoria}-${numero}`}
                  name="valor"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  defaultValue={cotacao?.valor != null ? String(cotacao.valor) : ""}
                  className={`${classeCampo} mt-1`}
                />
              </div>
              <div>
                <label
                  htmlFor={`data-${categoria}-${numero}`}
                  className={classeRotulo}
                >
                  Data da cotação
                </label>
                <input
                  id={`data-${categoria}-${numero}`}
                  name="dataCotacao"
                  type="date"
                  defaultValue={cotacao?.dataCotacao ?? ""}
                  className={`${classeCampo} mt-1`}
                />
              </div>
              <div>
                <label
                  htmlFor={`val-${categoria}-${numero}`}
                  className={classeRotulo}
                >
                  Validade
                </label>
                <input
                  id={`val-${categoria}-${numero}`}
                  name="validade"
                  type="date"
                  defaultValue={cotacao?.validade ?? ""}
                  className={`${classeCampo} mt-1`}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor={`obs-${categoria}-${numero}`}
                  className={classeRotulo}
                >
                  Observações
                </label>
                <textarea
                  id={`obs-${categoria}-${numero}`}
                  name="observacoes"
                  rows={2}
                  defaultValue={cotacao?.observacoes ?? ""}
                  className={`${classeCampo} mt-1`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pendente}
              className={`${botaoBase} w-full border border-border hover:bg-surface disabled:opacity-60`}
            >
              {pendente ? "Salvando…" : "Salvar cotação"}
            </button>
          </form>

          <Selecionar
            obraId={obraId}
            categoria={categoria}
            numero={numero}
            escolhido={escolhido}
            temValor={cotacao?.valor != null}
          />

          <Aviso resultado={resultado} pendente={pendente} />
        </>
      )}
    </div>
  );
}

function Selecionar({
  obraId,
  categoria,
  numero,
  escolhido,
  temValor,
}: {
  obraId: string;
  categoria: CategoriaOrcamento;
  numero: number;
  escolhido: boolean;
  temValor: boolean;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    selecionarCotacaoAction,
    null,
  );

  return (
    <form action={enviar} className="mt-2">
      <input type="hidden" name="obraId" value={obraId} />
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="numero" value={numero} />
      <button
        type="submit"
        disabled={pendente || escolhido || !temValor}
        className={`${botaoBase} w-full ${
          escolhido
            ? "bg-emerald-600 text-white"
            : "border border-brand text-brand hover:bg-brand hover:text-white"
        } disabled:opacity-60`}
      >
        {escolhido
          ? "✓ Selecionado"
          : pendente
            ? "Selecionando…"
            : temValor
              ? "Selecionar orçamento"
              : "Informe o valor para selecionar"}
      </button>
      <Aviso resultado={resultado} pendente={pendente} />
    </form>
  );
}

function CroquiForm({
  obraId,
  croqui,
  habilitado,
}: {
  obraId: string;
  croqui: Croqui | null;
  habilitado: boolean;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    salvarCroquiAction,
    null,
  );

  return (
    <section className={`${cartao} p-5`}>
      <h2 className={tituloSecao}>Croqui da obra</h2>
      <p className="mt-1 text-xs text-muted">
        O envio de arquivo será implementado em etapa futura: por ora, descrição
        e link.
      </p>

      {!habilitado ? (
        <dl className="mt-4 space-y-3">
          <Campo rotulo="Descrição" valor={croqui?.descricao ?? "—"} />
          <Campo rotulo="Link" valor={croqui?.arquivoUrl ?? "—"} />
          <Campo rotulo="Enviado por" valor={croqui?.enviadoPor ?? "—"} />
        </dl>
      ) : (
        <form action={enviar} className="mt-4 space-y-3">
          <input type="hidden" name="obraId" value={obraId} />
          <div>
            <label htmlFor="croqui-descricao" className={classeRotulo}>
              Descrição
            </label>
            <textarea
              id="croqui-descricao"
              name="descricao"
              rows={3}
              defaultValue={croqui?.descricao ?? ""}
              placeholder="O que o croqui mostra."
              className={`${classeCampo} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="croqui-link" className={classeRotulo}>
              Link do arquivo
            </label>
            <input
              id="croqui-link"
              name="arquivoUrl"
              type="url"
              defaultValue={croqui?.arquivoUrl ?? ""}
              placeholder="https://…"
              className={`${classeCampo} mt-1`}
            />
          </div>
          <button
            type="submit"
            disabled={pendente}
            className={`${botaoPrimario} disabled:opacity-60`}
          >
            {pendente ? "Salvando…" : "Salvar croqui"}
          </button>
          <Aviso resultado={resultado} pendente={pendente} />
        </form>
      )}
    </section>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd className="truncate text-sm">{valor}</dd>
    </div>
  );
}

function Valor({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string;
  valor: number | null;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd
        className={`mt-1 text-lg font-semibold tabular-nums ${
          destaque ? "text-brand" : ""
        }`}
      >
        {valor != null ? formatarValor(valor) : "—"}
      </dd>
    </div>
  );
}

function Aviso({
  resultado,
  pendente,
}: {
  resultado: Resultado | null;
  pendente: boolean;
}) {
  if (!resultado || pendente) return null;
  return (
    <p
      role="status"
      className={`mt-2 rounded-md border px-3 py-2 text-xs ${
        resultado.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {resultado.mensagem}
    </p>
  );
}
