# 06 — Banco de Dados

**Status:** nenhum banco foi escolhido ou configurado nesta etapa. Este documento registra apenas as entidades conceituais já conhecidas.

## Tecnologia
PENDENTE DE DEFINIÇÃO (será decidida na Fase 1 e registrada em `09-DECISOES.md`).

## Entidades conceituais (visão inicial)
| Entidade | Descrição | Fase |
|---|---|---|
| Região | Nível mais alto da estrutura | 1 |
| Área | Pertence a uma Região | 1 |
| Polo | Pertence a uma Área | 1 |
| Igreja | Pertence a um Polo | 1 |
| Usuário | Pessoa com login; vinculada a perfil e a um nível da estrutura | 1 |
| Perfil | Conjunto de permissões | 1 |
| Auditoria | Registro de ações (quem, quando, o quê) | 1 |
| Solicitação de obra | Pedido feito por uma Igreja, com tipo e prioridade | 2 |
| Aprovação | Registro de cada decisão no fluxo hierárquico | 3 |
| Orçamento | Valores propostos/aprovados para uma obra | 4 |
| Obra / Fase de execução | Acompanhamento em cinco fases | 5 |
| Material | Itens usados na obra | 5/6 |
| Estoque / Movimentação | Entradas e saídas de materiais | 6 |
| Lançamento financeiro | Receitas e despesas da obra | 7 |
| Foto | Registro fotográfico vinculado à obra/fase | PENDENTE DE DEFINIÇÃO |

## Relacionamentos conhecidos
- Região 1—N Área 1—N Polo 1—N Igreja.
- Igreja 1—N Solicitação de obra.
- Demais relacionamentos: PENDENTE DE DEFINIÇÃO.

## Modelo físico (tabelas, colunas, chaves)
PENDENTE DE DEFINIÇÃO — será detalhado quando o banco for escolhido.
