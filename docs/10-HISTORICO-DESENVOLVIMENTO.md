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
