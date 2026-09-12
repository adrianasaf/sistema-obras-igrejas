import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

// Cliente para Server Components, Server Actions e Route Handlers.
// A sessão fica em cookies; a renovação é feita em src/proxy.ts.
export async function createClient() {
  // cookies() primeiro: marca a rota como dinâmica (nunca pré-renderizada).
  const cookieStore = await cookies();
  const { url, key } = supabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado a partir de um Server Component: não é possível gravar
          // cookies aqui. O proxy cuida da renovação da sessão.
        }
      },
    },
  });
}
