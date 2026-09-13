// Acesso ao banco (Neon) para o fluxo de aprovação. Este módulo só roda no
// servidor: é usado pelas Server Actions e pela página de detalhes da obra.
//
// Regras aplicadas aqui (DEC-010):
//  - a solicitação só avança após aprovação da etapa atual;
//  - não é possível pular etapas (a etapa é validada no próprio UPDATE);
//  - reprovação encerra o fluxo;
//  - "Correção solicitada" mantém a etapa e não encerra o fluxo;
//  - o histórico de decisões nunca é alterado nem apagado.

import { sql } from "@/lib/db";
import {
  REENVIO,
  impedimentoParaDecidir,
  impedimentoParaReenviar,
  nivelDaEtapa,
  proximoEstado,
  type Decisao,
  type RegistroDecisao,
  type ResultadoSgi,
  type SituacaoFluxo,
  type SituacaoSgi,
} from "@/lib/aprovacao";

export type Fluxo = {
  obraId: string;
  etapaAtual: number;
  situacao: SituacaoFluxo;
  atualizadoEm: string | null;
  // Resultado do SGI (sistema externo), registrado manualmente fora das
  // etapas do fluxo. A tela de registro será feita em etapa futura.
  sgi: ResultadoSgi;
};

export type DecisaoRegistrada = {
  id: number;
  etapa: number;
  nivel: string;
  decisao: RegistroDecisao;
  comentario: string | null;
  usuarioNome: string;
  usuarioEmail: string | null;
  criadoEm: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email?: string;
};

// Estado inicial de uma solicitação que ainda não teve nenhuma decisão.
const SGI_VAZIO: ResultadoSgi = {
  situacao: "Aguardando SGI",
  valorAprovado: null,
  data: null,
  registradoPor: null,
  registradoEm: null,
};

const INICIAL = (obraId: string): Fluxo => ({
  obraId,
  etapaAtual: 1,
  situacao: "Em andamento",
  atualizadoEm: null,
  sgi: SGI_VAZIO,
});

export async function obterFluxo(obraId: string): Promise<Fluxo> {
  const linhas = await sql()`
    select obra_id, etapa_atual, situacao, atualizado_em,
           sgi_situacao, sgi_valor_aprovado, sgi_data,
           sgi_registrado_por, sgi_registrado_em
      from fluxo_aprovacao
     where obra_id = ${obraId}
  `;
  const linha = linhas[0];
  if (!linha) return INICIAL(obraId);
  return {
    obraId: linha.obra_id as string,
    etapaAtual: Number(linha.etapa_atual),
    situacao: linha.situacao as SituacaoFluxo,
    atualizadoEm: new Date(linha.atualizado_em as string).toISOString(),
    sgi: {
      situacao: (linha.sgi_situacao as SituacaoSgi | null) ?? "Aguardando SGI",
      valorAprovado:
        linha.sgi_valor_aprovado === null
          ? null
          : Number(linha.sgi_valor_aprovado),
      data: (linha.sgi_data as string | null)
        ? new Date(linha.sgi_data as string).toISOString().slice(0, 10)
        : null,
      registradoPor: (linha.sgi_registrado_por as string | null) ?? null,
      registradoEm: (linha.sgi_registrado_em as string | null)
        ? new Date(linha.sgi_registrado_em as string).toISOString()
        : null,
    },
  };
}

export async function listarDecisoes(
  obraId: string,
): Promise<DecisaoRegistrada[]> {
  const linhas = await sql()`
    select id, etapa, nivel, decisao, comentario,
           usuario_nome, usuario_email, criado_em
      from decisoes_aprovacao
     where obra_id = ${obraId}
     order by id asc
  `;
  return linhas.map((l) => ({
    id: Number(l.id),
    etapa: Number(l.etapa),
    nivel: l.nivel as string,
    decisao: l.decisao as RegistroDecisao,
    comentario: (l.comentario as string | null) ?? null,
    usuarioNome: l.usuario_nome as string,
    usuarioEmail: (l.usuario_email as string | null) ?? null,
    criadoEm: new Date(l.criado_em as string).toISOString(),
  }));
}

// Situação da obra e decisões, em uma leitura só.
export async function obterAprovacoes(obraId: string) {
  const [fluxo, decisoes] = await Promise.all([
    obterFluxo(obraId),
    listarDecisoes(obraId),
  ]);
  return { fluxo, decisoes };
}

export class ErroFluxo extends Error {}

export async function registrarDecisao({
  obraId,
  etapa,
  decisao,
  comentario,
  usuario,
}: {
  obraId: string;
  etapa: number;
  decisao: Decisao;
  comentario?: string;
  usuario: Usuario;
}): Promise<Fluxo> {
  const fluxo = await obterFluxo(obraId);

  const impedimento = impedimentoParaDecidir(fluxo, etapa);
  if (impedimento) throw new ErroFluxo(impedimento);

  await aplicar({
    obraId,
    etapaEsperada: fluxo.etapaAtual,
    situacaoEsperada: "Em andamento",
    decisao,
    comentario,
    usuario,
    proximo: proximoEstado(fluxo.etapaAtual, decisao),
  });

  return obterFluxo(obraId);
}

// Reenvio após correção: devolve a solicitação para a mesma etapa, sem
// encerrar o processo. Quem pode reenviar ainda não está definido (PEN-024).
export async function reenviarAposCorrecao({
  obraId,
  comentario,
  usuario,
}: {
  obraId: string;
  comentario?: string;
  usuario: Usuario;
}): Promise<Fluxo> {
  const fluxo = await obterFluxo(obraId);
  const impedimento = impedimentoParaReenviar(fluxo);
  if (impedimento) throw new ErroFluxo(impedimento);

  await aplicar({
    obraId,
    etapaEsperada: fluxo.etapaAtual,
    situacaoEsperada: "Em correção",
    decisao: REENVIO,
    comentario,
    usuario,
    proximo: { etapaAtual: fluxo.etapaAtual, situacao: "Em andamento" },
  });

  return obterFluxo(obraId);
}

// Grava o registro e move o fluxo em uma única transação. Os dois comandos
// checam a etapa e a situação esperadas: se outra pessoa tiver decidido antes,
// nada é gravado.
async function aplicar({
  obraId,
  etapaEsperada,
  situacaoEsperada,
  decisao,
  comentario,
  usuario,
  proximo,
}: {
  obraId: string;
  etapaEsperada: number;
  situacaoEsperada: SituacaoFluxo;
  decisao: RegistroDecisao;
  comentario?: string;
  usuario: Usuario;
  proximo: { etapaAtual: number; situacao: SituacaoFluxo };
}) {
  const banco = sql();
  const texto = comentario?.trim() ? comentario.trim() : null;
  const nivel = nivelDaEtapa(etapaEsperada);

  const resultado = await banco.transaction([
    // Cria o estado inicial se esta for a primeira decisão da solicitação.
    banco`
      insert into fluxo_aprovacao (obra_id)
      values (${obraId})
      on conflict (obra_id) do nothing
    `,
    banco`
      insert into decisoes_aprovacao
        (obra_id, etapa, nivel, decisao, comentario,
         usuario_id, usuario_nome, usuario_email)
      select ${obraId}, ${etapaEsperada}, ${nivel}, ${decisao}, ${texto},
             ${usuario.id}, ${usuario.nome}, ${usuario.email ?? null}
       where exists (
         select 1 from fluxo_aprovacao
          where obra_id = ${obraId}
            and etapa_atual = ${etapaEsperada}
            and situacao = ${situacaoEsperada}
       )
      returning id
    `,
    banco`
      update fluxo_aprovacao
         set etapa_atual = ${proximo.etapaAtual},
             situacao = ${proximo.situacao},
             atualizado_em = now()
       where obra_id = ${obraId}
         and etapa_atual = ${etapaEsperada}
         and situacao = ${situacaoEsperada}
      returning obra_id
    `,
  ]);

  const gravou = Array.isArray(resultado[1]) && resultado[1].length > 0;
  if (!gravou) {
    throw new ErroFluxo(
      "A situação da solicitação mudou enquanto a decisão era registrada. Recarregue a página e tente de novo.",
    );
  }
}
