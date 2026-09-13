# 08 — Roadmap

O roadmap poderá ser refinado ao longo do projeto. Alterações relevantes devem ser registradas em `09-DECISOES.md`.

**Situação atual:** Fase 1 em andamento — site base criado; interface do módulo Obras (Fase 2) antecipada com dados demonstrativos.

## Fase 1 — Fundação administrativa do sistema
- [x] Etapa 1 — Estrutura do projeto e documentação inicial
- [x] Git (GitHub pendente)
- [x] Aplicação web (Next.js + TypeScript + Tailwind)
- [x] Banco de dados — Neon PostgreSQL (conexão; sem tabelas ainda)
- [x] Autenticação (login e senha) — Clerk
- [ ] Usuários e perfis (interface pronta; permissões e gravação pendentes)
- [x] Cadastro de Região, Área, Polo e Igreja (banco: migração 002)
- [ ] Dashboard
- [ ] Histórico de desenvolvimento (manutenção contínua)
- [ ] Auditoria básica
- [x] Deploy — Vercel (https://sistema-obras-igrejas.vercel.app)

## Fase 2 — Solicitação de obras
Igreja registra solicitações (reforma, ampliação, construção, manutenção) com prioridade Emergencial, P1, P2 ou P3.

## Fase 3 — Fluxo de aprovações
Aprovações hierárquicas pela estrutura Região → Área → Polo → Igreja.

## Fase 4 — Orçamentos e Presbitério
Análise pelo Presbitério e gestão de orçamentos.

## Fase 5 — Execução em cinco fases
Acompanhamento da obra em cinco fases, com materiais e fotos.

## Fase 6 — Estoque
Controle de materiais e movimentações de estoque.

## Fase 7 — Financeiro
Controle financeiro das obras.

## Fase 8 — Relatórios, indicadores e evolução do sistema
Relatórios, indicadores e melhorias contínuas.
