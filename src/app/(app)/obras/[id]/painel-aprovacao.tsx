"use client";

import { useActionState, useState } from "react";
import {
  botaoBase,
  botaoSecundario,
  classeCampo,
  classeRotulo,
} from "@/lib/ui";
import type { Decisao } from "@/lib/aprovacao";
import {
  registrarDecisaoAction,
  reenviarAction,
  type Resultado,
} from "./acoes";

// Registro da decisão da etapa atual. O comentário é obrigatório para
// reprovação e pedido de correção.
export function PainelDecisao({
  obraId,
  etapa,
  nivel,
}: {
  obraId: string;
  etapa: number;
  nivel: string;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    registrarDecisaoAction,
    null,
  );
  const [decisao, setDecisao] = useState<Decisao>("Aprovado");

  return (
    <form action={enviar} className="space-y-4">
      <input type="hidden" name="obraId" value={obraId} />
      <input type="hidden" name="etapa" value={etapa} />
      <input type="hidden" name="decisao" value={decisao} />

      <div>
        <label htmlFor="comentario" className={classeRotulo}>
          Comentário
          <span className="ml-1 font-normal text-muted">
            {decisao === "Aprovado" ? "(opcional)" : "(obrigatório)"}
          </span>
        </label>
        <textarea
          id="comentario"
          name="comentario"
          rows={3}
          className={`${classeCampo} mt-1`}
          placeholder={`Registro da decisão de ${nivel}.`}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Botao
          rotulo="Aprovar"
          ativo={decisao === "Aprovado"}
          pendente={pendente}
          aoEscolher={() => setDecisao("Aprovado")}
          cor="bg-emerald-600 text-white hover:bg-emerald-700"
        />
        <Botao
          rotulo="Solicitar correção"
          ativo={decisao === "Correção solicitada"}
          pendente={pendente}
          aoEscolher={() => setDecisao("Correção solicitada")}
          cor="bg-amber-500 text-white hover:bg-amber-600"
        />
        <Botao
          rotulo="Reprovar"
          ativo={decisao === "Reprovado"}
          pendente={pendente}
          aoEscolher={() => setDecisao("Reprovado")}
          cor="bg-red-600 text-white hover:bg-red-700"
        />
      </div>

      <Aviso resultado={resultado} pendente={pendente} />
    </form>
  );
}

// Cada botão escolhe a decisão e envia o formulário no mesmo clique.
function Botao({
  rotulo,
  ativo,
  pendente,
  aoEscolher,
  cor,
}: {
  rotulo: string;
  ativo: boolean;
  pendente: boolean;
  aoEscolher: () => void;
  cor: string;
}) {
  return (
    <button
      type="submit"
      disabled={pendente}
      onClick={aoEscolher}
      className={`${botaoBase} flex-1 ${cor} disabled:opacity-60`}
    >
      {pendente && ativo ? "Registrando…" : rotulo}
    </button>
  );
}

// Reenvio depois de uma correção solicitada.
export function PainelReenvio({ obraId }: { obraId: string }) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    reenviarAction,
    null,
  );

  return (
    <form action={enviar} className="space-y-4">
      <input type="hidden" name="obraId" value={obraId} />
      <div>
        <label htmlFor="comentario-reenvio" className={classeRotulo}>
          O que foi ajustado
          <span className="ml-1 font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="comentario-reenvio"
          name="comentario"
          rows={3}
          className={`${classeCampo} mt-1`}
          placeholder="Descreva o ajuste feito na solicitação."
        />
      </div>
      <button
        type="submit"
        disabled={pendente}
        className={`${botaoSecundario} w-full disabled:opacity-60 sm:w-auto`}
      >
        {pendente ? "Reenviando…" : "Reenviar para análise"}
      </button>
      <Aviso resultado={resultado} pendente={pendente} />
    </form>
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
      className={`rounded-md border px-4 py-3 text-sm ${
        resultado.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {resultado.mensagem}
    </p>
  );
}
