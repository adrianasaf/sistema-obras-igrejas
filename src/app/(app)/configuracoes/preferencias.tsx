"use client";

import { useState } from "react";
import { cartao, classeCampo, classeRotulo, tituloSecao } from "@/lib/ui";

// Preferências de interface apenas visuais: as escolhas valem para esta tela e
// não são salvas em nenhum lugar.
export function Preferencias() {
  const [tocou, setTocou] = useState(false);

  return (
    <section className={`${cartao} p-5 sm:p-6`}>
      <h2 className={tituloSecao}>Preferências de interface</h2>
      <p className="mt-1 text-xs text-muted">
        Controles visuais: as escolhas ainda não são salvas.
      </p>

      <div
        className="mt-4 grid gap-5 sm:grid-cols-2"
        onChange={() => setTocou(true)}
      >
        <div>
          <label htmlFor="densidade" className={classeRotulo}>
            Densidade das listas
          </label>
          <select
            id="densidade"
            name="densidade"
            defaultValue="Padrão"
            className={`${classeCampo} mt-1`}
          >
            <option>Compacta</option>
            <option>Padrão</option>
            <option>Confortável</option>
          </select>
        </div>

        <div>
          <label htmlFor="itens" className={classeRotulo}>
            Itens por página nas listas
          </label>
          <select
            id="itens"
            name="itens"
            defaultValue="25"
            className={`${classeCampo} mt-1`}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>

        <div>
          <label htmlFor="tela-inicial" className={classeRotulo}>
            Tela inicial após entrar
          </label>
          <select
            id="tela-inicial"
            name="tela-inicial"
            defaultValue="Dashboard"
            className={`${classeCampo} mt-1`}
          >
            <option>Dashboard</option>
            <option>Obras</option>
          </select>
        </div>

        <div>
          <label htmlFor="ordem" className={classeRotulo}>
            Ordenação padrão das obras
          </label>
          <select
            id="ordem"
            name="ordem"
            defaultValue="Mais recentes primeiro"
            className={`${classeCampo} mt-1`}
          >
            <option>Mais recentes primeiro</option>
            <option>Prioridade mais alta primeiro</option>
          </select>
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Opcao
            id="avisos"
            rotulo="Mostrar avisos de dados demonstrativos"
            descricao="Exibe, no fim de cada tela, o aviso de que os dados são fictícios."
            padrao
          />
          <Opcao
            id="resumo"
            rotulo="Abrir o resumo de valores já expandido"
            descricao="Na aba Orçamentos, mostra o resumo antes dos orçamentos."
          />
        </div>
      </div>

      {tocou && (
        <p
          role="status"
          className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          As preferências ainda não são salvas: esta tela é apenas visual nesta
          etapa.
        </p>
      )}
    </section>
  );
}

function Opcao({
  id,
  rotulo,
  descricao,
  padrao,
}: {
  id: string;
  rotulo: string;
  descricao: string;
  padrao?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
      <input
        id={id}
        name={id}
        type="checkbox"
        defaultChecked={padrao}
        className="mt-0.5 size-4 accent-[var(--brand)]"
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {rotulo}
        </label>
        <p className="mt-0.5 text-xs text-muted">{descricao}</p>
      </div>
    </div>
  );
}
