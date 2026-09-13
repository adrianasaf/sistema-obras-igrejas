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
| Responsável COMBENS | Dashboard, Obras | 4 |
| Presbitério | Dashboard, Obras, Orçamentos | **nenhuma** — resultado vem do SGI (DEC-013); manter ou remover o perfil é PEN-027 |
| (sem perfil definido) | nenhuma | nenhuma |

Como a proteção é aplicada, no servidor:
1. `exigirAcesso(area)` no início de cada página interna — redireciona para `/sem-permissao`;
2. `src/proxy.ts` confere a área da rota quando o perfil está no token da sessão do Clerk;
3. as Server Actions de aprovação conferem perfil e etapa antes de gravar.

O menu lateral mostra apenas as áreas permitidas, mas isso é consequência: digitar a URL direto não dá acesso.

**Ainda não implementado:** vínculo por Região/Área/Polo/Igreja (PEN-025).
