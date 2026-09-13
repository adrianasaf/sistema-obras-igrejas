# 04 — Perfis e Permissões

## O que se sabe
- O sistema é privado; todo usuário terá login e senha.
- Haverá perfis de acesso com permissões diferentes.
- Existem atores ligados a cada nível da estrutura administrativa (Região, Área, Polo, Igreja) e ao Presbitério.
- Haverá aprovações hierárquicas, o que implica perfis com poder de aprovar em níveis diferentes.

## Atores identificados (a confirmar)
| Ator | Nível | Papel esperado |
|---|---|---|
| Responsável pela Igreja | Igreja | Abrir solicitações, acompanhar obras da sua igreja |
| Responsável pelo Polo | Polo | PENDENTE DE DEFINIÇÃO |
| Responsável pela Área | Área | PENDENTE DE DEFINIÇÃO |
| Responsável pela Região | Região | PENDENTE DE DEFINIÇÃO |
| Presbitério | — | Análise técnica e orçamentos |
| Administrador do sistema | — | Cadastros, usuários, configurações |

Os nomes dos cargos acima são **provisórios** e devem ser substituídos pela nomenclatura oficial da igreja: PENDENTE DE DEFINIÇÃO.

## Matriz de permissões
PENDENTE DE DEFINIÇÃO. Será construída na Fase 1 (usuários/perfis) e refinada na Fase 3 (aprovações).

## Regras gerais (previstas)
- Um usuário enxerga apenas o escopo ao qual está vinculado (sua igreja, seu polo, sua área, sua região) — a confirmar: PENDENTE DE DEFINIÇÃO.
- Um usuário pode ter mais de um perfil ou vínculo? PENDENTE DE DEFINIÇÃO.

## Implementação atual (DEC-011)

O perfil vem do **Clerk**, em `publicMetadata.perfil`. A matriz de permissões está em `src/lib/permissoes.ts` (módulo único, sem banco).

| Perfil | Áreas liberadas | Etapa que decide |
|---|---|---|
| Administrador | todas | qualquer |
| Pastor Local | Dashboard, Obras | **nenhuma** — solicita ou delega (DEC-013) |
| Coordenador de Polo | Dashboard, Obras | 1 |
| Coordenador de Área | Dashboard, Obras | 2 |
| Coordenador de Região | Dashboard, Obras | 3 |
| Responsável CONBENS | Dashboard, Obras | 4 |
| Presbitério | Dashboard, Obras, Orçamentos | **nenhuma** — resultado vem do SGI (DEC-013); manter ou remover o perfil é PEN-027 |
| (sem perfil definido) | nenhuma | nenhuma |

Como a proteção é aplicada, no servidor:
1. `exigirAcesso(area)` no início de cada página interna — redireciona para `/sem-permissao`;
2. `src/proxy.ts` confere a área da rota quando o perfil está no token da sessão do Clerk;
3. as Server Actions de aprovação conferem perfil e etapa antes de gravar.

O menu lateral mostra apenas as áreas permitidas, mas isso é consequência: digitar a URL direto não dá acesso.

**Ainda não implementado:** vínculo por Região/Área/Polo/Igreja (PEN-025).

## Vínculo com a estrutura administrativa (DEC-014)

Perfil e vínculo ficam no Clerk, em **Public metadata**:

```json
{ "perfil": "Coordenador de Polo", "vinculoId": "p1" }
```

O nível do vínculo vem do perfil:

| Perfil | Nível do vínculo | Escopo |
|---|---|---|
| Pastor Local | Igreja | Obras da sua igreja |
| Coordenador de Polo | Polo | Obras do seu polo |
| Coordenador de Área | Área | Obras da sua área |
| Coordenador de Região | Região | Obras da sua região |
| Administrador | — | Todas |
| Responsável CONBENS | — | Todas (decide qualquer obra que chegue à etapa 4) |
| Presbitério | — | Todas, **apenas visualização** |

O mesmo escopo vale para o módulo de Orçamento: lançam cotações e croqui a igreja solicitante e os coordenadores de Polo, Área e Região daquela obra, mais Administrador e Responsável CONBENS (confirmado pelo responsável em 13/09/2026). O Presbitério apenas visualiza.

O escopo é aplicado em `src/lib/escopo.ts` e vale em dois pontos, sempre no servidor:
1. **Listagem de obras** — a consulta já filtra pelo vínculo (quem não tem escopo não recebe a linha).
2. **Decisões do fluxo** — além de a etapa ter de ser a do seu nível, a obra precisa estar no seu escopo. A tela de detalhes também redireciona para "Acesso não autorizado" quando a solicitação está fora da abrangência, então a URL direta não dá acesso.

Um perfil que exige vínculo e está **sem** `vinculoId` não enxerga nenhuma obra e não decide nada — é o comportamento seguro; o administrador precisa preencher o vínculo no Clerk. A gestão de usuários pelo sistema (criar, convidar, alterar perfil) fica para etapa futura.
