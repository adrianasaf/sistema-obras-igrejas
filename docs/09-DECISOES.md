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
- **Status:** Substituída por DEC-013

## DEC-009
- **Data:** 2026-09-12
- **Título:** Perfis de acesso exibidos na tela de Usuários
- **Contexto:** Criação da interface de Usuários e Perfis.
- **Decisão:** A tela de Usuários trabalha com sete perfis, informados pelo responsável: **Administrador, Pastor Local, Coordenador de Polo, Coordenador de Área, Coordenador de Região, Responsável COMBENS e Presbitério**. Na interface, cada perfil é associado a um nível da estrutura: Pastor Local → Igreja; Coordenador de Polo → Polo; Coordenador de Área → Área; Coordenador de Região → Região; Administrador, Responsável COMBENS e Presbitério → abrangência geral (sem vínculo a um registro).
- **Motivo:** Lista de perfis informada pelo responsável; a associação com o nível da estrutura é consequência direta do nome de cada perfil e serve para a interface exibir o vínculo correto.
- **Impacto:** Apenas interface: **nenhuma permissão é aplicada** e não há relação com a autenticação (Clerk). Continuam **PENDENTES DE DEFINIÇÃO**: o que cada perfil pode ver e fazer (PEN-011), as atribuições de cada cargo (PEN-002), o papel do Responsável COMBENS (PEN-021) e se um usuário pode ter mais de um perfil ou mais de um vínculo (PEN-022). Observação de nomenclatura: DEC-008 registrou os níveis de aprovação como "Coordenador do Polo/da Área/da Região" e aqui os perfis foram informados como "Coordenador de Polo/de Área/de Região" — a forma oficial precisa ser confirmada (PEN-002).
- **Status:** Ativa

## DEC-010
- **Data:** 2026-09-12
- **Título:** Fluxo real de aprovação das solicitações de obras
- **Contexto:** Primeira funcionalidade com gravação em banco (Neon). Antes, as aprovações eram apenas demonstrativas.
- **Decisão:** O fluxo tem seis etapas, na ordem de DEC-008 (Pastor Local → Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável COMBENS → Presbitério). Em cada etapa a decisão pode ser **Aprovar**, **Reprovar** ou **Solicitar correção**, com as regras informadas pelo responsável:
  - a solicitação só avança para a próxima etapa após a aprovação da etapa atual;
  - **não é possível pular etapas** (validado também no banco, no `WHERE` da própria gravação);
  - **reprovação encerra o fluxo** (situação `Reprovada`);
  - **"Solicitar correção"** mantém a mesma etapa e **não encerra** o processo (situação `Em correção`); a solicitação volta a ser analisável após um **reenvio**, registrado no histórico;
  - toda decisão grava usuário, data/hora e comentário; o comentário é **obrigatório** em reprovação e pedido de correção;
  - o histórico nunca é alterado nem apagado: cada decisão é um registro novo (tabela `decisoes_aprovacao`);
  - após a aprovação do Presbitério, o fluxo fica `Aprovada` (todas as etapas aprovadas).
- **Motivo:** Regras informadas pelo responsável do projeto.
- **Impacto:** Duas tabelas novas (`fluxo_aprovacao`, `decisoes_aprovacao`), criadas pela migração `scripts/001-fluxo-aprovacao.sql`. As solicitações em si continuam vindo dos dados demonstrativos (`src/lib/obras-mock.ts`): o fluxo é identificado pelo número da solicitação, sem chave estrangeira, até as obras irem para o banco. **PENDENTE DE DEFINIÇÃO:** quais perfis podem decidir em cada etapa (PEN-023) — hoje qualquer usuário autenticado pode decidir, e fica registrado quem foi; quem pode reenviar após correção e se uma reprovação pode ser reaberta (PEN-024); prazos e alçadas (PEN-004). O status "Aprovada para execução" depende da etapa de orçamentos, ainda não implementada.
- **Status:** Ativa

## DEC-011
- **Data:** 2026-09-13
- **Título:** Perfis e permissões (perfil vindo do Clerk)
- **Contexto:** Implementação de perfis e permissões, sem alterar o banco de dados.
- **Decisão:** O perfil do usuário é lido do **Clerk**, em `publicMetadata.perfil` (definido no Clerk Dashboard). A estrutura central de permissões fica em `src/lib/permissoes.ts`, com áreas do sistema e a matriz perfil → áreas:
  - **Administrador:** todas as áreas.
  - **Pastor Local, Coordenador de Polo, Coordenador de Área, Coordenador de Região, Responsável COMBENS:** Dashboard e Obras/Solicitações.
  - **Presbitério:** Dashboard, Obras/Solicitações e Orçamentos.
  - **Aprovações:** cada perfil decide apenas a etapa do seu nível (Pastor Local 1, Coordenador de Polo 2, Coordenador da Área 3, Coordenador da Região 4, Responsável COMBENS 5, Presbitério 6); o Administrador pode decidir qualquer etapa.
  - **Usuário sem perfil definido** não acessa nenhuma área: é levado à página `/sem-permissao`.
  - O **Dashboard** é liberado a todos os perfis por ser a tela inicial após o login (decisão de navegação, não institucional — ver PEN-026).
- **Motivo:** Regras iniciais informadas pelo responsável do projeto.
- **Impacto:** A proteção é feita no servidor em três camadas: cada página interna chama `exigirAcesso(area)`; o proxy (`src/proxy.ts`) confere a área quando o perfil está publicado no token da sessão; e as Server Actions do fluxo de aprovação conferem perfil e etapa antes de gravar. Esconder itens de menu é apenas consequência, não a proteção. **PENDENTE DE DEFINIÇÃO:** vínculo por Região/Área/Polo/Igreja (PEN-025) — nesta etapa, um Coordenador de Polo pode decidir a etapa 2 de **qualquer** solicitação; e quem acessa Execução/Conclusão, Estoque, Histórico e Configurações além do Administrador (PEN-026). PEN-023 fica parcialmente resolvida (perfil ↔ etapa).
- **Status:** Ativa

## DEC-012
- **Data:** 2026-09-13
- **Título:** Estrutura administrativa no banco e migrações aplicadas pelo sistema
- **Contexto:** Início da migração dos dados de demonstração para o banco (Neon).
- **Decisão:** Regiões, áreas, polos e igrejas passam a viver no banco (migração 002), com chave estrangeira entre os níveis e código único por nível. As telas de Regiões, Áreas, Polos e Igrejas passam a ler e gravar de verdade. Os dados fictícios usados até agora foram carregados como **migração 003**, separada, para poderem ser removidos com um comando quando os dados reais entrarem. As migrações ficam versionadas em `src/lib/migracoes.ts` e são aplicadas pela tela **Configurações → Banco de dados** (só Administrador), com registro na tabela `migracoes` para não rodarem duas vezes.
- **Motivo:** Solicitado pelo responsável ("vamos deixar tudo organizado"), que confirmou que os dados atuais são de teste.
- **Impacto:** O id de cada registro é derivado do código (ex.: código `R01` → id `r-r01`), para as URLs continuarem legíveis. As obras continuam em dados de demonstração no código — a migração das obras é o passo seguinte, e só então o `fluxo_aprovacao` ganha chave estrangeira para a obra. A tela de Usuários continua com usuários fictícios, mas o vínculo administrativo já usa os registros reais do banco.
- **Status:** Ativa

## DEC-013
- **Data:** 2026-09-13
- **Título:** Correção do fluxo de aprovação: quatro etapas internas e resultado do SGI registrado à parte
- **Contexto:** Limpeza/correção institucional confirmada com o responsável. O fluxo implementado em DEC-008 e DEC-010 tinha seis etapas, com "Pastor Local" como primeira e "Presbitério" como última — ambas incorretas.
- **Decisão:**
  - O fluxo interno de aprovação tem **quatro etapas**: **Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável COMBENS**.
  - **Pastor Local não é etapa de aprovação:** ele solicita, ou delega a solicitação a outra pessoa. Em qualquer caso a solicitação segue direto para o Coordenador do Polo, sem aprovação do pastor.
  - **Presbitério não decide dentro do sistema.** Depois da aprovação da CONBENS, alguém da equipe da CONBENS leva o pedido ao **SGI** (sistema externo, oficial da Igreja Cristã Maranata). O resultado (aprovado ou reprovado, e o valor aprovado quando aprovado) é **registrado manualmente** no sistema, em campo próprio — não como etapa do fluxo.
  - Depois da aprovação da CONBENS, é a **igreja solicitante** (não a CONBENS) que monta o orçamento de material (3 cotações), o de mão de obra (3 cotações) e o **Croqui** da obra. O módulo de Orçamento será feito em etapa futura; neste bloco o fluxo apenas fica pronto para receber isso.
  - A **prioridade** (Emergencial, P1, P2, P3) é definida pelo **pastor responsável da CONBENS**, não por quem abre a solicitação. O campo saiu do formulário de Nova Solicitação.
  - **CONBENS = Comissão de Bens e Construções** (resolve PEN-021).
- **Motivo:** Correção informada e confirmada pelo responsável do projeto.
- **Impacto:** DEC-008 fica **Substituída por DEC-013** (a sequência de seis níveis não existe). DEC-010 permanece Ativa quanto às regras do fluxo (avanço só após aprovação, reprovação encerra, correção devolve sem encerrar, histórico preservado, sem pular etapas), mas passa a valer sobre quatro etapas. DEC-011 continua Ativa com a renumeração das etapas por perfil. No banco, a migração 004 ajusta as restrições de etapa (1..4) e acrescenta as colunas do resultado do SGI; os registros de teste do fluxo são apagados, porque a numeração das etapas mudou de significado. Resolve PEN-003, PEN-004, PEN-007, PEN-008 e PEN-021. Continuam abertas PEN-006 (significado operacional de cada prioridade) e PEN-009 (nome e conteúdo das cinco fases de execução).
- **Status:** Ativa
