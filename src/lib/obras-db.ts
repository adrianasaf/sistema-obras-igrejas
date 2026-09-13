// Acesso ao banco para as solicitações de obras. Só roda no servidor.
//
// O status da solicitação NÃO fica na tabela `obras`: vem do fluxo de
// aprovação (src/lib/fluxo-aprovacao.ts). A prioridade pode estar vazia:
// quem define é o pastor responsável da CONBENS (DEC-013).

import { consultaAuditoria } from "@/lib/auditoria";
import { sql } from "@/lib/db";
import {
  corStatusGeral,
  rotuloStatusGeral,
  type SituacaoAprovacao,
  type SituacaoFluxo,
  type SituacaoSgi,
} from "@/lib/aprovacao";
import { filtroDeEscopo, type EscopoUsuario } from "@/lib/escopo";
import type { Prioridade, TipoObra } from "@/lib/obras-tipos";

export class ErroObra extends Error {}

export type Obra = {
  id: string;
  igrejaId: string;
  igrejaNome: string;
  cidade: string;
  // Cadeia da estrutura, usada para o escopo do usuário (DEC-014).
  poloId: string;
  poloNome: string;
  areaId: string;
  areaNome: string;
  regiaoId: string;
  regiaoNome: string;
  tipo: TipoObra;
  titulo: string;
  descricao: string;
  data: string; // ISO (AAAA-MM-DD)
  responsavel: string | null;
  prioridade: Prioridade | null;
  // Situação vinda do fluxo de aprovação.
  situacao: SituacaoFluxo;
  etapaAtual: number;
  situacaoSgi: SituacaoSgi;
  statusRotulo: string;
  statusCor: SituacaoAprovacao;
};

const SELECT = `
  select o.id, o.igreja_id, o.tipo, o.titulo, o.descricao,
         o.data_solicitacao, o.responsavel_solicitacao, o.prioridade,
         i.nome as igreja_nome, i.cidade,
         p.id as polo_id, p.nome as polo_nome,
         a.id as area_id, a.nome as area_nome,
         r.id as regiao_id, r.nome as regiao_nome,
         coalesce(f.situacao, 'Em andamento') as situacao,
         coalesce(f.etapa_atual, 1) as etapa_atual,
         coalesce(f.sgi_situacao, 'Aguardando SGI') as sgi_situacao
    from obras o
    join igrejas i on i.id = o.igreja_id
    join polos p on p.id = i.polo_id
    join areas a on a.id = p.area_id
    join regioes r on r.id = a.regiao_id
    left join fluxo_aprovacao f on f.obra_id = o.id`;

// Coluna que corresponde a cada nível de vínculo, para filtrar por escopo.
const COLUNA_ESCOPO = {
  igreja: "o.igreja_id",
  polo: "p.id",
  area: "a.id",
  regiao: "r.id",
} as const;

type Linha = Record<string, unknown>;

function montar(l: Linha): Obra {
  const situacao = l.situacao as SituacaoFluxo;
  const etapaAtual = Number(l.etapa_atual);
  const situacaoSgi = l.sgi_situacao as SituacaoSgi;
  return {
    id: l.id as string,
    igrejaId: l.igreja_id as string,
    igrejaNome: l.igreja_nome as string,
    cidade: l.cidade as string,
    poloId: l.polo_id as string,
    poloNome: l.polo_nome as string,
    areaId: l.area_id as string,
    areaNome: l.area_nome as string,
    regiaoId: l.regiao_id as string,
    regiaoNome: l.regiao_nome as string,
    tipo: l.tipo as TipoObra,
    titulo: l.titulo as string,
    descricao: l.descricao as string,
    data: new Date(l.data_solicitacao as string).toISOString().slice(0, 10),
    responsavel: (l.responsavel_solicitacao as string | null) ?? null,
    prioridade: (l.prioridade as Prioridade | null) ?? null,
    situacao,
    etapaAtual,
    situacaoSgi,
    statusRotulo: rotuloStatusGeral(situacao, etapaAtual, situacaoSgi),
    statusCor: corStatusGeral(situacao, situacaoSgi),
  };
}

// Lista as obras dentro do escopo do usuário. Administrador, Responsável
// CONBENS e Presbitério veem todas; os demais, só as do seu vínculo.
export async function listarObras(usuario: EscopoUsuario): Promise<Obra[]> {
  const filtro = filtroDeEscopo(usuario);
  if (filtro.tipo === "nada") return [];

  const ordem = "order by o.data_solicitacao desc, o.id desc";
  const linhas =
    filtro.tipo === "tudo"
      ? await sql().query(`${SELECT} ${ordem}`, [])
      : await sql().query(
          `${SELECT} where ${COLUNA_ESCOPO[filtro.nivel]} = $1 ${ordem}`,
          [filtro.id],
        );
  return (linhas as Linha[]).map(montar);
}

export async function buscarObra(id: string): Promise<Obra | undefined> {
  const linhas = await sql().query(`${SELECT} where o.id = $1`, [id]);
  const linha = (linhas as Linha[])[0];
  return linha ? montar(linha) : undefined;
}

export async function obrasDaIgreja(
  igrejaId: string,
  usuario: EscopoUsuario,
): Promise<Obra[]> {
  const obras = await listarObras(usuario);
  return obras.filter((o) => o.igrejaId === igrejaId);
}

export type NovaObra = {
  igrejaId: string;
  tipo: TipoObra;
  titulo: string;
  descricao: string;
  responsavel: string;
  usuarioId?: string;
};

// Grava a solicitação e abre o fluxo de aprovação na etapa 1 (Coordenador do
// Polo), na mesma transação. O número da solicitação segue o padrão
// AAAA-NNNN, sequencial por ano.
export async function criarObra(dados: NovaObra): Promise<string> {
  const banco = sql();

  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const [{ proximo }] = (await banco.query(
      `select to_char(now(), 'YYYY') || '-' ||
              lpad((coalesce(max(substring(id from 6)::int), 0) + 1)::text, 4, '0') as proximo
         from obras
        where id like to_char(now(), 'YYYY') || '-%'`,
      [],
    )) as { proximo: string }[];

    try {
      await banco.transaction([
        banco`insert into obras
                (id, igreja_id, tipo, titulo, descricao, responsavel_solicitacao)
              values (${proximo}, ${dados.igrejaId}, ${dados.tipo},
                      ${dados.titulo}, ${dados.descricao}, ${dados.responsavel})`,
        banco`insert into fluxo_aprovacao (obra_id, etapa_atual, situacao)
              values (${proximo}, 1, 'Em andamento')
              on conflict (obra_id) do nothing`,
        consultaAuditoria(banco, {
          usuarioId: dados.usuarioId ?? null,
          usuarioNome: dados.responsavel,
          acao: "Registrou solicitação",
          entidade: "obra",
          entidadeId: proximo,
          detalhe: `${dados.tipo} · ${dados.titulo}`,
        }),
      ]);
      return proximo;
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "";
      // Duas solicitações ao mesmo tempo podem disputar o mesmo número.
      if (mensagem.includes("duplicate key") && tentativa < 2) continue;
      throw erro;
    }
  }

  throw new ErroObra(
    "Não foi possível gerar o número da solicitação. Tente novamente.",
  );
}
