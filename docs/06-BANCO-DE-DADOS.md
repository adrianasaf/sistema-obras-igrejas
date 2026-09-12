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

## Tabelas existentes (migração 001)

Criadas por `scripts/001-fluxo-aprovacao.sql` (idempotente). São as primeiras tabelas do sistema; o restante continua com dados demonstrativos no código.

### `fluxo_aprovacao` — estado atual do fluxo de cada solicitação
| Coluna | Tipo | Observação |
|---|---|---|
| `obra_id` | text (PK) | Número da solicitação (ex.: `2026-0001`). Sem FK enquanto as obras não estiverem no banco. |
| `etapa_atual` | smallint | 1 a 6, conforme a ordem de DEC-008 |
| `situacao` | text | `Em andamento`, `Em correção`, `Reprovada` ou `Aprovada` |
| `criado_em` / `atualizado_em` | timestamptz | |

### `decisoes_aprovacao` — histórico das decisões (nunca alterado)
| Coluna | Tipo | Observação |
|---|---|---|
| `id` | bigserial (PK) | |
| `obra_id` | text | |
| `etapa` | smallint | 1 a 6 |
| `nivel` | text | Nome do nível que decidiu |
| `decisao` | text | `Aprovado`, `Reprovado`, `Correção solicitada` ou `Reenviada após correção` |
| `comentario` | text | Obrigatório (pela aplicação) em reprovação e pedido de correção |
| `usuario_id` / `usuario_nome` / `usuario_email` | text | Quem decidiu (dados da sessão do Clerk) |
| `criado_em` | timestamptz | Data e hora da decisão |

O avanço de etapa e a gravação da decisão acontecem na mesma transação, e as duas instruções checam a etapa e a situação esperadas — é isso que impede pular etapas ou decidir em um fluxo já encerrado, mesmo com dois acessos simultâneos.
