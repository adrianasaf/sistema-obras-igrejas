// Registro central das ações relevantes (RN-12). Cada Server Action que grava
// algo também grava uma linha aqui — no mesmo momento, sem fila nem log
// assíncrono. Só roda no servidor.

import { sql } from "@/lib/db";

export const ENTIDADES = [
  "obra",
  "aprovacao",
  "sgi",
  "orcamento",
  "croqui",
  "estrutura",
  "material",
  "estoque",
] as const;
export type EntidadeAuditada = (typeof ENTIDADES)[number];

export type RegistroAuditoria = {
  usuarioId?: string | null;
  usuarioNome: string;
  acao: string;
  entidade: EntidadeAuditada;
  entidadeId?: string | null;
  detalhe?: string | null;
};

// Consulta pronta para entrar em uma transação junto com a ação principal.
export function consultaAuditoria(
  banco: ReturnType<typeof sql>,
  dados: RegistroAuditoria,
) {
  return banco`
    insert into auditoria
      (usuario_id, usuario_nome, acao, entidade, entidade_id, detalhe)
    values (${dados.usuarioId ?? null}, ${dados.usuarioNome}, ${dados.acao},
            ${dados.entidade}, ${dados.entidadeId ?? null},
            ${dados.detalhe ?? null})`;
}

// Grava direto, quando a ação principal não usa transação.
export async function registrarAuditoria(dados: RegistroAuditoria) {
  await consultaAuditoria(sql(), dados);
}

export type LinhaAuditoria = {
  id: number;
  usuarioNome: string;
  acao: string;
  entidade: string;
  entidadeId: string | null;
  detalhe: string | null;
  criadoEm: string;
};

export async function listarAuditoria(limite = 200): Promise<LinhaAuditoria[]> {
  const linhas = await sql()`
    select id, usuario_nome, acao, entidade, entidade_id, detalhe, criado_em
      from auditoria order by id desc limit ${limite}`;
  return linhas.map((l) => ({
    id: Number(l.id),
    usuarioNome: l.usuario_nome as string,
    acao: l.acao as string,
    entidade: l.entidade as string,
    entidadeId: (l.entidade_id as string | null) ?? null,
    detalhe: (l.detalhe as string | null) ?? null,
    criadoEm: new Date(l.criado_em as string).toISOString(),
  }));
}
