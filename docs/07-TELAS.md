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
| Dashboard | `/` | Interface: cartões de resumo, valores estimado/aprovado e listas de obras |
| Obras (lista) | `/obras` | Interface: tabela/cartões, filtros por prioridade e status, busca |
| Nova solicitação | `/obras/nova` | Interface: formulário com valores estimados, "Salvar rascunho" e "Enviar solicitação" (não gravam) |
| Detalhes da obra | `/obras/[id]` | Interface: abas Visão Geral, Aprovações, Orçamentos, Execução e Conclusão |
| Igrejas | `/igrejas` | Espaço na navegação (a desenvolver) |
| Estoque | `/estoque` | Interface: materiais, saldos e botões Entrada/Saída/Novo material (não movimentam) |
| Histórico de Desenvolvimento | `/historico` | Funcional (lê `docs/10-...`) |

## Layout, identidade visual e navegação
- Layout administrativo: menu lateral fixo (tablet/computador) ou sobreposto (celular) e barra superior com nome do sistema, usuário logado e opção de sair.
- Paleta institucional e cores de prioridade/status centralizadas em `src/lib/cores.ts`.
- Identidade visual oficial (logotipo, cores da instituição): PENDENTE DE DEFINIÇÃO.
