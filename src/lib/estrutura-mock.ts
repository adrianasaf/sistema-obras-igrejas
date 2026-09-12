// Dados DEMONSTRATIVOS da estrutura administrativa (Região → Área → Polo →
// Igreja). Apenas interface: nada é gravado e nenhuma regra institucional é
// aplicada. Nomes, códigos e cidades são fictícios.
//
// PENDENTE DE DEFINIÇÃO: campos oficiais de cada cadastro, quem pode cadastrar
// e o significado dos códigos (PEN-002, PEN-011).

export type StatusCadastro = "Ativo" | "Inativo";

export type Regiao = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
};

export type Area = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
  regiaoId: string;
};

export type Polo = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
  areaId: string;
};

export type Igreja = {
  id: string;
  codigo: string;
  nome: string;
  status: StatusCadastro;
  cidade: string;
  poloId: string;
};

export const REGIOES: Regiao[] = [
  { id: "r1", codigo: "R01", nome: "Região Litoral", status: "Ativo", responsavel: "Irmão Exemplo Alves" },
  { id: "r2", codigo: "R02", nome: "Região Agreste", status: "Ativo", responsavel: "Irmão Exemplo Barros" },
  { id: "r3", codigo: "R03", nome: "Região Sertão", status: "Ativo", responsavel: "Irmão Exemplo Cunha" },
  { id: "r4", codigo: "R04", nome: "Região Brejo", status: "Inativo", responsavel: "A definir" },
];

export const AREAS: Area[] = [
  { id: "a1", codigo: "A01", nome: "Área João Pessoa", status: "Ativo", responsavel: "Irmão Exemplo Lima", regiaoId: "r1" },
  { id: "a2", codigo: "A02", nome: "Área Costa Norte", status: "Ativo", responsavel: "Irmão Exemplo Freire", regiaoId: "r1" },
  { id: "a3", codigo: "A03", nome: "Área Campina Grande", status: "Ativo", responsavel: "Irmão Exemplo Dantas", regiaoId: "r2" },
  { id: "a4", codigo: "A04", nome: "Área Serra do Agreste", status: "Ativo", responsavel: "Irmão Exemplo Melo", regiaoId: "r2" },
  { id: "a5", codigo: "A05", nome: "Área Patos", status: "Ativo", responsavel: "Irmão Exemplo Rocha", regiaoId: "r3" },
  { id: "a6", codigo: "A06", nome: "Área Alto Sertão", status: "Ativo", responsavel: "Irmão Exemplo Vieira", regiaoId: "r3" },
  { id: "a7", codigo: "A07", nome: "Área Brejo Norte", status: "Inativo", responsavel: "A definir", regiaoId: "r4" },
];

export const POLOS: Polo[] = [
  { id: "p1", codigo: "P01", nome: "Polo Centro", status: "Ativo", responsavel: "Irmão Exemplo Souza", areaId: "a1" },
  { id: "p2", codigo: "P02", nome: "Polo Zona Sul", status: "Ativo", responsavel: "Irmão Exemplo Farias", areaId: "a1" },
  { id: "p3", codigo: "P03", nome: "Polo Litoral Norte", status: "Ativo", responsavel: "Irmão Exemplo Ramos", areaId: "a2" },
  { id: "p4", codigo: "P04", nome: "Polo Praia", status: "Ativo", responsavel: "Irmão Exemplo Duarte", areaId: "a2" },
  { id: "p5", codigo: "P05", nome: "Polo Campina Centro", status: "Ativo", responsavel: "Irmão Exemplo Pereira", areaId: "a3" },
  { id: "p6", codigo: "P06", nome: "Polo Bairro Novo", status: "Ativo", responsavel: "Irmão Exemplo Bezerra", areaId: "a3" },
  { id: "p7", codigo: "P07", nome: "Polo Serra Verde", status: "Ativo", responsavel: "Irmão Exemplo Macedo", areaId: "a4" },
  { id: "p8", codigo: "P08", nome: "Polo Vale", status: "Ativo", responsavel: "Irmão Exemplo Correia", areaId: "a4" },
  { id: "p9", codigo: "P09", nome: "Polo Patos Centro", status: "Ativo", responsavel: "Irmão Exemplo Gomes", areaId: "a5" },
  { id: "p10", codigo: "P10", nome: "Polo Espinharas", status: "Ativo", responsavel: "Irmão Exemplo Batista", areaId: "a5" },
  { id: "p11", codigo: "P11", nome: "Polo Sousa", status: "Ativo", responsavel: "Irmão Exemplo Leite", areaId: "a6" },
  { id: "p12", codigo: "P12", nome: "Polo Cajazeiras", status: "Inativo", responsavel: "A definir", areaId: "a6" },
];

export const IGREJAS: Igreja[] = [
  { id: "i01", codigo: "IG001", nome: "Igreja Exemplo Centro", status: "Ativo", cidade: "João Pessoa", poloId: "p1" },
  { id: "i02", codigo: "IG002", nome: "Igreja Exemplo Bairro Norte", status: "Ativo", cidade: "João Pessoa", poloId: "p1" },
  { id: "i03", codigo: "IG003", nome: "Igreja Exemplo Jardim Sul", status: "Ativo", cidade: "João Pessoa", poloId: "p2" },
  { id: "i04", codigo: "IG004", nome: "Igreja Exemplo Vila Nova", status: "Ativo", cidade: "Santa Rita", poloId: "p2" },
  { id: "i05", codigo: "IG005", nome: "Igreja Exemplo Litoral", status: "Ativo", cidade: "Cabedelo", poloId: "p3" },
  { id: "i06", codigo: "IG006", nome: "Igreja Exemplo Riacho Doce", status: "Ativo", cidade: "Bayeux", poloId: "p3" },
  { id: "i07", codigo: "IG007", nome: "Igreja Exemplo Praia Bela", status: "Inativo", cidade: "Pitimbu", poloId: "p4" },
  { id: "i08", codigo: "IG008", nome: "Igreja Exemplo Bela Vista", status: "Ativo", cidade: "Campina Grande", poloId: "p5" },
  { id: "i09", codigo: "IG009", nome: "Igreja Exemplo Morada Nova", status: "Ativo", cidade: "Campina Grande", poloId: "p6" },
  { id: "i10", codigo: "IG010", nome: "Igreja Exemplo Alto da Serra", status: "Ativo", cidade: "Esperança", poloId: "p7" },
  { id: "i11", codigo: "IG011", nome: "Igreja Exemplo Serra Branca", status: "Ativo", cidade: "Serra Branca", poloId: "p7" },
  { id: "i12", codigo: "IG012", nome: "Igreja Exemplo Vale", status: "Ativo", cidade: "Monteiro", poloId: "p8" },
  { id: "i13", codigo: "IG013", nome: "Igreja Exemplo Campo Verde", status: "Ativo", cidade: "Sumé", poloId: "p8" },
  { id: "i14", codigo: "IG014", nome: "Igreja Exemplo Sertão", status: "Ativo", cidade: "Patos", poloId: "p9" },
  { id: "i15", codigo: "IG015", nome: "Igreja Exemplo Espinharas", status: "Ativo", cidade: "Patos", poloId: "p10" },
  { id: "i16", codigo: "IG016", nome: "Igreja Exemplo Rio do Peixe", status: "Ativo", cidade: "Sousa", poloId: "p11" },
];

/* --------------------------------------------------------------- consultas */

export const buscarRegiao = (id: string) => REGIOES.find((r) => r.id === id);
export const buscarArea = (id: string) => AREAS.find((a) => a.id === id);
export const buscarPolo = (id: string) => POLOS.find((p) => p.id === id);
export const buscarIgreja = (id: string) => IGREJAS.find((i) => i.id === id);

export const areasDaRegiao = (regiaoId: string) =>
  AREAS.filter((a) => a.regiaoId === regiaoId);

export const polosDaArea = (areaId: string) =>
  POLOS.filter((p) => p.areaId === areaId);

export const igrejasDoPolo = (poloId: string) =>
  IGREJAS.filter((i) => i.poloId === poloId);

export const igrejasDaArea = (areaId: string) =>
  IGREJAS.filter((i) => polosDaArea(areaId).some((p) => p.id === i.poloId));

// Caminho completo de um polo ou igreja na hierarquia.
export function caminhoDoPolo(polo: Polo) {
  const area = buscarArea(polo.areaId);
  const regiao = area ? buscarRegiao(area.regiaoId) : undefined;
  return { area, regiao };
}

export function caminhoDaIgreja(igreja: Igreja) {
  const polo = buscarPolo(igreja.poloId);
  const { area, regiao } = polo ? caminhoDoPolo(polo) : { area: undefined, regiao: undefined };
  return { polo, area, regiao };
}

// "Ativo" → "Ativa" para os cadastros de nome feminino (região, área, igreja).
export function statusFeminino(status: StatusCadastro): string {
  return status === "Ativo" ? "Ativa" : "Inativa";
}
