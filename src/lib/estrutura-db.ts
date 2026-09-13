// Acesso ao banco para a estrutura administrativa (Região → Área → Polo →
// Igreja). Só roda no servidor. Os tipos continuam em estrutura-tipos.ts.

import { consultaAuditoria } from "@/lib/auditoria";
import { sql } from "@/lib/db";
import type {
  Area,
  Igreja,
  Polo,
  Regiao,
  StatusCadastro,
} from "@/lib/estrutura-tipos";

export class ErroCadastro extends Error {}

/* ------------------------------------------------------------- consultas */

export async function listarRegioes(): Promise<Regiao[]> {
  const linhas = await sql()`
    select id, codigo, nome, status, responsavel,
           (select count(*) from areas a where a.regiao_id = r.id) as total_areas
      from regioes r order by codigo`;
  return linhas.map((l) => ({
    id: l.id as string,
    codigo: l.codigo as string,
    nome: l.nome as string,
    status: l.status as StatusCadastro,
    responsavel: (l.responsavel as string | null) ?? "",
    totalAreas: Number(l.total_areas),
  }));
}

export async function listarAreas(): Promise<Area[]> {
  const linhas = await sql()`
    select a.id, a.codigo, a.nome, a.status, a.responsavel, a.regiao_id,
           r.nome as regiao_nome,
           (select count(*) from polos p where p.area_id = a.id) as total_polos
      from areas a join regioes r on r.id = a.regiao_id
     order by a.codigo`;
  return linhas.map((l) => ({
    id: l.id as string,
    codigo: l.codigo as string,
    nome: l.nome as string,
    status: l.status as StatusCadastro,
    responsavel: (l.responsavel as string | null) ?? "",
    regiaoId: l.regiao_id as string,
    regiaoNome: l.regiao_nome as string,
    totalPolos: Number(l.total_polos),
  }));
}

export async function listarPolos(): Promise<Polo[]> {
  const linhas = await sql()`
    select p.id, p.codigo, p.nome, p.status, p.responsavel, p.area_id,
           a.nome as area_nome, r.id as regiao_id, r.nome as regiao_nome,
           (select count(*) from igrejas i where i.polo_id = p.id) as total_igrejas
      from polos p
      join areas a on a.id = p.area_id
      join regioes r on r.id = a.regiao_id
     order by p.codigo`;
  return linhas.map((l) => ({
    id: l.id as string,
    codigo: l.codigo as string,
    nome: l.nome as string,
    status: l.status as StatusCadastro,
    responsavel: (l.responsavel as string | null) ?? "",
    areaId: l.area_id as string,
    areaNome: l.area_nome as string,
    regiaoId: l.regiao_id as string,
    regiaoNome: l.regiao_nome as string,
    totalIgrejas: Number(l.total_igrejas),
  }));
}

export async function listarIgrejas(): Promise<Igreja[]> {
  const linhas = await sql()`
    select i.id, i.codigo, i.nome, i.status, i.cidade, i.polo_id,
           p.nome as polo_nome, a.id as area_id, a.nome as area_nome,
           r.id as regiao_id, r.nome as regiao_nome
      from igrejas i
      join polos p on p.id = i.polo_id
      join areas a on a.id = p.area_id
      join regioes r on r.id = a.regiao_id
     order by i.nome`;
  return linhas.map((l) => ({
    id: l.id as string,
    codigo: l.codigo as string,
    nome: l.nome as string,
    status: l.status as StatusCadastro,
    cidade: l.cidade as string,
    poloId: l.polo_id as string,
    poloNome: l.polo_nome as string,
    areaId: l.area_id as string,
    areaNome: l.area_nome as string,
    regiaoId: l.regiao_id as string,
    regiaoNome: l.regiao_nome as string,
  }));
}

export async function buscarRegiao(id: string) {
  return (await listarRegioes()).find((r) => r.id === id);
}
export async function buscarArea(id: string) {
  return (await listarAreas()).find((a) => a.id === id);
}
export async function buscarPolo(id: string) {
  return (await listarPolos()).find((p) => p.id === id);
}
export async function buscarIgreja(id: string) {
  return (await listarIgrejas()).find((i) => i.id === id);
}

/* --------------------------------------------------------------- gravação */

// Id gerado a partir do código, para as URLs seguirem legíveis.
function idDoCodigo(prefixo: string, codigo: string): string {
  const limpo = codigo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!limpo) throw new ErroCadastro("Informe um código válido.");
  return `${prefixo}-${limpo}`;
}

export type DadosRegiao = {
  codigo: string;
  nome: string;
  status: StatusCadastro;
  responsavel: string;
};
export type DadosArea = DadosRegiao & { regiaoId: string };
export type DadosPolo = DadosRegiao & { areaId: string };
export type DadosIgreja = {
  codigo: string;
  nome: string;
  status: StatusCadastro;
  cidade: string;
  poloId: string;
};

export type Autor = { id?: string | null; nome: string };

// Cada gravação vai junto com a linha de auditoria, na mesma transação (RN-12).
function auditar(
  banco: ReturnType<typeof sql>,
  autor: Autor,
  acao: string,
  id: string,
  detalhe: string,
) {
  return consultaAuditoria(banco, {
    usuarioId: autor.id ?? null,
    usuarioNome: autor.nome,
    acao,
    entidade: "estrutura",
    entidadeId: id,
    detalhe,
  });
}

export async function criarRegiao(
  dados: DadosRegiao,
  autor: Autor,
): Promise<string> {
  const id = idDoCodigo("r", dados.codigo);
  const banco = sql();
  await banco.transaction([
    banco`insert into regioes (id, codigo, nome, status, responsavel)
          values (${id}, ${dados.codigo}, ${dados.nome}, ${dados.status},
                  ${dados.responsavel})`,
    auditar(banco, autor, "Cadastrou região", id, `${dados.codigo} · ${dados.nome}`),
  ]);
  return id;
}

export async function atualizarRegiao(
  id: string,
  dados: DadosRegiao,
  autor: Autor,
) {
  const banco = sql();
  await banco.transaction([
    banco`update regioes set codigo = ${dados.codigo}, nome = ${dados.nome},
                 status = ${dados.status}, responsavel = ${dados.responsavel},
                 atualizado_em = now()
           where id = ${id}`,
    auditar(banco, autor, "Editou região", id, `${dados.codigo} · ${dados.nome} · ${dados.status}`),
  ]);
}

export async function criarArea(dados: DadosArea, autor: Autor): Promise<string> {
  const id = idDoCodigo("a", dados.codigo);
  const banco = sql();
  await banco.transaction([
    banco`insert into areas (id, codigo, nome, status, responsavel, regiao_id)
          values (${id}, ${dados.codigo}, ${dados.nome}, ${dados.status},
                  ${dados.responsavel}, ${dados.regiaoId})`,
    auditar(banco, autor, "Cadastrou área", id, `${dados.codigo} · ${dados.nome}`),
  ]);
  return id;
}

export async function atualizarArea(id: string, dados: DadosArea, autor: Autor) {
  const banco = sql();
  await banco.transaction([
    banco`update areas set codigo = ${dados.codigo}, nome = ${dados.nome},
                 status = ${dados.status}, responsavel = ${dados.responsavel},
                 regiao_id = ${dados.regiaoId}, atualizado_em = now()
           where id = ${id}`,
    auditar(banco, autor, "Editou área", id, `${dados.codigo} · ${dados.nome} · ${dados.status}`),
  ]);
}

export async function criarPolo(dados: DadosPolo, autor: Autor): Promise<string> {
  const id = idDoCodigo("p", dados.codigo);
  const banco = sql();
  await banco.transaction([
    banco`insert into polos (id, codigo, nome, status, responsavel, area_id)
          values (${id}, ${dados.codigo}, ${dados.nome}, ${dados.status},
                  ${dados.responsavel}, ${dados.areaId})`,
    auditar(banco, autor, "Cadastrou polo", id, `${dados.codigo} · ${dados.nome}`),
  ]);
  return id;
}

export async function atualizarPolo(id: string, dados: DadosPolo, autor: Autor) {
  const banco = sql();
  await banco.transaction([
    banco`update polos set codigo = ${dados.codigo}, nome = ${dados.nome},
                 status = ${dados.status}, responsavel = ${dados.responsavel},
                 area_id = ${dados.areaId}, atualizado_em = now()
           where id = ${id}`,
    auditar(banco, autor, "Editou polo", id, `${dados.codigo} · ${dados.nome} · ${dados.status}`),
  ]);
}

export async function criarIgreja(
  dados: DadosIgreja,
  autor: Autor,
): Promise<string> {
  const id = idDoCodigo("i", dados.codigo);
  const banco = sql();
  await banco.transaction([
    banco`insert into igrejas (id, codigo, nome, status, cidade, polo_id)
          values (${id}, ${dados.codigo}, ${dados.nome}, ${dados.status},
                  ${dados.cidade}, ${dados.poloId})`,
    auditar(banco, autor, "Cadastrou igreja", id, `${dados.codigo} · ${dados.nome} · ${dados.cidade}`),
  ]);
  return id;
}

export async function atualizarIgreja(
  id: string,
  dados: DadosIgreja,
  autor: Autor,
) {
  const banco = sql();
  await banco.transaction([
    banco`update igrejas set codigo = ${dados.codigo}, nome = ${dados.nome},
                 status = ${dados.status}, cidade = ${dados.cidade},
                 polo_id = ${dados.poloId}, atualizado_em = now()
           where id = ${id}`,
    auditar(banco, autor, "Editou igreja", id, `${dados.codigo} · ${dados.nome} · ${dados.status}`),
  ]);
}
