# 07 — Telas

**Status:** nenhuma tela foi desenhada nesta etapa. Lista apenas as telas previstas com base nos módulos conhecidos.

## Fase 1 — Fundação administrativa
| Tela | Descrição |
|---|---|
| Login | Acesso com login e senha |
| Dashboard | Visão inicial após o login (conteúdo: PENDENTE DE DEFINIÇÃO) |
| Regiões | Listagem e cadastro |
| Áreas | Listagem e cadastro, vinculadas a uma Região |
| Polos | Listagem e cadastro, vinculados a uma Área |
| Igrejas | Listagem e cadastro, vinculadas a um Polo |
| Usuários e perfis | Cadastro de usuários, perfis e vínculo com a estrutura |
| Auditoria | Consulta do registro de ações |

## Fases seguintes (previsão)
| Tela | Fase |
|---|---|
| Nova solicitação de obra / lista de solicitações | 2 |
| Aprovações pendentes / histórico de aprovações | 3 |
| Análise do Presbitério / orçamentos | 4 |
| Acompanhamento da obra (cinco fases) / fotos | 5 |
| Materiais e estoque | 6 |
| Financeiro | 7 |
| Relatórios e indicadores | 8 |

## Telas já implementadas (apenas interface, com dados demonstrativos)
| Tela | Rota | Situação |
|---|---|---|
| Login | `/login` | Funcional (Clerk) |
| Acesso não autorizado | `/sem-permissao` | Funcional: perfil sem acesso à área, ou usuário sem perfil definido |
| Dashboard | `/` | Interface: indicadores ainda sobre dados demonstrativos (será ligado ao banco na etapa seguinte) |
| Obras (lista) | `/obras` | **Funcional (banco):** tabela/cartões, filtros por prioridade e situação, busca |
| Nova solicitação | `/obras/nova` | **Funcional (banco):** grava a solicitação e abre o fluxo na etapa 1. "Salvar rascunho" segue indisponível; fotos não são enviadas |
| Detalhes da obra | `/obras/[id]` | **Funcional (banco)** em Visão Geral, Aprovações (fluxo + resultado do SGI) e Orçamentos (cotações + croqui); Execução e Conclusão seguem demonstrativos |
| Regiões | `/regioes` | **Funcional (banco):** lista, cadastro, visualização e edição |
| Áreas | `/areas` | **Funcional (banco):** lista, cadastro, visualização e edição |
| Polos | `/polos` | **Funcional (banco):** lista, cadastro, visualização e edição |
| Igrejas | `/igrejas` | **Funcional (banco):** lista, cadastro, visualização e edição |
| Auditoria | `/auditoria` | **Funcional (banco):** ações registradas, com filtro por tipo e busca por usuário (só Administrador) |
| Usuários e perfis | `/usuarios` | Interface: lista, filtros, busca, cadastro/edição em modal e ativar/desativar (sem permissões reais) |
| Estoque | `/estoque` | **Funcional (banco):** materiais de todas as igrejas e do estoque geral, cadastro/edição e entrada; **saída pendente** (PEN-009) |
| Banco de dados | `/configuracoes/banco` | Funcional: aplica as migrações pendentes (só Administrador) |
| Configurações | `/configuracoes` | Interface: dados do sistema, preferências de interface e informações institucionais (nada é salvo) |
| Histórico de Desenvolvimento | `/historico` | Interface: linha do tempo de versões (demonstrativa) + documento real `docs/10-...` |

## Layout, identidade visual e navegação
- Layout administrativo: menu lateral fixo (tablet/computador) ou sobreposto (celular) e barra superior com nome do sistema, usuário logado e opção de sair.
- Paleta institucional e cores de prioridade/status centralizadas em `src/lib/cores.ts`; classes de botão, campo, cartão e título em `src/lib/ui.ts`.
- Componentes comuns: cabeçalho de página (`cabecalho-pagina.tsx`), tabela e cartão de lista (`tabela.tsx`), busca e filtros (`filtros.tsx`), abas (`abas.tsx`) e crachás (`badges.tsx`).
- Escalas de cor: prioridade vai de vermelho (Emergencial) a neutro (P3); status vai de azul-claro (Solicitada) a verde (Concluída). As duas escalas não compartilham cor, para poderem aparecer lado a lado.
- Toda lista usa tabela a partir de tablet (`md`) e cartões em celular.
- Identidade visual oficial (logotipo, cores da instituição): PENDENTE DE DEFINIÇÃO.
