import { NextResponse } from "next/server";
import { verificarBanco } from "@/lib/db";

export const dynamic = "force-dynamic";

// Verificação de saúde: informa apenas se o banco responde, sem detalhes.
export async function GET() {
  try {
    const ok = await verificarBanco();
    return NextResponse.json({ banco: ok ? "ok" : "falha" }, { status: ok ? 200 : 503 });
  } catch {
    return NextResponse.json({ banco: "falha" }, { status: 503 });
  }
}
