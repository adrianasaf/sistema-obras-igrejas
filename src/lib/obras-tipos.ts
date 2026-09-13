// Tipos e formatações das obras. Os dados vêm do banco (src/lib/obras-db.ts).

export const TIPOS_OBRA = [
  "Reforma",
  "Ampliação",
  "Construção",
  "Manutenção",
] as const;
export type TipoObra = (typeof TIPOS_OBRA)[number];

// A prioridade é definida pelo pastor responsável da CONBENS (DEC-013) e por
// isso pode estar vazia na solicitação.
export const PRIORIDADES = [
  "Emergencial",
  "Prioridade 1",
  "Prioridade 2",
  "Prioridade 3",
] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
