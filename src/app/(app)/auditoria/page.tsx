import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { listarAuditoria, type LinhaAuditoria } from "@/lib/auditoria";
import { exigirAcesso } from "@/lib/sessao";
import { cartao } from "@/lib/ui";
import { ListaAuditoria } from "./lista";

export const metadata: Metadata = { title: "Auditoria" };

export default async function AuditoriaPage() {
  await exigirAcesso("auditoria");

  let registros: LinhaAuditoria[] = [];
  let erro = false;
  try {
    registros = await listarAuditoria(200);
  } catch (e) {
    console.error("Falha ao consultar a auditoria:", e);
    erro = true;
  }

  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Auditoria"
        descricao="Ações registradas no sistema: quem fez, o quê e quando."
      />

      {erro ? (
        <p className={`${cartao} px-5 py-6 text-sm text-muted`}>
          Não foi possível consultar a auditoria agora. Se a migração 009 ainda
          não foi aplicada, aplique em Configurações → Banco de dados.
        </p>
      ) : (
        <ListaAuditoria registros={registros} />
      )}

      <p className="text-xs text-muted">
        Mostrando as 200 ações mais recentes. Os registros não são alterados nem
        apagados.
      </p>
    </div>
  );
}
