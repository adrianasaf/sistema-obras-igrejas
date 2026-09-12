"use client";

import { useMemo, useState } from "react";
import { BadgeCadastro, BadgePerfil } from "@/components/badges";
import { CORES_PERFIL } from "@/lib/cores";
import {
  AREAS,
  IGREJAS,
  POLOS,
  REGIOES,
  type StatusCadastro,
} from "@/lib/estrutura-mock";
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

const classeCampo =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none";

type Modal = { modo: "novo" } | { modo: "editar"; usuario: Usuario } | null;

// Filtros, busca e ativar/desativar funcionam apenas nesta tela, sobre os
// dados demonstrativos: nada é gravado e nenhuma permissão é aplicada.
export function PainelUsuarios({ usuarios }: { usuarios: Usuario[] }) {
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
      <div className="space-y-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="busca-usuarios" className="sr-only">
            Buscar usuários
          </label>
          <div className="relative flex-1">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted"
            >
              ⌕
            </span>
            <input
              id="busca-usuarios"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou e-mail"
              className={`${classeCampo} pr-3 pl-8`}
            />
          </div>
          {filtrando && (
            <button
              type="button"
              onClick={() => {
                setBusca("");
                setPerfil("Todos");
                setStatus("Todos");
              }}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-background"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <Grupo
          rotulo="Perfil"
          opcoes={["Todos", ...PERFIS]}
          atual={perfil}
          aoEscolher={(v) => setPerfil(v as Perfil | "Todos")}
          cor={(v) => (v === "Todos" ? undefined : CORES_PERFIL[v as Perfil].ponto)}
        />
        <Grupo
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
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted" role="status">
          {filtrados.length} de {lista.length}{" "}
          {lista.length === 1 ? "usuário" : "usuários"}
        </p>
        <button
          type="button"
          onClick={() => setModal({ modo: "novo" })}
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
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
        <p className="rounded-lg border border-border bg-surface px-5 py-8 text-center text-sm text-muted">
          Nenhum usuário encontrado com os filtros aplicados.
        </p>
      ) : (
        <>
          {/* Tabela (tablet e computador) */}
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
            <table className="w-full text-sm">
              <thead className="bg-background text-left text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Perfil</th>
                  <th className="px-4 py-3 font-medium">Vínculo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Último acesso</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map((u) => (
                  <tr key={u.id} className="hover:bg-background">
                    <td className="px-4 py-3 font-medium">{u.nome}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <BadgePerfil valor={u.perfil} />
                    </td>
                    <td className="px-4 py-3">{descreverVinculo(u)}</td>
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
              </tbody>
            </table>
          </div>

          {/* Cartões (celular) */}
          <ul className="space-y-3 md:hidden">
            {filtrados.map((u) => (
              <li
                key={u.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-brand">{u.nome}</p>
                    <p className="truncate text-xs text-muted">{u.email}</p>
                  </div>
                  <BadgeCadastro valor={u.status} />
                </div>
                <div className="mt-3">
                  <BadgePerfil valor={u.perfil} />
                </div>
                <dl className="mt-3 space-y-2 text-xs">
                  <div>
                    <dt className="text-muted">Vínculo</dt>
                    <dd className="font-medium">{descreverVinculo(u)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Último acesso</dt>
                    <dd className="font-medium">
                      {formatarUltimoAcesso(u.ultimoAcesso)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <Acoes
                    usuario={u}
                    aoEditar={() => setModal({ modo: "editar", usuario: u })}
                    aoAlternar={() => alternarStatus(u)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {modal && (
        <ModalUsuario
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
  const botao =
    "inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap";
  const ativo = usuario.status === "Ativo";

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={aoEditar}
        className={`${botao} border-border text-brand hover:bg-background`}
      >
        Editar<span className="sr-only"> {usuario.nome}</span>
      </button>
      <button
        type="button"
        onClick={aoAlternar}
        className={`${botao} ${
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

function Grupo({
  rotulo,
  opcoes,
  atual,
  aoEscolher,
  cor,
}: {
  rotulo: string;
  opcoes: readonly string[];
  atual: string;
  aoEscolher: (valor: string) => void;
  cor: (valor: string) => string | undefined;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-xs font-medium text-muted sm:w-16">
        {rotulo}
      </span>
      <div
        role="group"
        aria-label={`Filtrar por ${rotulo.toLowerCase()}`}
        className="flex flex-wrap gap-2"
      >
        {opcoes.map((opcao) => {
          const ativa = opcao === atual;
          const ponto = cor(opcao);
          return (
            <button
              key={opcao}
              type="button"
              aria-pressed={ativa}
              onClick={() => aoEscolher(opcao)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                ativa
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {ponto && (
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${ativa ? "bg-white" : ponto}`}
                />
              )}
              {opcao}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function opcoesDoNivel(nivel: NivelVinculo) {
  if (nivel === "regiao") return REGIOES;
  if (nivel === "area") return AREAS;
  if (nivel === "polo") return POLOS;
  if (nivel === "igreja") return IGREJAS;
  return [];
}

// Modal de cadastro/edição. O vínculo exibido acompanha o perfil escolhido.
function ModalUsuario({
  usuario,
  aoFechar,
  aoSalvar,
}: {
  usuario?: Usuario;
  aoFechar: () => void;
  aoSalvar: (nome: string) => void;
}) {
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [perfil, setPerfil] = useState<Perfil>(usuario?.perfil ?? "Pastor Local");
  const [vinculoId, setVinculoId] = useState(usuario?.vinculoId ?? "");

  const nivel = VINCULO_DO_PERFIL[perfil];
  const opcoes = opcoesDoNivel(nivel);

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
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-lg border border-border bg-surface shadow-xl sm:max-w-lg sm:rounded-lg"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2
              id="titulo-modal-usuario"
              className="font-semibold text-brand"
            >
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
            <label htmlFor="nome" className="block text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              maxLength={80}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className={`${classeCampo} mt-1`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
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
            <label htmlFor="perfil" className="block text-sm font-medium">
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
            <label htmlFor="vinculo" className="block text-sm font-medium">
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
            <label htmlFor="status" className="block text-sm font-medium">
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
              className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
            >
              {usuario ? "Salvar alterações" : "Salvar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
