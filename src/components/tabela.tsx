import type { ReactNode } from "react";
import { cartao } from "@/lib/ui";

export type Coluna = string | { rotulo: string; direita?: boolean };

// Tabela padrão das listas: visível de tablet para cima, com rolagem
// horizontal quando necessário. Em celular as listas usam CartaoLista.
export function Tabela({
  colunas,
  acoes,
  children,
}: {
  colunas: Coluna[];
  acoes?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`${cartao} hidden overflow-x-auto md:block`}>
      <table className="w-full text-sm">
        <thead className="bg-background text-left text-xs tracking-wide text-muted uppercase">
          <tr>
            {colunas.map((coluna, i) => {
              const rotulo =
                typeof coluna === "string" ? coluna : coluna.rotulo;
              const direita = typeof coluna === "string" ? false : coluna.direita;
              return (
                <th
                  key={i}
                  className={`px-4 py-3 font-medium ${direita ? "text-right" : ""}`}
                >
                  {rotulo}
                </th>
              );
            })}
            {acoes && (
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Ações</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

// Cartão equivalente a uma linha da tabela, usado em celular.
export function CartaoLista({
  titulo,
  subtitulo,
  cracha,
  dados,
  acoes,
}: {
  titulo: string;
  subtitulo?: string;
  cracha?: ReactNode;
  dados: { rotulo: string; valor: string }[];
  acoes?: ReactNode;
}) {
  return (
    <li className={`${cartao} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-brand">{titulo}</p>
          {subtitulo && (
            <p className="truncate text-xs text-muted">{subtitulo}</p>
          )}
        </div>
        {cracha && (
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            {cracha}
          </div>
        )}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
        {dados.map((d) => (
          <div key={d.rotulo} className="min-w-0">
            <dt className="text-muted">{d.rotulo}</dt>
            <dd className="font-medium break-words">{d.valor}</dd>
          </div>
        ))}
      </dl>
      {acoes && <div className="mt-4">{acoes}</div>}
    </li>
  );
}

export function ListaVazia({ children }: { children: ReactNode }) {
  return (
    <p className={`${cartao} px-5 py-8 text-center text-sm text-muted`}>
      {children}
    </p>
  );
}
