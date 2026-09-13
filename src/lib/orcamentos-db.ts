// Acesso ao banco para os orçamentos e o croqui da obra. Só roda no servidor.
//
// Regras (DEC-013): depois da aprovação da CONBENS, a igreja solicitante monta
// 3 cotações de material, 3 de mão de obra e o croqui. Até três cotações por
// categoria e uma única selecionada por categoria — os dois limites também são
// garantidos por índices únicos no banco (migração 007).

import { consultaAuditoria } from "@/lib/auditoria";
import { sql } from "@/lib/db";

export class ErroOrcamento extends Error {}

export const CATEGORIAS = ["material", "mao_de_obra"] as const;
export type CategoriaOrcamento = (typeof CATEGORIAS)[number];

export const ROTULO_CATEGORIA: Record<CategoriaOrcamento, string> = {
  material: "Material",
  mao_de_obra: "Mão de obra",
};

export const MAXIMO_POR_CATEGORIA = 3;

export const STATUS_COTACAO = [
  "Não recebido",
  "Recebido",
  "Selecionado",
] as const;
export type StatusCotacao = (typeof STATUS_COTACAO)[number];

export type Cotacao = {
  id: number;
  categoria: CategoriaOrcamento;
  numero: number;
  fornecedor: string | null;
  valor: number | null;
  dataCotacao: string | null; // ISO (AAAA-MM-DD)
  validade: string | null;
  observacoes: string | null;
  status: StatusCotacao;
  criadoPor: string | null;
};

export type Croqui = {
  descricao: string | null;
  arquivoUrl: string | null;
  enviadoPor: string | null;
  enviadoEm: string | null;
};

const dataIso = (valor: unknown) =>
  valor ? new Date(valor as string).toISOString().slice(0, 10) : null;

export async function listarCotacoes(obraId: string): Promise<Cotacao[]> {
  const linhas = await sql()`
    select id, categoria, numero, fornecedor_prestador, valor,
           data_cotacao, validade, observacoes, status, criado_por
      from orcamentos_obra
     where obra_id = ${obraId}
     order by categoria, numero`;
  return linhas.map((l) => ({
    id: Number(l.id),
    categoria: l.categoria as CategoriaOrcamento,
    numero: Number(l.numero),
    fornecedor: (l.fornecedor_prestador as string | null) ?? null,
    valor: l.valor === null ? null : Number(l.valor),
    dataCotacao: dataIso(l.data_cotacao),
    validade: dataIso(l.validade),
    observacoes: (l.observacoes as string | null) ?? null,
    status: l.status as StatusCotacao,
    criadoPor: (l.criado_por as string | null) ?? null,
  }));
}

export async function buscarCroqui(obraId: string): Promise<Croqui | null> {
  const linhas = await sql()`
    select descricao, arquivo_url, enviado_por, enviado_em
      from croquis_obra where obra_id = ${obraId}`;
  const l = linhas[0];
  if (!l) return null;
  return {
    descricao: (l.descricao as string | null) ?? null,
    arquivoUrl: (l.arquivo_url as string | null) ?? null,
    enviadoPor: (l.enviado_por as string | null) ?? null,
    enviadoEm: l.enviado_em
      ? new Date(l.enviado_em as string).toISOString()
      : null,
  };
}

export type OrcamentoDaObra = {
  cotacoes: Record<CategoriaOrcamento, Cotacao[]>;
  croqui: Croqui | null;
  menorMaterial: number | null;
  menorMaoDeObra: number | null;
  selecionadoMaterial: number | null;
  selecionadoMaoDeObra: number | null;
  totalEstimado: number | null;
};

// Menor valor entre as cotações informadas de uma categoria.
function menorValor(lista: Cotacao[]): number | null {
  const valores = lista
    .map((c) => c.valor)
    .filter((v): v is number => v !== null && v > 0);
  return valores.length ? Math.min(...valores) : null;
}

function selecionado(lista: Cotacao[]): number | null {
  return lista.find((c) => c.status === "Selecionado")?.valor ?? null;
}

export async function obterOrcamento(obraId: string): Promise<OrcamentoDaObra> {
  const [cotacoes, croqui] = await Promise.all([
    listarCotacoes(obraId),
    buscarCroqui(obraId),
  ]);

  const material = cotacoes.filter((c) => c.categoria === "material");
  const maoDeObra = cotacoes.filter((c) => c.categoria === "mao_de_obra");

  const selMaterial = selecionado(material);
  const selMaoDeObra = selecionado(maoDeObra);
  const totalEstimado =
    selMaterial === null && selMaoDeObra === null
      ? null
      : (selMaterial ?? 0) + (selMaoDeObra ?? 0);

  return {
    cotacoes: { material, mao_de_obra: maoDeObra },
    croqui,
    menorMaterial: menorValor(material),
    menorMaoDeObra: menorValor(maoDeObra),
    selecionadoMaterial: selMaterial,
    selecionadoMaoDeObra: selMaoDeObra,
    totalEstimado,
  };
}

/* --------------------------------------------------------------- gravação */

export type DadosCotacao = {
  obraId: string;
  categoria: CategoriaOrcamento;
  numero: number;
  fornecedor: string;
  valor: number | null;
  dataCotacao: string | null;
  validade: string | null;
  observacoes: string;
  status: Exclude<StatusCotacao, "Selecionado">;
  usuario: string;
};

// Cria ou atualiza a cotação daquele número. O número é limitado a 1..3 pelo
// banco, o que também limita a três cotações por categoria.
export async function salvarCotacao(dados: DadosCotacao): Promise<void> {
  if (dados.numero < 1 || dados.numero > MAXIMO_POR_CATEGORIA) {
    throw new ErroOrcamento(
      `Cada categoria aceita no máximo ${MAXIMO_POR_CATEGORIA} cotações.`,
    );
  }

  const banco = sql();
  await banco.transaction([
    banco`
    insert into orcamentos_obra
      (obra_id, categoria, numero, fornecedor_prestador, valor,
       data_cotacao, validade, observacoes, status, criado_por)
    values (${dados.obraId}, ${dados.categoria}, ${dados.numero},
            ${dados.fornecedor || null}, ${dados.valor},
            ${dados.dataCotacao}, ${dados.validade},
            ${dados.observacoes || null}, ${dados.status}, ${dados.usuario})
    on conflict (obra_id, categoria, numero) do update
       set fornecedor_prestador = excluded.fornecedor_prestador,
           valor = excluded.valor,
           data_cotacao = excluded.data_cotacao,
           validade = excluded.validade,
           observacoes = excluded.observacoes,
           -- Uma cotação já selecionada continua selecionada ao ser editada.
           status = case when orcamentos_obra.status = 'Selecionado'
                         then 'Selecionado' else excluded.status end,
           atualizado_em = now()`,
    consultaAuditoria(banco, {
      usuarioNome: dados.usuario,
      acao: "Lançou cotação",
      entidade: "orcamento",
      entidadeId: dados.obraId,
      detalhe: `${dados.categoria} nº ${dados.numero}${
        dados.fornecedor ? ` · ${dados.fornecedor}` : ""
      }${dados.valor !== null ? ` · ${dados.valor}` : ""}`,
    }),
  ]);
}

// Marca uma cotação como selecionada e desmarca as demais da categoria.
export async function selecionarCotacao(
  obraId: string,
  categoria: CategoriaOrcamento,
  numero: number,
  usuario = "—",
): Promise<void> {
  const banco = sql();
  const atual = await banco`
    select valor from orcamentos_obra
     where obra_id = ${obraId} and categoria = ${categoria} and numero = ${numero}`;
  if (atual.length === 0) {
    throw new ErroOrcamento("Cotação não encontrada.");
  }
  if (atual[0].valor === null) {
    throw new ErroOrcamento(
      "Informe o valor da cotação antes de selecioná-la.",
    );
  }

  await banco.transaction([
    banco`update orcamentos_obra set status = 'Recebido', atualizado_em = now()
           where obra_id = ${obraId} and categoria = ${categoria}
             and status = 'Selecionado'`,
    banco`update orcamentos_obra set status = 'Selecionado', atualizado_em = now()
           where obra_id = ${obraId} and categoria = ${categoria}
             and numero = ${numero}`,
    consultaAuditoria(banco, {
      usuarioNome: usuario,
      acao: "Selecionou cotação",
      entidade: "orcamento",
      entidadeId: obraId,
      detalhe: `${categoria} nº ${numero}`,
    }),
  ]);
}

// Registra ou atualiza o croqui. O upload de arquivo será implementado em
// etapa futura: por ora são descrição e link.
export async function salvarCroqui(dados: {
  obraId: string;
  descricao: string;
  arquivoUrl: string;
  usuario: string;
}): Promise<void> {
  const banco = sql();
  await banco.transaction([
    banco`
    insert into croquis_obra (obra_id, descricao, arquivo_url, enviado_por)
    values (${dados.obraId}, ${dados.descricao || null},
            ${dados.arquivoUrl || null}, ${dados.usuario})
    on conflict (obra_id) do update
       set descricao = excluded.descricao,
           arquivo_url = excluded.arquivo_url,
           enviado_por = excluded.enviado_por,
           enviado_em = now()`,
    consultaAuditoria(banco, {
      usuarioNome: dados.usuario,
      acao: "Registrou croqui",
      entidade: "croqui",
      entidadeId: dados.obraId,
      detalhe: dados.arquivoUrl || dados.descricao || null,
    }),
  ]);
}
