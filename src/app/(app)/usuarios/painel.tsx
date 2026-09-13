"use client";

import { useMemo, useState } from "react";
import { BadgeCadastro, BadgePerfil } from "@/components/badges";
import {
  BarraFiltros,
  CampoBusca,
  ContadorResultados,
  GrupoFiltro,
} from "@/components/filtros";
import { CartaoLista, ListaVazia, Tabela } from "@/components/tabela";
import { CORES_PERFIL } from "@/lib/cores";
import type { StatusCadastro } from "@/lib/estrutura-tipos";
import {
  PERFIS,
  ROTULO_VINCULO,
  VINCULO_DO_PERFIL,
  descreverVinculo,
  formatarUltimoAcesso,
  type NivelVinculo,
  type Perfil,
  type Usuario,
} from "@/lib/usuarios-mock";
import {
  botaoAcao,
  botaoAcaoBase,
  botaoPrimario,
  botaoSecundario,
  cartao,
  classeCampo,
  classeRotulo,
  tituloSecao,
} from "@/lib/ui";

type Modal = { modo: "novo" } | { modo: "editar"; usuario: Usuario } | null;

// Registros da estrutura administrativa, por nível, vindos do banco.
export type Estrutura = Record<
  "regiao" | "area" | "polo" | "igreja",
  { id: string; codigo: string; nome: string }[]
>;

// Filtros, busca e ativar/desativar funcionam apenas nesta tela, sobre os
// dados demonstrativos: nada é gravado e nenhuma permissão é aplicada.
export function PainelUsuarios({
  usuarios,
  estrutura,
}: {
  usuarios: Usuario[];
  estrutura: Estrutura;
}) {
  const [lista, setLista] = useState(usuarios);
  const [busca, setBusca] = useState("");
  const [perfil, setPerfil] = useState<Perfil | "Todos">("Todos");
  const [status, setStatus] = useState<StatusCadastro | "Todos">("Todos");
  const [modal, setModal] = useState<Modal>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return lista.filter((u) => {
      const atendeBusca =
        termo === "" ||
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo);
      return (
        atendeBusca &&
        (perfil === "Todos" || u.perfil === perfil) &&
        (status === "Todos" || u.status === status)
      );
    });
  }, [lista, busca, perfil, status]);

  const alternarStatus = (usuario: Usuario) => {
    const novo: StatusCadastro = usuario.status === "Ativo" ? "Inativo" : "Ativo";
    setLista((atual) =>
      atual.map((u) => (u.id === usuario.id ? { ...u, status: novo } : u)),
    );
    setAviso(
      `${usuario.nome} aparece como ${novo === "Ativo" ? "ativo" : "inativo"} apenas nesta tela: a alteração não é gravada.`,
    );
  };

  const filtrando =
    busca !== "" || perfil !== "Todos" || status !== "Todos";

  return (
    <div className="space-y-4">
      {/* Busca e filtros */}
      <BarraFiltros>
        <CampoBusca
          id="busca-usuarios"
          rotulo="Buscar usuários"
          valor={busca}
          aoDigitar={setBusca}
          placeholder="Buscar por nome ou e-mail"
          aoLimpar={
            filtrando
              ? () => {
                  setBusca("");
                  setPerfil("Todos");
                  setStatus("Todos");
                }
              : undefined
          }
        />

        <GrupoFiltro
          rotulo="Perfil"
          opcoes={["Todos", ...PERFIS]}
          atual={perfil}
          aoEscolher={(v) => setPerfil(v as Perfil | "Todos")}
          cor={(v) =>
            v === "Todos" ? undefined : CORES_PERFIL[v as Perfil].ponto
          }
        />
        <GrupoFiltro
          rotulo="Status"
          opcoes={["Todos", "Ativo", "Inativo"]}
          atual={status}
          aoEscolher={(v) => setStatus(v as StatusCadastro | "Todos")}
          cor={(v) =>
            v === "Todos"
              ? undefined
              : v === "Ativo"
                ? "bg-emerald-500"
                : "bg-slate-400"
          }
        />
      </BarraFiltros>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ContadorResultados
          total={filtrados.length}
          totalGeral={lista.length}
          singular="usuário"
          plural="usuários"
        />
        <button
          type="button"
          onClick={() => setModal({ modo: "novo" })}
          className={botaoPrimario}
        >
          Novo Usuário
        </button>
      </div>

      {aviso && (
        <p
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {aviso}
        </p>
      )}

      {filtrados.length === 0 ? (
        <ListaVazia>Nenhum usuário encontrado com os filtros aplicados.</ListaVazia>
      ) : (
        <>
          {/* Tabela (tablet e computador) */}
          <Tabela
            acoes
            colunas={[
              "Nome",
              "E-mail",
              "Perfil",
              "Vínculo",
              "Status",
              "Último acesso",
            ]}
          >
            {filtrados.map((u) => (
              <tr key={u.id} className="hover:bg-background">
                <td className="px-4 py-3 font-medium">{u.nome}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <BadgePerfil valor={u.perfil} />
                </td>
                <td className="px-4 py-3">{descreverVinculo(u, opcoesDoNivel(VINCULO_DO_PERFIL[u.perfil], estrutura))}</td>
                <td className="px-4 py-3">
                  <BadgeCadastro valor={u.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {formatarUltimoAcesso(u.ultimoAcesso)}
                </td>
                <td className="px-4 py-3">
                  <Acoes
                    usuario={u}
                    aoEditar={() => setModal({ modo: "editar", usuario: u })}
                    aoAlternar={() => alternarStatus(u)}
                  />
                </td>
              </tr>
            ))}
          </Tabela>

          {/* Cartões (celular) */}
          <ul className="space-y-3 md:hidden">
            {filtrados.map((u) => (
              <CartaoLista
                key={u.id}
                titulo={u.nome}
                subtitulo={u.email}
                cracha={
                  <>
                    <BadgePerfil valor={u.perfil} />
                    <BadgeCadastro valor={u.status} />
                  </>
                }
                dados={[
                  { rotulo: "Vínculo", valor: descreverVinculo(u, opcoesDoNivel(VINCULO_DO_PERFIL[u.perfil], estrutura)) },
                  {
                    rotulo: "Último acesso",
                    valor: formatarUltimoAcesso(u.ultimoAcesso),
                  },
                ]}
                acoes={
                  <Acoes
                    usuario={u}
                    aoEditar={() => setModal({ modo: "editar", usuario: u })}
                    aoAlternar={() => alternarStatus(u)}
                  />
                }
              />
            ))}
          </ul>
        </>
      )}

      {modal && (
        <ModalUsuario
          estrutura={estrutura}
          usuario={modal.modo === "editar" ? modal.usuario : undefined}
          aoFechar={() => setModal(null)}
          aoSalvar={(nome) => {
            setModal(null);
            setAviso(
              `O cadastro de ${nome || "usuário"} não foi gravado: o banco de dados e as permissões serão implementados em etapa futura.`,
            );
          }}
        />
      )}
    </div>
  );
}

function Acoes({
  usuario,
  aoEditar,
  aoAlternar,
}: {
  usuario: Usuario;
  aoEditar: () => void;
  aoAlternar: () => void;
}) {
  const ativo = usuario.status === "Ativo";

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={aoEditar}
        className={`${botaoAcao} text-brand`}
      >
        Editar<span className="sr-only"> {usuario.nome}</span>
      </button>
      <button
        type="button"
        onClick={aoAlternar}
        className={`${botaoAcaoBase} border ${
          ativo
            ? "border-amber-300 text-amber-800 hover:bg-amber-50"
            : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        {ativo ? "Desativar" : "Ativar"}
        <span className="sr-only"> {usuario.nome}</span>
      </button>
    </div>
  );
}

function opcoesDoNivel(nivel: NivelVinculo, estrutura: Estrutura) {
  return nivel === "nenhum" ? [] : estrutura[nivel];
}

// Modal de cadastro/edição. O vínculo exibido acompanha o perfil escolhido.
function ModalUsuario({
  usuario,
  estrutura,
  aoFechar,
  aoSalvar,
}: {
  usuario?: Usuario;
  estrutura: Estrutura;
  aoFechar: () => void;
  aoSalvar: (nome: string) => void;
}) {
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [perfil, setPerfil] = useState<Perfil>(usuario?.perfil ?? "Pastor Local");
  const [vinculoId, setVinculoId] = useState(usuario?.vinculoId ?? "");

  const nivel = VINCULO_DO_PERFIL[perfil];
  const opcoes = opcoesDoNivel(nivel, estrutura);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onKeyDown={(e) => {
        if (e.key === "Escape") aoFechar();
      }}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={aoFechar}
        className="absolute inset-0 bg-black/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-usuario"
        className={`${cartao} relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-lg shadow-xl sm:max-w-lg sm:rounded-lg`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 id="titulo-modal-usuario" className={tituloSecao}>
              {usuario ? "Editar usuário" : "Novo usuário"}
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Formulário visual: nada é gravado.
            </p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-md px-2 py-1 text-sm text-muted hover:bg-background"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            aoSalvar(nome);
          }}
          className="space-y-5 px-5 py-5"
        >
          <div>
            <label htmlFor="nome" className={classeRotulo}>
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              maxLength={80}
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className={`${classeCampo} mt-1`}
            />
          </div>

          <div>
            <label htmlFor="email" className={classeRotulo}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={usuario?.email}
              placeholder="nome@exemplo.org.br"
              className={`${classeCampo} mt-1`}
            />
          </div>

          <div>
            <label htmlFor="perfil" className={classeRotulo}>
              Perfil
            </label>
            <select
              id="perfil"
              name="perfil"
              value={perfil}
              onChange={(e) => {
                setPerfil(e.target.value as Perfil);
                setVinculoId("");
              }}
              className={`${classeCampo} mt-1`}
            >
              {PERFIS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">
              As permissões de cada perfil ainda não estão definidas.
            </p>
          </div>

          <div>
            <label htmlFor="vinculo" className={classeRotulo}>
              Vínculo administrativo
            </label>
            {nivel === "nenhum" ? (
              <p className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted">
                Perfil de abrangência geral: sem vínculo a um registro
                específico.
              </p>
            ) : (
              <select
                id="vinculo"
                name="vinculo"
                required
                value={vinculoId}
                onChange={(e) => setVinculoId(e.target.value)}
                className={`${classeCampo} mt-1`}
              >
                <option value="" disabled>
                  Selecione {ROTULO_VINCULO[nivel].toLowerCase()}
                </option>
                {opcoes.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.codigo} · {o.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="status" className={classeRotulo}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={usuario?.status ?? "Ativo"}
              className={`${classeCampo} mt-1`}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={aoFechar}
              className={botaoSecundario}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={botaoPrimario}
            >
              {usuario ? "Salvar alterações" : "Salvar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
