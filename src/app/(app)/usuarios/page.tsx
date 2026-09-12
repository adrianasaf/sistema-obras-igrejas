import type { Metadata } from "next";
import { USUARIOS } from "@/lib/usuarios-mock";
import { PainelUsuarios } from "./painel";

export const metadata: Metadata = { title: "Usuários" };

export default function UsuariosPage() {
  const usuarios = [...USUARIOS].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">
          Usuários e perfis
        </h1>
        <p className="mt-1 text-sm text-muted">
          Acessos ao sistema e vínculo com a estrutura administrativa. Dados
          demonstrativos.
        </p>
      </div>

      <PainelUsuarios usuarios={usuarios} />

      <p className="text-xs text-muted">
        Tela demonstrativa: nenhuma permissão é aplicada e nenhum cadastro é
        gravado. A autenticação continua sendo feita pelo Clerk, sem relação com
        esta lista.
      </p>
    </div>
  );
}
