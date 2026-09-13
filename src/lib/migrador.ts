// Aplicação das migrações (src/lib/migracoes.ts) no banco. Só roda no
// servidor, a partir da tela Configurações → Banco de dados.

import { sql } from "@/lib/db";
import { MIGRACOES, type Migracao } from "@/lib/migracoes";

export type EstadoMigracao = {
  migracao: Migracao;
  aplicadaEm: string | null;
};

const TABELA_CONTROLE = `create table if not exists migracoes (
  id          text        primary key,
  titulo      text        not null,
  aplicada_em timestamptz not null default now()
)`;

async function garantirControle() {
  await sql()([TABELA_CONTROLE] as unknown as TemplateStringsArray);
}

export async function listarMigracoes(): Promise<EstadoMigracao[]> {
  await garantirControle();
  const linhas = await sql()`select id, aplicada_em from migracoes`;
  const aplicadas = new Map(
    linhas.map((l) => [
      l.id as string,
      new Date(l.aplicada_em as string).toISOString(),
    ]),
  );
  return MIGRACOES.map((migracao) => ({
    migracao,
    aplicadaEm: aplicadas.get(migracao.id) ?? null,
  }));
}

export class ErroMigracao extends Error {}

// Aplica uma migração pendente: todos os comandos em uma transação, mais o
// registro em `migracoes`. Se já estiver registrada, não faz nada.
export async function aplicarMigracao(id: string): Promise<string> {
  const migracao = MIGRACOES.find((m) => m.id === id);
  if (!migracao) throw new ErroMigracao(`Migração ${id} não existe.`);

  await garantirControle();
  const jaAplicada = await sql()`select 1 from migracoes where id = ${id}`;
  if (jaAplicada.length > 0) {
    return `A migração ${id} já estava aplicada.`;
  }

  const banco = sql();
  const comandos = migracao.comandos.map(
    (comando) => banco([comando] as unknown as TemplateStringsArray),
  );
  await banco.transaction([
    ...comandos,
    banco`insert into migracoes (id, titulo) values (${migracao.id}, ${migracao.titulo})
          on conflict (id) do nothing`,
  ]);

  return `Migração ${id} — ${migracao.titulo} — aplicada.`;
}
