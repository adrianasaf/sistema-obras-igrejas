import { neon } from "@neondatabase/serverless";

// Conexão com o Neon PostgreSQL. A URL vem somente de variável de ambiente
// (DATABASE_URL, definida pela integração Neon na Vercel e no .env.local).
// Ainda não há tabelas do sistema: apenas a conexão está preparada.
export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida (veja .env.example).");
  }
  return neon(url);
}

// Verifica se o banco responde. Usado por /api/saude.
export async function verificarBanco(): Promise<boolean> {
  const [linha] = await sql()`select 1 as ok`;
  return linha?.ok === 1;
}
