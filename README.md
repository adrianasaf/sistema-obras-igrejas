# Sistema de Gestão de Obras das Igrejas

> Nome provisório. Projeto para gestão de obras das igrejas na Paraíba.

## Objetivo
Centralizar solicitações, aprovações, orçamentos, execução, materiais, estoque, financeiro, fotos, relatórios e auditoria das obras (reformas, ampliações, construções e manutenções) das igrejas, seguindo a estrutura administrativa **Região → Área → Polo → Igreja**.

O sistema será **privado** e exigirá login e senha.

## Status atual
**Fase 1 em andamento.**
Site em Next.js + TypeScript + Tailwind CSS com login (Supabase Auth) e a interface do módulo Obras (dados demonstrativos). Ainda **não há** banco de dados das obras nem permissões por cargo.

## Antes de trabalhar
Leia **[CLAUDE.md](CLAUDE.md)** — regras operacionais permanentes do projeto (o que consultar, onde registrar decisões e pendências, o que não fazer).

## Estrutura da documentação
| Arquivo | Conteúdo |
|---|---|
| [docs/01-VISAO-GERAL.md](docs/01-VISAO-GERAL.md) | Objetivo, público, problema, módulos, estrutura administrativa |
| [docs/02-REQUISITOS.md](docs/02-REQUISITOS.md) | Requisitos funcionais e não funcionais |
| [docs/03-FLUXO-DA-OBRA.md](docs/03-FLUXO-DA-OBRA.md) | Caminho da obra: solicitação → aprovações → Presbitério → orçamento → execução |
| [docs/04-PERFIS-E-PERMISSOES.md](docs/04-PERFIS-E-PERMISSOES.md) | Atores, perfis e permissões |
| [docs/05-REGRAS-DE-NEGOCIO.md](docs/05-REGRAS-DE-NEGOCIO.md) | Regras de negócio conhecidas |
| [docs/06-BANCO-DE-DADOS.md](docs/06-BANCO-DE-DADOS.md) | Entidades conceituais (sem tecnologia definida) |
| [docs/07-TELAS.md](docs/07-TELAS.md) | Telas previstas |
| [docs/08-ROADMAP.md](docs/08-ROADMAP.md) | Fases do projeto |
| [docs/09-DECISOES.md](docs/09-DECISOES.md) | Decisões registradas (DEC-NNN) |
| [docs/10-HISTORICO-DESENVOLVIMENTO.md](docs/10-HISTORICO-DESENVOLVIMENTO.md) | Histórico das etapas |
| [docs/11-PENDENCIAS.md](docs/11-PENDENCIAS.md) | Questões ainda não definidas (PEN-NNN) |

## Roadmap resumido
1. **Fase 1** — Fundação administrativa (estrutura, Git, app web, banco, autenticação, perfis, Região/Área/Polo/Igreja, dashboard, auditoria básica, deploy)
2. **Fase 2** — Solicitação de obras
3. **Fase 3** — Fluxo de aprovações
4. **Fase 4** — Orçamentos e Presbitério
5. **Fase 5** — Execução em cinco fases
6. **Fase 6** — Estoque
7. **Fase 7** — Financeiro
8. **Fase 8** — Relatórios, indicadores e evolução do sistema

## Executar localmente
1. Copie `.env.example` para `.env.local` e preencha com a URL e a chave *publishable* do projeto Supabase (nunca versione o `.env.local`).
2. No painel do Supabase, em Authentication → Sign In / Providers, desative **Allow new users to sign up** (não há cadastro público) e crie os usuários em Authentication → Users.
3. Rode:
```bash
npm install
npm run dev
```
Acesse http://localhost:3000.
