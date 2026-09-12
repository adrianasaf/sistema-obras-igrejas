"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRIORIDADES, TIPOS_OBRA } from "@/lib/obras-mock";

// Lista demonstrativa. O cadastro real de igrejas virá com a estrutura
// Região → Área → Polo → Igreja (Fase 1 do roadmap).
const IGREJAS_EXEMPLO = [
  "Igreja Exemplo Centro",
  "Igreja Exemplo Bairro Norte",
  "Igreja Exemplo Litoral",
  "Igreja Exemplo Sertão",
  "Igreja Exemplo Vale",
];

const campo =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const rotulo = "block text-sm font-medium";

type Preview = { nome: string; url: string };

export function FormularioSolicitacao() {
  const [fotos, setFotos] = useState<Preview[]>([]);
  const [enviado, setEnviado] = useState(false);

  // Libera as URLs temporárias das prévias ao trocar/desmontar.
  useEffect(() => {
    return () => fotos.forEach((f) => URL.revokeObjectURL(f.url));
  }, [fotos]);

  function aoEscolherFotos(lista: FileList | null) {
    if (!lista) return;
    const novas = Array.from(lista)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ nome: f.name, url: URL.createObjectURL(f) }));
    setFotos((atual) => [...atual, ...novas]);
  }

  function removerFoto(url: string) {
    setFotos((atual) => atual.filter((f) => f.url !== url));
  }

  return (
    <form
      className="space-y-6 rounded-lg border border-border bg-surface p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="igreja" className={rotulo}>
            Igreja solicitante
          </label>
          <select id="igreja" name="igreja" required className={`${campo} mt-1`} defaultValue="">
            <option value="" disabled>
              Selecione a igreja
            </option>
            {IGREJAS_EXEMPLO.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tipo" className={rotulo}>
            Tipo da obra
          </label>
          <select id="tipo" name="tipo" required className={`${campo} mt-1`} defaultValue="">
            <option value="" disabled>
              Selecione o tipo
            </option>
            {TIPOS_OBRA.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prioridade" className={rotulo}>
            Prioridade
          </label>
          <select id="prioridade" name="prioridade" required className={`${campo} mt-1`} defaultValue="">
            <option value="" disabled>
              Selecione a prioridade
            </option>
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="titulo" className={rotulo}>
            Título da necessidade
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            maxLength={120}
            placeholder="Ex.: Infiltração no telhado do templo"
            className={`${campo} mt-1`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="descricao" className={rotulo}>
            Descrição detalhada da necessidade
          </label>
          <textarea
            id="descricao"
            name="descricao"
            required
            rows={6}
            placeholder="Descreva a situação atual, o que precisa ser feito e qualquer informação relevante."
            className={`${campo} mt-1`}
          />
        </div>

        <div className="sm:col-span-2">
          <span className={rotulo}>Fotos da situação atual</span>
          <label
            htmlFor="fotos"
            className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted hover:border-brand"
          >
            <span className="font-medium text-brand">Selecionar fotos</span>
            <span className="mt-1 text-xs">
              Imagens JPG ou PNG. As fotos ficam apenas nesta tela por enquanto.
            </span>
            <input
              id="fotos"
              name="fotos"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                aoEscolherFotos(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {fotos.length > 0 && (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {fotos.map((f) => (
                <li key={f.url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element -- prévia local (blob), não otimizável */}
                  <img
                    src={f.url}
                    alt={f.nome}
                    className="aspect-square w-full rounded-md border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(f.url)}
                    aria-label={`Remover ${f.nome}`}
                    className="absolute top-1 right-1 rounded bg-black/60 px-1.5 text-xs text-white"
                  >
                    ✕
                  </button>
                  <p className="mt-1 truncate text-xs text-muted">{f.nome}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {enviado && (
        <p
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          O envio de solicitações ainda não está habilitado: o banco de dados
          será configurado em uma etapa futura. Nenhum dado foi salvo.
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/obras"
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
        >
          Enviar solicitação
        </button>
      </div>
    </form>
  );
}
