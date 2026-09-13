// Acesso ao banco para o estoque de materiais. Só roda no servidor.
//
// DEC-015: cada material pertence a uma igreja ou ao estoque geral (sem
// igreja). A visibilidade é ampla — todos que acessam a área veem os
// materiais de todas as igrejas, para permitir remanejamento. A **saída**
// de estoque não existe ainda: depende das fases de execução (PEN-009).

import { consultaAuditoria } from "@/lib/auditoria";
import { sql } from "@/lib/db";

export class ErroEstoque extends Error {}

export type StatusMaterial = "Normal" | "Abaixo do mínimo" | "Em falta";

export type Material = {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  quantidade: number;
  minimo: number;
  igrejaId: string | null;
  igrejaNome: string; // "Estoque geral" quando não há igreja
  status: StatusMaterial;
};

function statusDe(quantidade: number, minimo: number): StatusMaterial {
  if (quantidade <= 0) return "Em falta";
  if (quantidade < minimo) return "Abaixo do mínimo";
  return "Normal";
}

export async function listarMateriais(): Promise<Material[]> {
  const linhas = await sql()`
    select m.id, m.nome, m.categoria, m.unidade, m.quantidade_atual,
           m.estoque_minimo, m.igreja_id, i.nome as igreja_nome
      from materiais m
      left join igrejas i on i.id = m.igreja_id
     order by m.nome`;
  return linhas.map((l) => {
    const quantidade = Number(l.quantidade_atual);
    const minimo = Number(l.estoque_minimo);
    return {
      id: l.id as string,
      nome: l.nome as string,
      categoria: l.categoria as string,
      unidade: l.unidade as string,
      quantidade,
      minimo,
      igrejaId: (l.igreja_id as string | null) ?? null,
      igrejaNome: (l.igreja_nome as string | null) ?? "Estoque geral",
      status: statusDe(quantidade, minimo),
    };
  });
}

export type DadosMaterial = {
  nome: string;
  categoria: string;
  unidade: string;
  minimo: number;
  igrejaId: string | null;
};

export type Usuario = { id: string; nome: string };

// Id legível a partir do nome, com sufixo numérico em caso de repetição.
function idDoNome(nome: string): string {
  const base = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  if (!base) throw new ErroEstoque("Informe um nome válido para o material.");
  return `${base}-${Date.now().toString(36).slice(-4)}`;
}

export async function criarMaterial(
  dados: DadosMaterial,
  usuario: Usuario,
): Promise<string> {
  const id = idDoNome(dados.nome);
  const banco = sql();

  await banco.transaction([
    banco`insert into materiais
            (id, nome, categoria, unidade, quantidade_atual, estoque_minimo, igreja_id)
          values (${id}, ${dados.nome}, ${dados.categoria}, ${dados.unidade},
                  0, ${dados.minimo}, ${dados.igrejaId})`,
    consultaAuditoria(banco, {
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      acao: "Cadastrou material",
      entidade: "material",
      entidadeId: id,
      detalhe: `${dados.nome} (${dados.unidade}) · ${dados.igrejaId ?? "estoque geral"}`,
    }),
  ]);

  return id;
}

export async function atualizarMaterial(
  id: string,
  dados: DadosMaterial,
  usuario: Usuario,
): Promise<void> {
  const banco = sql();
  const existe = await banco`select 1 from materiais where id = ${id}`;
  if (existe.length === 0) throw new ErroEstoque("Material não encontrado.");

  await banco.transaction([
    banco`update materiais
             set nome = ${dados.nome}, categoria = ${dados.categoria},
                 unidade = ${dados.unidade}, estoque_minimo = ${dados.minimo},
                 igreja_id = ${dados.igrejaId}, atualizado_em = now()
           where id = ${id}`,
    consultaAuditoria(banco, {
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      acao: "Editou material",
      entidade: "material",
      entidadeId: id,
      detalhe: `${dados.nome} · mínimo ${dados.minimo} ${dados.unidade}`,
    }),
  ]);
}

export type DadosEntrada = {
  materialId: string;
  quantidade: number;
  fornecedor: string;
  valorUnitario: number | null;
  data: string | null;
};

// Entrada: soma na quantidade do material e grava a movimentação, tudo na
// mesma transação, com a linha de auditoria.
export async function registrarEntrada(
  dados: DadosEntrada,
  usuario: Usuario,
): Promise<void> {
  if (!(dados.quantidade > 0)) {
    throw new ErroEstoque("A quantidade da entrada deve ser maior que zero.");
  }

  const banco = sql();
  const linhas = await banco`
    select nome, unidade from materiais where id = ${dados.materialId}`;
  if (linhas.length === 0) throw new ErroEstoque("Material não encontrado.");
  const material = linhas[0];

  const total =
    dados.valorUnitario === null
      ? null
      : Math.round(dados.valorUnitario * dados.quantidade * 100) / 100;

  await banco.transaction([
    banco`insert into movimentacoes_estoque
            (material_id, tipo, quantidade, fornecedor, valor_unitario,
             valor_total, data, responsavel_id, responsavel)
          values (${dados.materialId}, 'entrada', ${dados.quantidade},
                  ${dados.fornecedor || null}, ${dados.valorUnitario},
                  ${total}, ${dados.data ?? new Date().toISOString().slice(0, 10)},
                  ${usuario.id}, ${usuario.nome})`,
    banco`update materiais
             set quantidade_atual = quantidade_atual + ${dados.quantidade},
                 atualizado_em = now()
           where id = ${dados.materialId}`,
    consultaAuditoria(banco, {
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      acao: "Registrou entrada de estoque",
      entidade: "estoque",
      entidadeId: dados.materialId,
      detalhe: `+${dados.quantidade} ${material.unidade} de ${material.nome}${
        dados.fornecedor ? ` · ${dados.fornecedor}` : ""
      }`,
    }),
  ]);
}

export function formatarQuantidade(valor: number): string {
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}
