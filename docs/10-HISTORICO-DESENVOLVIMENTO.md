# 10 — Histórico de Desenvolvimento

Registro cronológico das etapas. **Nunca apagar nem reescrever retroativamente.** Novas entradas são adicionadas ao final.

## Formato
```
Data:
Etapa:
Versão:
Realizado:
Decisões:
Pendências:
Próximo passo:
```

---

## Entrada 001
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Etapa 1 — Fundação documental e organizacional
- **Versão:** 0.0.1 (documentação; sem código)
- **Realizado:**
  - Criada a pasta raiz `sistema-obras-igrejas/`.
  - Criado `CLAUDE.md` (memória operacional do projeto).
  - Criado `README.md` inicial.
  - Criada a pasta `docs/` com os documentos 01 a 11.
  - Registrada a estrutura Região → Área → Polo → Igreja, os tipos de obra, as prioridades e a visão dos módulos futuros.
  - Definido o roadmap em 8 fases.
- **Decisões:** DEC-001 a DEC-004 (ver `09-DECISOES.md`).
- **Pendências:** ver `11-PENDENCIAS.md` (PEN-001 em diante).
- **Próximo passo:** Fase 1 — Etapa 2: inicializar Git na raiz do projeto e escolher/registrar as tecnologias (aplicação web, banco, autenticação, hospedagem), sem implementar funcionalidades.

## Entrada 002
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Etapa 2 — Base técnica do site
- **Versão:** 0.1.0
- **Realizado:**
  - Git inicializado na raiz do projeto.
  - Aplicação criada com Next.js 16, TypeScript e Tailwind CSS 4 (App Router, `src/`).
  - Página inicial institucional e responsiva com nome, subtítulo e versão.
- **Decisões:** DEC-005 (stack do site).
- **Pendências:** hospedagem/deploy ainda não configurados (PEN-019 parcialmente resolvida).
- **Próximo passo:** interface do módulo Obras.

## Entrada 003
- **Data:** 2026-09-12
- **Etapa:** Fase 2 (interface) — Módulo Obras com dados demonstrativos
- **Versão:** 0.2.0
- **Realizado:**
  - Layout administrativo com menu lateral (Dashboard, Obras, Histórico de Desenvolvimento), responsivo.
  - `/obras`: lista de solicitações de exemplo (igreja, tipo, prioridade, data, status) e botão "Nova Solicitação".
  - `/obras/nova`: formulário (igreja, tipo, prioridade, título, descrição, fotos) — sem gravação; exibe aviso de que o envio ainda não está habilitado.
  - `/obras/[id]`: detalhes, descrição, fotos (espaço reservado), status e linha do tempo preparada para as aprovações.
  - `/historico`: exibe o conteúdo de `docs/10-HISTORICO-DESENVOLVIMENTO.md`.
- **Decisões:** status provisórios da obra (Solicitada, Em análise, Aprovada, Em execução, Concluída) apenas para demonstração — os oficiais dependem de PEN-004.
- **Pendências:** nenhuma nova.
- **Próximo passo:** login e autenticação.

## Entrada 004
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Login e autenticação (Supabase Auth)
- **Versão:** 0.3.0
- **Realizado:**
  - Supabase Auth com e-mail e senha (`@supabase/ssr`): página `/login`, ações de entrar/sair, sessão em cookies renovada pelo `src/proxy.ts`.
  - Todas as páginas internas (grupo `src/app/(app)`) exigem usuário autenticado; não autenticado é redirecionado para `/login` (com retorno à página pedida); autenticado que acessa `/login` vai para o sistema.
  - Botão "Sair" e e-mail do usuário no menu lateral.
  - Sem cadastro público: usuários são criados pelo administrador no painel do Supabase.
  - Credenciais somente por variáveis de ambiente (`.env.example` documenta; `.env.local` não é versionado).
- **Decisões:** DEC-006 (Supabase como autenticação e futuro banco).
- **Pendências:** configurar o projeto no Supabase (URL, chave, desativar cadastro público, criar primeiro usuário) e o deploy na Vercel.
- **Próximo passo:** validar o login com o projeto Supabase real e publicar.

## Entrada 005
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Infraestrutura online (Vercel, Neon, Clerk)
- **Versão:** 0.3.0
- **Realizado:**
  - Supabase substituído: autenticação agora com **Clerk** (`@clerk/nextjs`, login em `/login`, rotas internas protegidas em `src/proxy.ts`, logout no menu lateral).
  - Banco **Neon PostgreSQL** conectado pela integração da Vercel (`DATABASE_URL`); conexão em `src/lib/db.ts` e verificação em `/api/saude`. Nenhuma tabela criada ainda.
  - Projeto vinculado à **Vercel** e publicado em https://sistema-obras-igrejas.vercel.app (domínio temporário).
  - Variáveis de ambiente configuradas na Vercel (Production/Preview/Development) e em `.env.local` (não versionado); `.env.example` documenta os nomes.
- **Decisões:** DEC-007 (substitui DEC-006).
- **Pendências:** GitHub ainda não conectado; no painel do Clerk, manter *Sign-up mode: Restricted* e desativar o login com Google se não for desejado; instância Clerk ainda em modo de desenvolvimento (chaves `pk_test`/`sk_test`).
- **Próximo passo:** criar o primeiro usuário no Clerk e validar o login em produção.
