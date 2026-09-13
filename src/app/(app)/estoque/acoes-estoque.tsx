"use client";

import { useActionState, useState } from "react";
import type { Material } from "@/lib/estoque-db";
import {
  botaoBase,
  botaoPrimario,
  botaoSecundario,
  cartao,
  classeCampo,
  classeRotulo,
  tituloSecao,
} from "@/lib/ui";
import {
  registrarEntradaAction,
  salvarMaterialAction,
  type Resultado,
} from "./acoes";

type Painel = "material" | "entrada" | null;

// Botões de ação do estoque. "Saída" fica desabilitada: depende da definição
// das cinco fases de execução (PEN-009).
export function AcoesEstoque({
  materiais,
  igrejas,
}: {
  materiais: Material[];
  igrejas: { id: string; nome: string }[];
}) {
  const [painel, setPainel] = useState<Painel>(null);
  const [avisoSaida, setAvisoSaida] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setPainel(painel === "entrada" ? null : "entrada");
            setAvisoSaida(false);
          }}
          className={`${botaoBase} border border-emerald-300 text-emerald-700 hover:bg-emerald-50`}
        >
          + Entrada
        </button>
        <button
          type="button"
          disabled
          onClick={() => setAvisoSaida(true)}
          title="Depende da definição das fases de execução"
          className={`${botaoBase} cursor-not-allowed border border-border text-muted`}
        >
          − Saída
        </button>
        <button
          type="button"
          onClick={() => {
            setPainel(painel === "material" ? null : "material");
            setAvisoSaida(false);
          }}
          className={botaoPrimario}
        >
          Novo material
        </button>
      </div>

      <p className="text-xs text-muted">
        A saída de estoque será liberada quando as cinco fases da execução
        forem definidas.
      </p>

      {avisoSaida && (
        <p
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          A saída depende das fases da execução, ainda não definidas.
        </p>
      )}

      {painel === "material" && (
        <FormularioMaterial
          igrejas={igrejas}
          aoFechar={() => setPainel(null)}
        />
      )}
      {painel === "entrada" && (
        <FormularioEntrada
          materiais={materiais}
          aoFechar={() => setPainel(null)}
        />
      )}
    </div>
  );
}

function FormularioMaterial({
  igrejas,
  aoFechar,
}: {
  igrejas: { id: string; nome: string }[];
  aoFechar: () => void;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    salvarMaterialAction,
    null,
  );

  return (
    <form action={enviar} className={`${cartao} space-y-4 p-5 text-left`}>
      <h2 className={tituloSecao}>Novo material</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="mat-nome" className={classeRotulo}>
            Nome
          </label>
          <input
            id="mat-nome"
            name="nome"
            type="text"
            required
            maxLength={120}
            placeholder="Ex.: Cimento CP-II 50 kg"
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="mat-categoria" className={classeRotulo}>
            Categoria
          </label>
          <input
            id="mat-categoria"
            name="categoria"
            type="text"
            required
            maxLength={60}
            placeholder="Ex.: Alvenaria"
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="mat-unidade" className={classeRotulo}>
            Unidade
          </label>
          <input
            id="mat-unidade"
            name="unidade"
            type="text"
            required
            maxLength={20}
            placeholder="saco, m², un…"
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="mat-minimo" className={classeRotulo}>
            Estoque mínimo
          </label>
          <input
            id="mat-minimo"
            name="minimo"
            type="text"
            inputMode="decimal"
            defaultValue="0"
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="mat-igreja" className={classeRotulo}>
            Igreja
          </label>
          <select
            id="mat-igreja"
            name="igrejaId"
            defaultValue=""
            className={`${classeCampo} mt-1`}
          >
            <option value="">Estoque geral</option>
            {igrejas.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Botoes pendente={pendente} aoFechar={aoFechar} rotulo="Salvar material" />
      <Aviso resultado={resultado} pendente={pendente} />
    </form>
  );
}

function FormularioEntrada({
  materiais,
  aoFechar,
}: {
  materiais: Material[];
  aoFechar: () => void;
}) {
  const [resultado, enviar, pendente] = useActionState<Resultado | null, FormData>(
    registrarEntradaAction,
    null,
  );

  return (
    <form action={enviar} className={`${cartao} space-y-4 p-5 text-left`}>
      <h2 className={tituloSecao}>Entrada de material</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="ent-material" className={classeRotulo}>
            Material
          </label>
          <select
            id="ent-material"
            name="materialId"
            required
            defaultValue=""
            className={`${classeCampo} mt-1`}
          >
            <option value="" disabled>
              Selecione o material
            </option>
            {materiais.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} · {m.igrejaNome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ent-qtd" className={classeRotulo}>
            Quantidade
          </label>
          <input
            id="ent-qtd"
            name="quantidade"
            type="text"
            inputMode="decimal"
            required
            placeholder="0"
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="ent-valor" className={classeRotulo}>
            Valor unitário (R$)
            <span className="ml-1 font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="ent-valor"
            name="valorUnitario"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="ent-fornecedor" className={classeRotulo}>
            Fornecedor
            <span className="ml-1 font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="ent-fornecedor"
            name="fornecedor"
            type="text"
            maxLength={120}
            className={`${classeCampo} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="ent-data" className={classeRotulo}>
            Data
          </label>
          <input
            id="ent-data"
            name="data"
            type="date"
            className={`${classeCampo} mt-1`}
          />
        </div>
      </div>

      <Botoes pendente={pendente} aoFechar={aoFechar} rotulo="Registrar entrada" />
      <Aviso resultado={resultado} pendente={pendente} />
    </form>
  );
}

function Botoes({
  pendente,
  aoFechar,
  rotulo,
}: {
  pendente: boolean;
  aoFechar: () => void;
  rotulo: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
      <button type="button" onClick={aoFechar} className={botaoSecundario}>
        Fechar
      </button>
      <button
        type="submit"
        disabled={pendente}
        className={`${botaoPrimario} disabled:opacity-60`}
      >
        {pendente ? "Salvando…" : rotulo}
      </button>
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
