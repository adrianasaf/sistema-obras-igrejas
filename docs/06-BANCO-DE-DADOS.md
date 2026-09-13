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

## Migrações

O SQL fica em `src/lib/migracoes.ts` (fonte única, versionada) e é aplicado pela tela **Configurações → Banco de dados** (só Administrador). A tabela `migracoes` registra o que já foi aplicado.

| Migração | Conteúdo |
|---|---|
| 001 | Fluxo de aprovação (`fluxo_aprovacao`, `decisoes_aprovacao`) |
| 002 | Estrutura administrativa (`regioes`, `areas`, `polos`, `igrejas`) |
| 003 | Dados de teste da estrutura administrativa (4 regiões, 7 áreas, 12 polos, 16 igrejas) |
| 004 | Fluxo com quatro etapas (DEC-013) e colunas do resultado do SGI |
| 005 | Solicitações de obras (`obras`) |

## Tabelas do fluxo de aprovação (migração 001)

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

## Estrutura administrativa (migração 002)

Quatro tabelas, uma por nível, ligadas por chave estrangeira: `regioes` ← `areas` ← `polos` ← `igrejas`.

Colunas comuns: `id` (text, derivado do código — `R01` → `r-r01`), `codigo` (único), `nome`, `status` (`Ativo`/`Inativo`), `criado_em`, `atualizado_em`. Além delas: `responsavel` em regiões, áreas e polos; `cidade` em igrejas; e o vínculo com o nível acima (`regiao_id`, `area_id`, `polo_id`).

Índices em `areas (regiao_id)`, `polos (area_id)` e `igrejas (polo_id)`.

### Limpar os dados de teste

Quando os dados reais forem cadastrados, os fictícios da migração 003 saem com um comando só (no SQL Editor do Neon):

```sql
truncate igrejas, polos, areas, regioes cascade
```

Isso apaga **toda** a estrutura administrativa, inclusive o que tiver sido cadastrado pelas telas — use antes de começar o cadastro real. O registro da migração 003 permanece na tabela `migracoes`; para permitir recarregar os dados de teste depois, apague a linha: `delete from migracoes where id = '003'`.

## Resultado do SGI (migração 004)

O SGI é o sistema externo oficial da Igreja Cristã Maranata. Depois da aprovação da COMBENS, a equipe da COMBENS leva o pedido até lá e o resultado é registrado **manualmente** aqui — fora das etapas do fluxo. As colunas ficam em `fluxo_aprovacao`:

| Coluna | Tipo | Observação |
|---|---|---|
| `sgi_situacao` | text | `Aguardando SGI`, `Aprovado no SGI` ou `Reprovado no SGI`. Nulo é lido como "Aguardando SGI". |
| `sgi_valor_aprovado` | numeric(14,2) | Valor aprovado no SGI, quando aprovado |
| `sgi_data` | date | Data do resultado |
| `sgi_registrado_por` | text | Quem registrou aqui (rastreabilidade, RN-12) |
| `sgi_registrado_em` | timestamptz | Quando foi registrado aqui |

A tela desse registro será feita em etapa futura; nesta etapa existe apenas a estrutura de dados e a leitura.

A migração 004 também **apaga os registros de teste** de `fluxo_aprovacao` e `decisoes_aprovacao`: a numeração das etapas mudou de significado (a antiga etapa 2 era o Coordenador do Polo; agora é a etapa 1), e manter as linhas antigas deixaria o histórico incorreto.

## Solicitações de obras (migração 005)

### `obras`
| Coluna | Tipo | Observação |
|---|---|---|
| `id` | text (PK) | Número da solicitação, padrão `AAAA-NNNN`, sequencial por ano. Mesmo padrão de `fluxo_aprovacao.obra_id`. |
| `igreja_id` | text → `igrejas (id)` | Igreja solicitante |
| `tipo` | text | `Reforma`, `Ampliação`, `Construção` ou `Manutenção` |
| `titulo` | text | |
| `descricao` | text | |
| `data_solicitacao` | date | Padrão: data de hoje |
| `responsavel_solicitacao` | text | Quem registrou. O vínculo com o cadastro de usuários depende de PEN-025. |
| `prioridade` | text, **aceita vazio** | `Emergencial`, `Prioridade 1`, `Prioridade 2` ou `Prioridade 3`. Vazia até o pastor responsável da COMBENS definir (DEC-013). |
| `criado_em` | timestamptz | |

Índices em `obras (igreja_id)` e `obras (data_solicitacao desc)`.

**Não existe coluna de status:** o status da solicitação vem de `fluxo_aprovacao` (etapa atual e situação). Ao registrar uma solicitação, o sistema grava a obra e abre o fluxo na etapa 1 (Coordenador do Polo) na **mesma transação**.

`fluxo_aprovacao.obra_id` ainda **não** tem chave estrangeira para `obras`: seria uma alteração no fluxo de aprovação, fora do escopo deste bloco.
