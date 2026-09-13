"use client";

import { useActionState, useState } from "react";
import { BadgeAprovacao } from "@/components/badges";
import { SITUACOES_SGI, type ResultadoSgi, type SituacaoSgi } from "@/lib/aprovacao";
import { formatarData, formatarValor } from "@/lib/obras-tipos";
import { botaoPrimario, classeCampo, classeRotulo } from "@/lib/ui";
import { registrarSgiAction, type Resultado } from "@/app/(app)/obras/[id]/sgi-acoes";

const COR: Record<SituacaoSgi, "Aguardando" | "Aprovado" | "Reprovado"> = {
  "Aguardando SGI": "Aguardando",
  "Aprovado no SGI": "Aprovado",
  "Reprovado no SGI": "Reprovado",
};

// Resultado do SGI (sistema externo). Todos veem; só CONBENS e Administrador
// registram ou corrigem (DEC-013). A Server Action confere de novo.
export function PainelSgi({
  obraId,
  sgi,
  podeRegistrar,
}: {
  obraId: string;
  sgi: ResultadoSgi;
  podeRegistrar: boolean;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    registrarSgiAction,
    null,
  );
  const [situacao, setSituacao] = useState<SituacaoSgi>(sgi.situacao);
  const [editando, setEditando] = useState(sgi.situacao === "Aguardando SGI");

  const registrado = sgi.situacao !== "Aguardando SGI";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <BadgeAprovacao valor={COR[sgi.situacao]} rotulo={sgi.situacao} />
        {sgi.registradoEm && (
          <p className="text-xs text-muted">
            Registrado por {sgi.registradoPor ?? "—"} em{" "}
            {new Date(sgi.registradoEm).toLocaleString("pt-BR", {
              timeZone: "America/Fortaleza",
            })}
          </p>
        )}
      </div>

      {registrado && (
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-background p-4">
            <dt className="text-xs text-muted">Valor aprovado</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-brand">
              {sgi.valorAprovado != null ? formatarValor(sgi.valorAprovado) : "—"}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <dt className="text-xs text-muted">Data do resultado</dt>
            <dd className="mt-1 text-sm font-medium">
              {sgi.data ? formatarData(sgi.data) : "—"}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <dt className="text-xs text-muted">Situação</dt>
            <dd className="mt-1 text-sm font-medium">{sgi.situacao}</dd>
          </div>
        </dl>
      )}

      {sgi.situacao === "Reprovado no SGI" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Reprovada no SGI: o acompanhamento desta solicitação se encerra aqui.
          Uma eventual reabertura ainda não está definida.
        </p>
      )}

      {!podeRegistrar ? (
        !registrado && (
          <p className="text-sm text-muted">
            Aguardando o registro do resultado pela CONBENS.
          </p>
        )
      ) : editando ? (
        <form action={enviar} className="space-y-4">
          <input type="hidden" name="obraId" value={obraId} />

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="sgi-situacao" className={classeRotulo}>
                Situação no SGI
              </label>
              <select
                id="sgi-situacao"
                name="situacao"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value as SituacaoSgi)}
                className={`${classeCampo} mt-1`}
              >
                {SITUACOES_SGI.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sgi-valor" className={classeRotulo}>
                Valor aprovado (R$)
                <span className="ml-1 font-normal text-muted">
                  {situacao === "Aprovado no SGI" ? "(obrigatório)" : "(não se aplica)"}
                </span>
              </label>
              <input
                id="sgi-valor"
                name="valorAprovado"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                disabled={situacao !== "Aprovado no SGI"}
                defaultValue={sgi.valorAprovado != null ? String(sgi.valorAprovado) : ""}
                className={`${classeCampo} mt-1 disabled:opacity-60`}
              />
            </div>

            <div>
              <label htmlFor="sgi-data" className={classeRotulo}>
                Data do resultado
              </label>
              <input
                id="sgi-data"
                name="data"
                type="date"
                defaultValue={sgi.data ?? ""}
                className={`${classeCampo} mt-1`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={pendente}
              className={`${botaoPrimario} disabled:opacity-60`}
            >
              {pendente ? "Registrando…" : "Registrar resultado"}
            </button>
            {registrado && (
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
              >
                Cancelar
              </button>
            )}
          </div>

          {resultado && !pendente && (
            <p
              role="status"
              className={`rounded-md border px-4 py-3 text-sm ${
                resultado.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {resultado.mensagem}
            </p>
          )}
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="inline-flex items-center justify-center rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-background"
        >
          Corrigir resultado
        </button>
      )}
    </div>
  );
}
