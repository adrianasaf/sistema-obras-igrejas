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

## Entrada 006
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Interface principal (menu lateral, barra superior e dashboard)
- **Versão:** 0.3.0
- **Realizado:**
  - Nova estrutura visual administrativa em `src/components/app-shell.tsx` (substitui `src/components/sidebar.tsx`): menu lateral fixo em tablet e computador, sobreposto em celular.
  - Menu lateral: Dashboard, Obras, Igrejas, Estoque e Histórico de Desenvolvimento.
  - Barra superior fixa com o nome do sistema, o usuário logado (nome e e-mail, via Clerk) e a opção "Sair".
  - Dashboard reformulado com oito cartões de resumo (Obras totais, Emergenciais, Prioridade 1, Prioridade 2, Prioridade 3, Em análise, Em execução, Concluídas) e as seções "Obras recentes", "Aguardando aprovação" e "Obras em andamento".
  - Paleta única de prioridades e status em `src/lib/cores.ts`, usada pelos crachás e pelos cartões, para que a mesma prioridade tenha sempre a mesma cor.
  - Telas `/igrejas` e `/estoque` criadas apenas como espaço na navegação (componente `modulo-previsto.tsx`), sem dados e sem regras.
  - Dados demonstrativos de `src/lib/obras-mock.ts` ampliados (13 obras fictícias) para os indicadores terem números visíveis.
- **Decisões:** nenhuma nova decisão institucional. Os indicadores são calculados sobre os dados demonstrativos; a apuração no banco fica para etapa futura.
- **Pendências:** nenhuma nova. O agrupamento "Aguardando aprovação" usa os status provisórios (Solicitada e Em análise) e será revisto quando o fluxo de aprovação for definido (PEN-004).
- **Próximo passo:** cadastro de Região, Área, Polo e Igreja.

## Entrada 007
- **Data:** 2026-09-12
- **Etapa:** Interface — tela de detalhes da obra
- **Versão:** 0.3.0
- **Realizado:**
  - `/obras/[id]` reformulada: cabeçalho com igreja, título, tipo, prioridade, status atual e data da solicitação.
  - Cinco abas acessíveis (`src/components/abas.tsx`, navegação por teclado e rolagem horizontal em telas estreitas): Visão Geral, Aprovações, Orçamentos, Execução e Conclusão.
  - **Visão Geral:** descrição da necessidade, fotos da situação atual (espaço reservado) e informações principais da solicitação.
  - **Aprovações:** linha do tempo com Pastor Local, Coordenador do Polo, Coordenador da Área, Coordenador da Região, Responsável COMBENS e Presbitério, com as situações Aguardando, Aprovado, Reprovado e Correção solicitada (cores distintas).
  - **Orçamentos:** estrutura visual de três orçamentos para Material e três para Mão de obra (fornecedor/prestador, valor, data, anexo, situação).
  - **Execução:** Fase 1 a Fase 5 com percentual, situação e barra de progresso, além do andamento geral.
  - **Conclusão:** áreas preparadas para fotos finais, resumo da obra, valor final e data de conclusão.
  - Dados demonstrativos em `src/lib/obra-detalhe-mock.ts`; cores das situações em `src/lib/cores.ts`; galeria reutilizável em `src/components/galeria-fotos.tsx`.
- **Decisões:** DEC-008 (níveis e situações da linha do tempo de aprovações, informados pelo responsável).
- **Pendências:** PEN-002 e PEN-004 passam a **Parcial**; nova PEN-021 (significado de COMBENS e atribuições do responsável). Alçadas, prazos, efeitos de reprovação (PEN-005), conteúdo das cinco fases (PEN-009) e critérios de conclusão (PEN-010) continuam abertos.
- **Próximo passo:** aguardar definição do responsável; nenhuma lógica de banco foi implementada nesta etapa.

## Entrada 008
- **Data:** 2026-09-12
- **Etapa:** Interface — lista de obras, solicitação, detalhes, estoque e dashboard
- **Versão:** 0.3.0
- **Realizado:**
  - **Lista de obras (`/obras`):** tabela em tablet/computador e cartões em celular, com igreja, tipo, prioridade, status, data, valor estimado e botão "Abrir detalhes"; filtros visuais por prioridade e por status e busca por igreja, título, tipo ou número. Filtro e busca atuam somente sobre os dados demonstrativos carregados na tela.
  - **Nova solicitação (`/obras/nova`):** acrescentados os campos "Valor estimado de material" e "Valor estimado de mão de obra" e o botão "Salvar rascunho" (ao lado de "Enviar solicitação"). Nenhum dos dois grava: ambos exibem aviso.
  - **Detalhes da obra (`/obras/[id]`):** abas mantidas; aba Orçamentos passou a ter botão de seleção por orçamento (visual) e resumo com Total material, Total mão de obra, Total estimado e Valor aprovado; aba Execução passou a mostrar, por fase, descrição resumida, materiais utilizados e custo da fase, além do custo executado no andamento geral; Visão Geral mostra os valores estimados e o valor aprovado.
  - **Estoque (`/estoque`):** tela substituiu o espaço reservado — material, categoria, unidade, quantidade atual, estoque mínimo e status (Normal, Abaixo do mínimo, Em falta), com resumo e botões visuais Entrada, Saída e Novo material (exibem aviso; não movimentam nada).
  - **Dashboard:** acrescentados os cartões "Valor total estimado" e "Valor total aprovado" aos oito indicadores já existentes.
  - Novos módulos de dados demonstrativos: `src/lib/estoque-mock.ts` e valores por obra em `src/lib/obras-mock.ts` (`valoresDemonstrativos`, derivados do número da solicitação); cores de orçamento e estoque em `src/lib/cores.ts`.
- **Decisões:** nenhuma nova. Os valores, custos por fase, materiais por fase e saldos de estoque são fictícios e não seguem nenhuma regra institucional.
- **Pendências:** nenhuma nova. Seguem abertas PEN-008 (quem elabora e aprova orçamentos), PEN-009 (conteúdo das cinco fases), PEN-014 (regras de estoque) e PEN-015 (regras financeiras).
- **Próximo passo:** aguardar definição do responsável; nada foi ligado ao banco de dados.

## Entrada 009
- **Data:** 2026-09-12
- **Etapa:** Interface — estrutura administrativa (Regiões, Áreas, Polos e Igrejas)
- **Versão:** 0.3.0
- **Realizado:**
  - Menu lateral reorganizado em grupos, com a seção **Estrutura administrativa** (Regiões, Áreas, Polos, Igrejas).
  - **Regiões (`/regioes`):** lista com código, nome, coordenador, quantidade de áreas e status, botão "Nova Região" e ações Visualizar/Editar. Visualização (`/regioes/[id]`) mostra os dados e as áreas vinculadas.
  - **Áreas (`/areas`):** lista com código, nome, região vinculada, quantidade de polos e status; botão "Nova Área"; visualização com os polos vinculados.
  - **Polos (`/polos`):** lista com código, nome, área vinculada, região, quantidade de igrejas e status; botão "Novo Polo"; visualização com as igrejas vinculadas.
  - **Igrejas (`/igrejas`):** substituiu o espaço reservado — lista com código, nome, polo, área, região, cidade e status; botão "Nova Igreja"; visualização com os dados e as obras demonstrativas da igreja.
  - Formulários visuais de cadastro e edição para os quatro níveis (`src/components/estrutura/formularios.tsx`), com seleção do nível superior, código, status e responsável. Nenhum grava: ao salvar, exibem aviso.
  - Componentes comuns em `src/components/estrutura/comuns.tsx` e `src/components/formulario-cadastro.tsx`; dados demonstrativos em `src/lib/estrutura-mock.ts` (4 regiões, 7 áreas, 12 polos, 16 igrejas, com cidades da Paraíba).
  - Componente `modulo-previsto.tsx` removido: não havia mais tela usando o espaço reservado.
- **Decisões:** nenhuma nova. Os nomes dos coordenadores seguem os níveis já registrados em DEC-008; códigos (R01, A01, P01, IG001) são apenas de exemplo.
- **Pendências:** nenhuma nova. Seguem abertas PEN-002 (atribuições de cada cargo) e PEN-011 (escopo de visibilidade por usuário); os campos oficiais de cada cadastro também continuam a definir.
- **Próximo passo:** aguardar definição do responsável; nada foi ligado ao banco de dados.

## Entrada 010
- **Data:** 2026-09-12
- **Etapa:** Interface — Histórico de Desenvolvimento (linha do tempo de versões)
- **Versão:** 0.3.0
- **Realizado:**
  - `/historico` passou a apresentar uma linha do tempo de versões do sistema: versão, data, título da atualização, tipo da alteração e resumo das mudanças (com os itens de cada versão).
  - Cinco tipos com cores distintas: Nova funcionalidade (verde), Melhoria (azul), Correção (âmbar), Segurança (vermelho) e Regra de negócio (violeta), definidos em `src/lib/cores.ts` e exibidos como legenda no topo da tela.
  - Cartão de resumo com a versão mais recente, a data e a quantidade de versões.
  - Dados demonstrativos (nove versões fictícias, de 0.9.0 a 1.2.0) em `src/lib/historico-mock.ts`.
  - **Preservado:** o documento real deste histórico (`docs/10-HISTORICO-DESENVOLVIMENTO.md`) continua sendo exibido na mesma página, agora dentro de uma seção recolhível ao final, com o mesmo renderizador de Markdown de antes. A tela avisa que as versões da linha do tempo são fictícias e que o registro real é o documento.
  - O item "Histórico de Desenvolvimento" já existia no menu lateral; nenhuma outra tela foi alterada.
- **Decisões:** nenhuma nova. A numeração de versões da linha do tempo é fictícia e não corresponde à versão real do projeto (`package.json`).
- **Pendências:** nenhuma nova.
- **Próximo passo:** aguardar definição do responsável.

## Entrada 011
- **Data:** 2026-09-12
- **Etapa:** Interface — Usuários e perfis
- **Versão:** 0.3.0
- **Realizado:**
  - Item **Usuários** adicionado ao menu lateral (terceiro grupo, antes de Estoque).
  - `/usuarios`: lista com nome, e-mail, perfil, vínculo administrativo, status, último acesso e ações. Tabela em tablet/computador e cartões em celular.
  - Filtros por perfil (sete perfis) e por status, busca por nome ou e-mail, contador de resultados e "Limpar filtros".
  - Botão **Novo Usuário** e ação **Editar** abrem o mesmo modal de cadastro, com nome, e-mail, perfil, vínculo administrativo (o campo muda conforme o perfil: região, área, polo, igreja ou "abrangência geral") e status. Ao salvar, exibe aviso de que nada foi gravado.
  - Ação **Ativar/Desativar** altera o status apenas na tela, com aviso de que a alteração não é gravada.
  - Cores por perfil em `src/lib/cores.ts` e dados demonstrativos (13 usuários fictícios) em `src/lib/usuarios-mock.ts`, vinculados aos registros da estrutura administrativa.
  - Nenhuma outra tela foi alterada: além dos arquivos novos, apenas o menu (`app-shell.tsx`) e os acréscimos em `badges.tsx` e `cores.ts`.
- **Decisões:** DEC-009 (perfis informados pelo responsável e nível de estrutura associado a cada um, apenas para a interface).
- **Pendências:** nova PEN-022 (mais de um perfil/vínculo por usuário e forma oficial dos nomes dos cargos). Seguem abertas PEN-002, PEN-011 e PEN-021. **Nenhuma permissão é aplicada** e não há relação com a autenticação do Clerk.
- **Próximo passo:** aguardar definição do responsável.

## Entrada 012
- **Data:** 2026-09-12
- **Etapa:** Revisão final da interface e tela de Configurações
- **Versão:** 0.3.0
- **Realizado:**
  - **Padronização:** criado `src/lib/ui.ts` com as classes de botão (primário, secundário, contorno e ação), campo, rótulo, cartão e títulos, aplicadas em todas as telas — antes cada página repetia o mesmo estilo em texto.
  - **Componentes comuns:** `cabecalho-pagina.tsx` (título, descrição, ação principal e link "voltar"), `tabela.tsx` (tabela padrão, cartão de lista para celular e estado vazio) e `filtros.tsx` (busca, pílulas de filtro e contador). As listas de Obras, Usuários, Estoque, Regiões, Áreas, Polos e Igrejas passaram a usar os mesmos componentes; o filtro que estava duplicado em Obras e Usuários virou um só.
  - **Cores de prioridade e status revisadas:** a Prioridade 3 passou de azul para neutro e o status "Solicitada" assumiu o azul-claro; "Aprovada" passou para verde-azulado, para não se confundir com "Concluída". As duas escalas agora não compartilham cor, o que evita leitura ambígua quando prioridade e status aparecem na mesma linha.
  - **Cabeçalhos e espaçamentos:** todas as páginas usam o mesmo cabeçalho, o mesmo espaçamento vertical (`space-y-6`) e o mesmo padrão de link "← Voltar". O Dashboard, que usava espaçamento maior, foi alinhado ao restante.
  - **Menu:** grupos mantidos, com **Configurações** acrescentado ao final; a navegação passou a rolar sozinha quando a lista de itens não couber na altura da tela, sem empurrar a versão do rodapé.
  - **Correções de detalhe:** botões que combinavam classes de borda conflitantes (Entrada/Saída do Estoque, Ativar/Desativar de Usuários, seleção de orçamento e "Editar" dos cadastros) foram refeitos sobre uma base sem cor, garantindo a borda correta; cartões de celular voltaram a mostrar os crachás de prioridade/status (Obras) e de perfil (Usuários); valores longos nos cartões passaram a quebrar linha em vez de estourar a largura.
  - **Nova tela `/configuracoes`:** nome do sistema, descrição, versão atual, ambiente, autenticação e banco; preferências de interface (densidade das listas, itens por página, tela inicial, ordenação padrão e duas opções de exibição), todas apenas visuais e com aviso de que não são salvas; e informações institucionais, com os campos ainda não definidos marcados como **PENDENTE DE DEFINIÇÃO** (nome oficial da instituição, responsável pelo sistema e contato de suporte).
  - **Usuários e perfis revisada** sem novas funcionalidades: mesmos componentes de lista, filtros e botões das outras telas, título do modal padronizado e foco inicial no primeiro campo (o que também faz o Esc fechar o modal).
  - Nenhuma regra de negócio, fluxo, foto, banco, Clerk ou infraestrutura foi alterada; nenhuma tela foi refeita e nenhum módulo novo foi criado.
- **Decisões:** nenhuma decisão institucional nova. A escala de cores descrita acima é convenção de interface e está documentada em `src/lib/cores.ts` e em `docs/07-TELAS.md`.
- **Pendências:** nenhuma nova. As informações institucionais da tela de Configurações dependem de PEN-001 (nome oficial) e das definições do responsável.
- **Próximo passo:** interface concluída nesta etapa; a evolução seguinte depende de definição do responsável (banco de dados e regras).

## Entrada 013
- **Data:** 2026-09-12
- **Etapa:** Fluxo real de aprovação das solicitações (primeira funcionalidade com banco)
- **Versão:** 0.3.0
- **Realizado:**
  - Migração `scripts/001-fluxo-aprovacao.sql` com as tabelas `fluxo_aprovacao` (estado) e `decisoes_aprovacao` (histórico), documentadas em `docs/06-BANCO-DE-DADOS.md`.
  - Regras do fluxo em `src/lib/aprovacao.ts` (puras, sem banco) e acesso ao banco em `src/lib/fluxo-aprovacao.ts`: seis etapas na ordem de DEC-008, decisões Aprovar/Reprovar/Solicitar correção, avanço só após aprovação, reprovação encerra, correção mantém a etapa com reenvio, e bloqueio de pulo de etapa.
  - Server Actions em `src/app/(app)/obras/[id]/acoes.ts`: identificam o usuário pela sessão do Clerk, exigem comentário em reprovação e correção, e revalidam a página após gravar.
  - Aba **Aprovações** (tela já existente) agora mostra dados reais: situação atual, etapa X de 6, painel de decisão da etapa atual (ou de reenvio, quando há correção) e linha do tempo com todas as decisões — usuário, data/hora e comentário.
  - Cabeçalho da obra passou a exibir o status real do fluxo ("Aguardando Coordenador da Área", "Correção solicitada", "Reprovada", "Aprovada em todas as etapas").
  - As aprovações demonstrativas foram removidas de `src/lib/obra-detalhe-mock.ts` (orçamentos, execução e conclusão continuam demonstrativos). Se o banco não responder, a aba avisa e as demais abas continuam funcionando.
- **Testes executados:** Postgres 16 local (o ambiente desta sessão não alcança o Neon: a política de rede bloqueia `*.neon.tech`).
  - Migração aplicada duas vezes: idempotente.
  - Regras puras: 19 verificações, todas passaram (fluxo completo até o Presbitério, bloqueio de pulo de etapa, reprovação encerrando, correção mantendo a etapa, reenvio, rótulos de status).
  - Banco, com o mesmo SQL guardado que a aplicação executa: fluxo completo das seis etapas até `Aprovada` com 6 registros no histórico; nova decisão após conclusão rejeitada; pulo da etapa 2 para a 4 rejeitado; reprovação encerrando e bloqueando decisões seguintes; correção bloqueando decisão até o reenvio e retomando na mesma etapa; histórico preservado com correção e reenvio; restrições rejeitando decisão inválida, etapa fora de 1..6 e situação inválida.
  - **Não testado aqui:** o caminho pela interface em produção (exige as chaves do Clerk, ausentes nesta sessão).
- **Decisões:** DEC-010.
- **Pendências:** novas PEN-023 (quais perfis decidem em cada etapa) e PEN-024 (quem reenvia após correção; reabertura de reprovação). O status "Aprovada para execução" depende da etapa de orçamentos, ainda não implementada.
- **Próximo passo:** aplicar a migração no Neon e validar o fluxo em produção; orçamentos e decisão do Presbitério sobre valores continuam pendentes.

## Entrada 014
- **Data:** 2026-09-13
- **Etapa:** Perfis e permissões (Clerk)
- **Versão:** 0.3.0
- **Realizado:**
  - Estrutura central em `src/lib/permissoes.ts`: sete perfis, nove áreas do sistema, matriz perfil → áreas, mapeamento rota → área e a etapa do fluxo que cada perfil decide. Módulo puro, sem banco.
  - `src/lib/sessao.ts` lê o perfil do Clerk (`publicMetadata.perfil`) e expõe as guardas `exigirPerfil` e `exigirAcesso(area)`.
  - **Proteção em três camadas, toda no servidor:** cada uma das 24 páginas internas chama `exigirAcesso`; o proxy (`src/proxy.ts`) confere a área da rota quando o perfil está no token da sessão; e as Server Actions do fluxo de aprovação conferem perfil e etapa antes de gravar. Digitar a URL direto não dá acesso.
  - Menu lateral mostra somente as áreas permitidas (grupos vazios desaparecem) e o perfil aparece no menu da conta.
  - Aba **Orçamentos** só aparece para Presbitério e Administrador; **Execução** e **Conclusão**, por ora, só para Administrador (PEN-026). Na aba Aprovações, quem não é o perfil da etapa atual vê o andamento e um aviso, sem o painel de decisão.
  - Nova página `/sem-permissao` ("Acesso não autorizado"), acessível a qualquer usuário autenticado, informando o perfil atual e a área negada — ou que o usuário ainda não tem perfil.
  - Os perfis de `src/lib/usuarios-mock.ts` passaram a vir da estrutura central (fonte única).
  - Nenhuma alteração no banco, nenhuma migração, nenhum SQL executado. Nenhum desenho de tela alterado.
- **Testes executados:** 71 verificações da matriz de permissões (`node --experimental-strip-types`), todas passaram: mapeamento de rotas, rota desconhecida negada até para Administrador, acesso completo do Administrador, bloqueio de Usuários/Estrutura/Estoque para os demais perfis, Orçamentos só para Presbitério e Administrador, cada perfil decidindo apenas a etapa do seu nível (e nenhuma outra), e usuário sem perfil sem acesso a nada. Build, tipos e lint limpos. **Não testado aqui:** o comportamento em produção com usuários reais do Clerk (esta sessão não tem as chaves).
- **Decisões:** DEC-011. PEN-023 passa a **Parcial**.
- **Pendências:** novas PEN-025 (vínculo por Região/Área/Polo/Igreja) e PEN-026 (quais perfis acessam Execução/Conclusão, Estoque, Histórico, Configurações e se o Dashboard fica visível a todos).
- **Próximo passo:** definir os perfis dos usuários no Clerk Dashboard e validar em produção.

## Entrada 015
- **Data:** 2026-09-13
- **Etapa:** Estrutura administrativa no banco e tela de migrações
- **Versão:** 0.3.0
- **Realizado:**
  - **Migração 001 aplicada no Neon** pelo responsável (console do Neon); fluxo de aprovação validado em produção: decisão gravada, histórico com usuário, data e hora, etapas na ordem.
  - **Migrações versionadas** em `src/lib/migracoes.ts` (fonte única) e aplicador em `src/lib/migrador.ts`, com a tabela de controle `migracoes` (cada migração roda uma vez só, em transação).
  - Nova tela **Configurações → Banco de dados** (`/configuracoes/banco`, só Administrador): lista as migrações, mostra o que está aplicado ou pendente e aplica com um clique — não é mais necessário usar o console do Neon.
  - **Migração 002:** tabelas `regioes`, `areas`, `polos` e `igrejas`, com chave estrangeira entre os níveis, código único e índices. **Migração 003:** carga dos dados de teste (4 regiões, 7 áreas, 12 polos, 16 igrejas), separada para poder ser descartada.
  - **Telas de Regiões, Áreas, Polos e Igrejas passaram a funcionar de verdade:** listas, visualização, cadastro e edição gravando no banco (`src/lib/estrutura-db.ts` + Server Action em `src/components/estrutura/acoes.ts`, que também confere a permissão). As contagens ("3 polos", "2 igrejas") vêm de consultas, não de arrays.
  - O formulário de Nova Solicitação e o vínculo dos usuários passaram a usar as igrejas/polos/áreas/regiões reais do banco. `src/lib/estrutura-mock.ts` foi removido; os tipos ficaram em `src/lib/estrutura-tipos.ts`.
  - Nenhum desenho de tela alterado.
- **Testes executados:** Postgres 16 local (a rede desta sessão não alcança o Neon). Migrações 001+002+003 aplicadas do zero; contagens conferidas (4/7/12/16); consultas das telas validadas, inclusive os joins até a região e as contagens por nível; reaplicação da carga sem duplicar; chave estrangeira barrando área sem região; código duplicado barrado; inserção e edição pelas mesmas instruções das telas; e o comando de limpeza (`truncate ... cascade`) esvaziando e permitindo recarregar. Build, tipos e lint limpos. **Não testado aqui:** o caminho pela interface em produção.
- **Decisões:** DEC-012.
- **Pendências:** nenhuma nova. Próximos: obras no banco (com FK para igreja e para o fluxo) e o vínculo do usuário com a estrutura (PEN-025).
- **Próximo passo:** aplicar as migrações 002 e 003 pela tela de migrações e conferir os cadastros em produção.

## Entrada 016
- **Data:** 2026-09-13
- **Etapa:** Correção institucional do fluxo de aprovação (quatro etapas + SGI)
- **Versão:** 0.3.0
- **Realizado:**
  - **DEC-013 registrada antes do código.** DEC-008 passou a **Substituída por DEC-013**.
  - `src/lib/aprovacao.ts`: `NIVEIS_APROVACAO` passou a ter **quatro** níveis (Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável COMBENS) e `TOTAL_ETAPAS` passou a 4. Saíram "Pastor Local" e "Presbitério". O rótulo de fluxo concluído passou de "Aprovada em todas as etapas" para "Aprovada pela COMBENS". Acrescentados os tipos do resultado do SGI (`SITUACOES_SGI`, `ResultadoSgi`).
  - `src/lib/permissoes.ts`: etapas renumeradas — Coordenador de Polo 1, Coordenador de Área 2, Coordenador de Região 3, Responsável COMBENS 4. "Pastor Local" e "Presbitério" passaram a **não decidir etapa nenhuma**. Os dois perfis continuam existindo (nada foi removido por conta própria).
  - **Migração 004:** restrições de etapa ajustadas para 1..4 nas duas tabelas e colunas do resultado do SGI em `fluxo_aprovacao` (`sgi_situacao`, `sgi_valor_aprovado`, `sgi_data`, `sgi_registrado_por`, `sgi_registrado_em`). A migração **apaga os registros de teste** do fluxo, porque a numeração das etapas mudou de significado. `obterFluxo` passou a ler o resultado do SGI; nenhuma tela nova foi criada.
  - **Nova Solicitação:** campo de prioridade removido (quem define é o pastor responsável da COMBENS).
  - Testes movidos para `testes/` com script `npm run testar`.
  - **Não implementado neste bloco** (conforme instrução): módulo de Orçamento/Croqui, tela de registro do SGI, estoque, financeiro, fotos, usuários e estrutura administrativa.
- **Testes executados:** `npm run testar` — fluxo (18 verificações) e permissões (60), todos passando: quatro etapas na ordem correta, ausência de Pastor Local e Presbitério como etapas, caminho completo concluindo na COMBENS, bloqueio de pulo de etapa, reprovação encerrando, correção e reenvio, e cada perfil decidindo somente a etapa do seu nível. Em Postgres 16 local: migrações 001→004 do zero; colunas do SGI criadas; etapa 5 e decisão na etapa 6 rejeitadas pelas novas restrições; situação de SGI inválida rejeitada; registro do resultado do SGI gravado e lido; e a 004 aplicada **sobre dados antigos de seis etapas**, removendo-os e instalando as restrições sem erro (é o caso da produção). Build, tipos e lint limpos.
- **Decisões:** DEC-013; DEC-008 substituída.
- **Pendências:** resolvidas PEN-003, PEN-004, PEN-007, PEN-008 e PEN-021. Abertas as novas PEN-027 (o perfil "Presbitério" deve ser removido ou virar só visualização?), PEN-028 (alçadas e prazos por etapa) e PEN-029 (grafia oficial: COMBENS ou CONBENS). Seguem abertas PEN-006 e PEN-009.
- **Próximo passo:** aplicar a migração 004 pela tela Configurações → Banco de dados e refazer um teste do fluxo em produção.

## Entrada 017
- **Data:** 2026-09-13
- **Etapa:** Solicitações de obras no banco e formulário de Nova Solicitação funcionando
- **Versão:** 0.3.0
- **Realizado:**
  - **Migração 005** (a 004 já existia e estava publicada): tabela `obras` com id no padrão `AAAA-NNNN`, igreja solicitante (FK para `igrejas`), tipo, título, descrição, data, responsável pelo registro, prioridade **aceitando vazio** (DEC-013) e `criado_em`. **Sem coluna de status** — o status vem do fluxo de aprovação. Índices por igreja e por data.
  - `src/lib/obras-db.ts`: consultas com join na igreja e no fluxo (situação, etapa e rótulo de status já resolvidos) e `criarObra`, que grava a obra e abre o fluxo na etapa 1 (Coordenador do Polo) **na mesma transação**, com numeração sequencial por ano e nova tentativa em caso de disputa pelo mesmo número.
  - Server Action `src/app/(app)/obras/nova/acoes.ts`: confere `exigirAcesso("obras")`, valida os campos, grava e revalida `/obras`. O nome de quem registrou fica em texto (o vínculo com o cadastro de usuários depende de PEN-025).
  - **Nova Solicitação** conectada: o aviso de "envio não habilitado" saiu e, ao enviar, aparece o número da solicitação com link para abri-la. "Salvar rascunho" segue indisponível (aviso próprio) e as fotos continuam só como prévia local.
  - **/obras** e **/obras/[id]** passaram a ler do banco. O status exibido é o do fluxo ("Aguardando Coordenador da Área", "Aprovada pela COMBENS"...), o filtro de status passou a usar as situações do fluxo e o de prioridade ganhou a opção "Não definida". A coluna "Valor estimado" saiu da lista e os valores estimados saíram da Visão Geral: eram números de exemplo e passarão a vir do módulo de Orçamento.
  - A lista de obras do cadastro da igreja (`/igrejas/[id]`) passou a usar as obras reais daquela igreja — troca de fonte de dados, sem mudança de desenho.
  - `src/lib/obras-tipos.ts` concentra tipos e formatações; `src/lib/obras-mock.ts` ficou restrito aos indicadores do Dashboard, que **continuam demonstrativos** nesta etapa.
  - Abas Orçamentos, Execução e Conclusão seguem demonstrativas, agora alimentadas apenas pelo básico da obra real. Não foram implementados orçamento, croqui, execução, estoque, financeiro, fotos, auditoria nem relatórios.
- **Testes executados:** Postgres 16 local. Migrações 001→005 do zero; duas solicitações criadas pela mesma SQL da Server Action, com numeração `2026-0001` e `2026-0002` e fluxo aberto na etapa 1 em ambas; consulta da lista com join de igreja e fluxo; obras por igreja; restrições conferidas (igreja inexistente, tipo inválido, prioridade inválida e id duplicado rejeitados; prioridade vazia aceita); e o fluxo de quatro etapas percorrido sobre uma obra real até "Aprovada". `npm run testar`: fluxo e permissões, tudo passando. Build, tipos e lint limpos. **Não testado aqui:** o caminho pela interface em produção.
- **Decisões:** nenhuma nova.
- **Pendências:** nenhuma nova. O Dashboard ainda usa dados demonstrativos — é o próximo candidato natural.
- **Próximo passo:** aplicar a migração 005 pela tela Configurações → Banco de dados e registrar uma solicitação real.

## Entrada 018
- **Data:** 2026-09-13
- **Etapa:** Grafia CONBENS, Presbitério como visualização e escopo do usuário por vínculo
- **Versão:** 0.3.0
- **Realizado:**
  - **DEC-014 registrada antes do código.**
  - **Bloco A — grafia:** "COMBENS" virou **"CONBENS"** em 17 arquivos de código e nos documentos vivos (03, 04, 05, 06, 08, 11). Os registros históricos (`09-DECISOES.md` anteriores e este histórico) **não foram reescritos**, conforme o CLAUDE.md. As migrações 001, 002 e 003, já aplicadas em produção, não foram tocadas; a **migração 006** atualiza o nome do nível gravado em `decisoes_aprovacao` (`Responsável COMBENS` → `Responsável CONBENS`). A leitura do perfil aceita a grafia antiga vinda do Clerk e a normaliza, para nenhum usuário perder acesso. Fecha PEN-029.
  - **Presbitério:** mantido apenas como visualização — não decide etapa e não tem restrição de escopo. Fecha PEN-027.
  - **Bloco B — vínculo e escopo (fecha PEN-025):**
    - `src/lib/sessao.ts` passou a ler `publicMetadata.vinculoId` junto com o perfil.
    - `src/lib/permissoes.ts` ganhou o nível de vínculo por perfil (fonte única) e `normalizarPerfil`.
    - Novo `src/lib/escopo.ts`: `filtroDeEscopo` (para a consulta) e `temEscopoSobreObra` (para as ações), com Administrador, Responsável CONBENS e Presbitério em abrangência geral.
    - **Listagem `/obras`:** a consulta filtra por igreja, polo, área ou região conforme o vínculo — o filtro é no SQL, não na tela.
    - **Decisões do fluxo:** as Server Actions passaram a conferir o escopo além da etapa; um Coordenador de Polo só decide obras do seu polo. O reenvio após correção também exige escopo.
    - **Detalhes da obra:** fora do escopo, a página redireciona para "Acesso não autorizado" — a URL direta não dá acesso. A Visão Geral passou a mostrar a cadeia real (polo · área · região).
    - `obrasDaIgreja` também respeita o escopo do usuário.
  - Não foi criada tela de gestão de usuários nem integração com a API do Clerk. Estoque, Orçamento, Execução, Financeiro e Configurações não foram tocados.
  - `allowImportingTsExtensions` ligado no tsconfig para os módulos puros poderem ser carregados direto pelos testes.
- **Testes executados:** `npm run testar` — três suítes, todas passando: fluxo (quatro etapas), permissões e o novo **escopo** (34 verificações): nível de vínculo por perfil; abrangência geral de Administrador, CONBENS e Presbitério; Coordenador de Polo/Área/Região alcançando apenas o seu registro e bloqueado fora dele; Pastor Local restrito à sua igreja; perfil com vínculo obrigatório e sem `vinculoId` sem acesso a nenhuma obra; e a combinação etapa + escopo nas decisões (CONBENS decidindo a etapa 4 de qualquer obra, Presbitério e Pastor Local sem decidir nada). Build, tipos e lint limpos. **Não testado aqui:** o caminho pela interface em produção.
- **Decisões:** DEC-014.
- **Pendências:** resolvidas PEN-025, PEN-027 e PEN-029. Seguem abertas PEN-006, PEN-009, PEN-024, PEN-026 e PEN-028.
- **Próximo passo:** aplicar a migração 006, preencher `vinculoId` no Clerk para os perfis que exigem vínculo e validar em produção.

## Entrada 019
- **Data:** 2026-09-13
- **Etapa:** Módulo de Orçamento (cotações de material e mão de obra + croqui)
- **Versão:** 0.3.0
- **Realizado:**
  - **Migração 007:** `orcamentos_obra` (obra, categoria `material`/`mao_de_obra`, número 1..3, fornecedor/prestador, valor, data da cotação, validade, observações, situação, quem lançou) e `croquis_obra` (um por obra: descrição, link, quem enviou, quando). Duas regras ficaram garantidas por índice único no banco: **no máximo 3 cotações por categoria** e **uma única selecionada por categoria**.
  - `src/lib/orcamentos-db.ts`: leitura das cotações e do croqui, cálculo de **menor valor de material**, **menor valor de mão de obra** e **total estimado** (pelas selecionadas), `salvarCotacao` (cria ou atualiza; cotação já selecionada continua selecionada ao ser editada), `selecionarCotacao` (desmarca a anterior e marca a nova, em transação) e `salvarCroqui`.
  - **Regra de habilitação (DEC-013):** o módulo só abre quando o fluxo está `Aprovada` (aprovação da CONBENS). Antes disso a aba mostra aviso e não permite lançar. A regra ficou em uma função pura — `impedimentoParaOrcar` em `src/lib/escopo.ts` — usada tanto pela tela quanto pelas Server Actions.
  - **Quem lança:** quem tem escopo sobre a obra (a igreja solicitante) e os perfis de abrangência geral (Administrador e Responsável CONBENS). **Presbitério apenas visualiza** (DEC-014). Nenhum outro perfil foi incluído.
  - Server Actions em `src/app/(app)/obras/[id]/orcamentos-acoes.ts`: criar/editar cotação, selecionar cotação e registrar/atualizar croqui — todas conferindo perfil, escopo e habilitação antes de gravar.
  - **Aba Orçamentos** passou a mostrar dados reais (`src/components/orcamentos-obra.tsx`), mantendo o desenho: dois blocos (Material e Mão de obra) com três cotações cada, botão de selecionar, resumo de valores e o croqui. O mock de orçamentos saiu de `obra-detalhe-mock.ts` e `orcamentos-painel.tsx` foi removido.
  - **Não implementado** (conforme instrução): decisão do Presbitério/SGI sobre o valor e "aprovar valor diferente do solicitado" — o campo do SGI só é exibido como leitura. Estoque, Execução, Financeiro, Fotos, Usuários e o fluxo de aprovação não foram tocados.
- **Testes executados:** Postgres 16 local, migrações 001→007 do zero: três cotações de material gravadas; quarta cotação, número repetido e categoria inválida rejeitados; duas selecionadas na mesma categoria rejeitadas pelo índice único; troca de selecionada funcionando como na Server Action; menor valor por categoria e total das selecionadas conferidos; croqui registrado e atualizado sem duplicar. `npm run testar` — quatro suítes, todas passando, incluindo a nova de **orçamentos** (12 verificações: bloqueio em obra em andamento, em correção e reprovada; liberação após a aprovação; igreja solicitante lança, outra igreja não; Administrador e CONBENS lançam; Presbitério só visualiza; coordenador do polo da obra lança, de outro polo não; sem perfil não lança). Build, tipos e lint limpos. **Não testado aqui:** o caminho pela interface em produção.
- **Decisões:** nenhuma nova.
- **Pendências:** novas PEN-030 (critérios de escolha entre as cotações e quem confere antes do SGI) e PEN-031 (onde armazenar arquivos de croqui e fotos).
- **Próximo passo:** aplicar a migração 007 e lançar as cotações de uma obra já aprovada, em produção.

## Entrada 020
- **Data:** 2026-09-13
- **Etapa:** Registro do resultado do SGI
- **Versão:** 0.3.0
- **Realizado:**
  - Regras puras em `src/lib/aprovacao.ts`: `impedimentoParaRegistrarSgi` (só com o fluxo aprovado e só para **Responsável CONBENS** e **Administrador**), `validarResultadoSgi` (valor aprovado obrigatório apenas quando "Aprovado no SGI"), `rotuloStatusGeral` e `corStatusGeral`.
  - `registrarResultadoSgi` em `src/lib/fluxo-aprovacao.ts`: grava situação, valor, data e quem registrou nas colunas criadas na migração 004. O `UPDATE` exige `situacao = 'Aprovada'` na própria instrução, então o bloqueio vale mesmo com dois acessos simultâneos. Em "Reprovado no SGI" o valor é gravado como nulo.
  - Server Action `src/app/(app)/obras/[id]/sgi-acoes.ts`, que confere sessão, existência da obra, perfil e situação do fluxo antes de gravar, e revalida a obra e a lista.
  - Interface: seção **"Resultado do SGI"** dentro da aba Aprovações (que já existia), aparecendo somente depois da aprovação de todas as etapas — é onde o fluxo termina, então ficou junto. Mostra situação, valor aprovado, data e quem registrou; CONBENS e Administrador veem o formulário (e "Corrigir resultado" quando já registrado); os outros perfis veem só leitura. O campo de valor fica desabilitado quando a situação não é "Aprovado no SGI".
  - **Status geral:** com "Aprovado no SGI", o crachá da obra e o campo "Status atual" passam a exibir **"Aprovada para execução"** — apenas rótulo, o módulo de Execução não foi criado. Com "Reprovado no SGI", a tela informa que o acompanhamento se encerra ali e não inventa reabertura. A lista `/obras` reflete o mesmo rótulo.
  - **Não implementado:** execução em fases, estoque, financeiro e fotos.
- **Testes executados:** `npm run testar` — cinco suítes, todas passando, incluindo a nova de **SGI** (28 verificações): bloqueio com fluxo em andamento, em correção e reprovado; apenas CONBENS e Administrador registrando, com os outros cinco perfis bloqueados e sem perfil também; valor obrigatório só em "Aprovado no SGI" (nulo e zero rejeitados, reprovado e aguardando aceitos sem valor); rótulos e cores do status geral. Em Postgres 16 local: o `UPDATE` guardado não altera nada em obra ainda em aprovação (0 linhas) e grava na obra aprovada (1 linha), com valor, data e responsável; e "Reprovado no SGI" deixa o valor nulo. Build, tipos e lint limpos. **Não testado aqui:** o caminho pela interface em produção.
- **Decisões:** nenhuma nova.
- **Pendências:** nenhuma nova. Segue aberta PEN-005 (o que acontece após uma reprovação — aqui, a do SGI).
- **Próximo passo:** registrar o resultado do SGI em uma obra aprovada, em produção. Nenhuma migração nova neste bloco.
