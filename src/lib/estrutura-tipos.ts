// Tipos da estrutura administrativa. Os dados vêm do banco
// (src/lib/estrutura-db.ts); as contagens e os nomes dos níveis superiores
// já vêm resolvidos nas consultas.

export type StatusCadastro = "Ativo" | "Inativo";

export type Regiao = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
  totalAreas: number;
};

export type Area = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
  regiaoId: string;
  regiaoNome: string;
  totalPolos: number;
};

export type Polo = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
  areaId: string;
  areaNome: string;
  regiaoId: string;
  regiaoNome: string;
  totalIgrejas: number;
};

export type Igreja = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  cidade: string;
  poloId: string;
  poloNome: string;
  areaId: string;
  areaNome: string;
  regiaoId: string;
  regiaoNome: string;
};

// "Ativo" → "Ativa" para os cadastros de nome feminino (região, área, igreja).
export function statusFeminino(status: StatusCadastro): string {
  return status === "Ativo" ? "Ativa" : "Inativa";
}
