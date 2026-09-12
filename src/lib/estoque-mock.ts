// Dados DEMONSTRATIVOS do estoque (Fase 6 do roadmap). Apenas interface:
// não há movimentação, cálculo nem gravação. As regras de estoque (central
// ou por igreja/polo, quem lança entradas e saídas) estão PENDENTES DE
// DEFINIÇÃO (PEN-014).

export const CATEGORIAS_MATERIAL = [
  "Alvenaria",
  "Acabamento",
  "Elétrica",
  "Hidráulica",
  "Cobertura",
  "Ferramentas",
] as const;
export type CategoriaMaterial = (typeof CATEGORIAS_MATERIAL)[number];

export type StatusMaterial = "Normal" | "Abaixo do mínimo" | "Em falta";

export type Material = {
  id: string;
  nome: string;
  categoria: CategoriaMaterial;
  unidade: string;
  quantidade: number;
  minimo: number;
};

export const MATERIAIS: Material[] = [
  { id: "m01", nome: "Cimento CP-II 50 kg", categoria: "Alvenaria", unidade: "saco", quantidade: 84, minimo: 40 },
  { id: "m02", nome: "Areia média", categoria: "Alvenaria", unidade: "m³", quantidade: 6, minimo: 8 },
  { id: "m03", nome: "Bloco cerâmico 9x19x39", categoria: "Alvenaria", unidade: "un", quantidade: 1240, minimo: 500 },
  { id: "m04", nome: "Tinta acrílica branca 18 L", categoria: "Acabamento", unidade: "lata", quantidade: 12, minimo: 6 },
  { id: "m05", nome: "Massa corrida 25 kg", categoria: "Acabamento", unidade: "saco", quantidade: 0, minimo: 10 },
  { id: "m06", nome: "Porcelanato 60x60", categoria: "Acabamento", unidade: "m²", quantidade: 96, minimo: 50 },
  { id: "m07", nome: "Cabo flexível 2,5 mm²", categoria: "Elétrica", unidade: "m", quantidade: 320, minimo: 200 },
  { id: "m08", nome: "Disjuntor bipolar 40 A", categoria: "Elétrica", unidade: "un", quantidade: 4, minimo: 6 },
  { id: "m09", nome: "Luminária LED 40 W", categoria: "Elétrica", unidade: "un", quantidade: 28, minimo: 10 },
  { id: "m10", nome: "Tubo PVC 100 mm", categoria: "Hidráulica", unidade: "barra", quantidade: 18, minimo: 12 },
  { id: "m11", nome: "Registro de gaveta 3/4", categoria: "Hidráulica", unidade: "un", quantidade: 0, minimo: 4 },
  { id: "m12", nome: "Telha cerâmica portuguesa", categoria: "Cobertura", unidade: "un", quantidade: 640, minimo: 300 },
  { id: "m13", nome: "Calha galvanizada", categoria: "Cobertura", unidade: "m", quantidade: 9, minimo: 15 },
  { id: "m14", nome: "Furadeira de impacto", categoria: "Ferramentas", unidade: "un", quantidade: 3, minimo: 2 },
  { id: "m15", nome: "Andaime metálico (módulo)", categoria: "Ferramentas", unidade: "un", quantidade: 6, minimo: 4 },
];

export function statusMaterial(m: Material): StatusMaterial {
  if (m.quantidade === 0) return "Em falta";
  if (m.quantidade < m.minimo) return "Abaixo do mínimo";
  return "Normal";
}

export function formatarQuantidade(valor: number): string {
  return valor.toLocaleString("pt-BR");
}
