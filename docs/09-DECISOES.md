# 09 — Decisões

Registro de decisões do projeto. **Nunca apague uma decisão.** Para reverter, altere o `Status` da antiga (ex.: `Substituída por DEC-NNN`) e registre uma nova.

## Formato
```
DEC-NNN
Data:
Título:
Contexto:
Decisão:
Motivo:
Impacto:
Status: (Ativa | Substituída por DEC-NNN | Cancelada)
```

---

## DEC-001
- **Data:** 2026-09-12
- **Título:** Raiz oficial do projeto
- **Contexto:** O projeto é novo e não deve reaproveitar nem tocar outros projetos existentes no computador.
- **Decisão:** A pasta `sistema-obras-igrejas/` é a raiz oficial do projeto. Todo arquivo, código, documentação e configuração fica dentro dela.
- **Motivo:** Isolamento total de outros projetos; organização clara.
- **Impacto:** Nenhum recurso de outros diretórios será consultado ou modificado.
- **Status:** Ativa

## DEC-002
- **Data:** 2026-09-12
- **Título:** Documentação como fundação, antes do código
- **Contexto:** Início da Fase 1. Muitas regras institucionais ainda não estão definidas.
- **Decisão:** A Etapa 1 cria apenas `CLAUDE.md`, `README.md` e `docs/` (11 documentos). Nenhum código, banco, autenticação ou deploy é feito nesta etapa. O que não é conhecido fica marcado como `PENDENTE DE DEFINIÇÃO`.
- **Motivo:** Evitar inventar regras administrativas e evitar retrabalho técnico.
- **Impacto:** Tecnologias (aplicação web, banco, hospedagem) serão decididas em etapa posterior, com registro aqui.
- **Status:** Ativa

## DEC-003
- **Data:** 2026-09-12
- **Título:** Registro obrigatório de decisões, histórico e pendências
- **Contexto:** Necessidade de rastreabilidade do próprio desenvolvimento.
- **Decisão:** Decisões vão em `09-DECISOES.md` (formato DEC-NNN); cada etapa concluída gera entrada em `10-HISTORICO-DESENVOLVIMENTO.md` (nunca reescrito retroativamente); dúvidas institucionais vão em `11-PENDENCIAS.md`.
- **Motivo:** Manter memória permanente do projeto e evitar mudanças silenciosas.
- **Impacto:** Toda etapa deve terminar atualizando esses documentos.
- **Status:** Ativa

## DEC-004
- **Data:** 2026-09-12
- **Título:** Idioma do projeto
- **Contexto:** Sistema para uso interno na Paraíba.
- **Decisão:** Documentação, interface, commits e nomes de negócio em português do Brasil.
- **Motivo:** Público interno brasileiro.
- **Impacto:** Nomes técnicos de código podem seguir convenções da tecnologia escolhida (a definir).
- **Status:** Ativa

## DEC-005
- **Data:** 2026-09-12
- **Título:** Stack da aplicação web
- **Contexto:** Início do site (Fase 1 — Etapa 2).
- **Decisão:** Next.js (App Router) + TypeScript + Tailwind CSS, versões estáveis atuais, com npm.
- **Motivo:** Solicitado pelo responsável do projeto; stack moderna, amplamente documentada e compatível com hospedagem na Vercel.
- **Impacto:** Banco, autenticação e hospedagem continuam a definir (PEN-019).
- **Status:** Ativa

## DEC-006
- **Data:** 2026-09-12
- **Título:** Supabase para autenticação (e, futuramente, banco de dados)
- **Contexto:** Necessidade de login privado com e-mail e senha, sem cadastro público.
- **Decisão:** Usar Supabase Auth via `@supabase/ssr` no Next.js (sessão em cookies, validada com `getUser()` no proxy e no layout). Usuários criados apenas pelo administrador no painel do Supabase. Chaves lidas de variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- **Motivo:** Solicitado pelo responsável; integra autenticação e banco Postgres em um só serviço.
- **Impacto:** O banco de dados das obras (etapa futura) deverá usar o mesmo projeto Supabase. Permissões por cargo ainda PENDENTE (PEN-002, PEN-011).
- **Status:** Substituída por DEC-007

## DEC-007
- **Data:** 2026-09-12
- **Título:** Infraestrutura: Vercel + Neon PostgreSQL + Clerk (substitui Supabase)
- **Contexto:** O responsável optou por não usar Supabase.
- **Decisão:** Hospedagem na Vercel; banco Neon PostgreSQL criado pela integração da Vercel; autenticação com Clerk (e-mail e senha, sem cadastro público). Todas as credenciais somente em variáveis de ambiente.
- **Motivo:** Escolha do responsável; integração nativa Vercel↔Neon simplifica configuração.
- **Impacto:** DEC-006 fica **Substituída por DEC-007**. Código Supabase removido. Tabelas das obras e permissões por cargo continuam pendentes.
- **Status:** Ativa

## DEC-008
- **Data:** 2026-09-12
- **Título:** Níveis exibidos na linha do tempo de aprovações da obra
- **Contexto:** Criação da tela de detalhes da obra (interface). A tela precisa exibir os níveis de aprovação, até então não informados.
- **Decisão:** A linha do tempo de aprovações exibe, nesta ordem: **Pastor Local → Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável COMBENS → Presbitério**. Cada nível pode representar quatro situações: **Aguardando, Aprovado, Reprovado, Correção solicitada**.
- **Motivo:** Sequência e situações informadas pelo responsável do projeto.
- **Impacto:** Atende parcialmente PEN-002 (nomes dos responsáveis) e PEN-004 (ordem dos níveis). Continuam **PENDENTES DE DEFINIÇÃO**: alçadas por valor ou prioridade, prazos, quem pode agir em cada nível, o que acontece após "Reprovado" ou "Correção solicitada" (PEN-005) e o significado da sigla COMBENS (PEN-021). Por ora, apenas interface: nenhuma regra é executada pelo sistema.
- **Status:** Ativa

## DEC-009
- **Data:** 2026-09-12
- **Título:** Perfis de acesso exibidos na tela de Usuários
- **Contexto:** Criação da interface de Usuários e Perfis.
- **Decisão:** A tela de Usuários trabalha com sete perfis, informados pelo responsável: **Administrador, Pastor Local, Coordenador de Polo, Coordenador de Área, Coordenador de Região, Responsável COMBENS e Presbitério**. Na interface, cada perfil é associado a um nível da estrutura: Pastor Local → Igreja; Coordenador de Polo → Polo; Coordenador de Área → Área; Coordenador de Região → Região; Administrador, Responsável COMBENS e Presbitério → abrangência geral (sem vínculo a um registro).
- **Motivo:** Lista de perfis informada pelo responsável; a associação com o nível da estrutura é consequência direta do nome de cada perfil e serve para a interface exibir o vínculo correto.
- **Impacto:** Apenas interface: **nenhuma permissão é aplicada** e não há relação com a autenticação (Clerk). Continuam **PENDENTES DE DEFINIÇÃO**: o que cada perfil pode ver e fazer (PEN-011), as atribuições de cada cargo (PEN-002), o papel do Responsável COMBENS (PEN-021) e se um usuário pode ter mais de um perfil ou mais de um vínculo (PEN-022). Observação de nomenclatura: DEC-008 registrou os níveis de aprovação como "Coordenador do Polo/da Área/da Região" e aqui os perfis foram informados como "Coordenador de Polo/de Área/de Região" — a forma oficial precisa ser confirmada (PEN-002).
- **Status:** Ativa
