-- Migração 001 — Fluxo de aprovação das solicitações de obras
-- Executar no SQL Editor do Neon (é idempotente: pode rodar mais de uma vez).
--
-- Sequência das etapas (DEC-008 / DEC-010):
--   1 Pastor Local · 2 Coordenador do Polo · 3 Coordenador da Área
--   4 Coordenador da Região · 5 Responsável COMBENS · 6 Presbitério

-- Estado atual do fluxo de cada solicitação.
create table if not exists fluxo_aprovacao (
  obra_id        text        primary key,
  etapa_atual    smallint    not null default 1 check (etapa_atual between 1 and 6),
  situacao       text        not null default 'Em andamento'
                 check (situacao in ('Em andamento', 'Em correção', 'Reprovada', 'Aprovada')),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

-- Histórico das decisões. Nunca é apagado nem alterado: só recebe registros.
create table if not exists decisoes_aprovacao (
  id             bigserial   primary key,
  obra_id        text        not null,
  etapa          smallint    not null check (etapa between 1 and 6),
  nivel          text        not null,
  decisao        text        not null
                 check (decisao in ('Aprovado', 'Reprovado', 'Correção solicitada',
                                    'Reenviada após correção')),
  comentario     text,
  usuario_id     text        not null,
  usuario_nome   text        not null,
  usuario_email  text,
  criado_em      timestamptz not null default now()
);

create index if not exists decisoes_aprovacao_obra_idx
  on decisoes_aprovacao (obra_id, id);
