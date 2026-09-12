# 01 — Visão Geral

## Objetivo do sistema
Centralizar a gestão das obras das igrejas (reformas, ampliações, construções e manutenções) na Paraíba, desde a solicitação feita pela igreja até a conclusão da execução, com controle de prioridades, aprovações, orçamentos, materiais, estoque, financeiro, fotos, relatórios e auditoria.

## Público interno
Sistema de uso exclusivamente interno, para pessoas ligadas à estrutura administrativa das igrejas (igrejas, polos, áreas, regiões e Presbitério).
Perfis detalhados: PENDENTE DE DEFINIÇÃO (ver `04-PERFIS-E-PERMISSOES.md`).

## Problema que resolve
Hoje as solicitações, aprovações e o acompanhamento das obras não têm um lugar único e rastreável. O sistema passa a:
- registrar todas as solicitações de obra em um só lugar;
- classificar por prioridade (Emergencial, P1, P2, P3);
- conduzir as aprovações pela hierarquia administrativa;
- permitir análise e orçamento pelo Presbitério;
- acompanhar a execução em cinco fases;
- controlar materiais, estoque e financeiro;
- guardar fotos e gerar relatórios;
- manter auditoria de tudo o que foi feito.

## Estrutura administrativa
```
Região
└── Área
    └── Polo
        └── Igreja
```
Cada igreja pertence a um polo, cada polo a uma área, cada área a uma região. Detalhes (quantidades, nomes, responsáveis): PENDENTE DE DEFINIÇÃO.

## Módulos futuros (visão resumida)
| Módulo | Descrição resumida |
|---|---|
| Estrutura administrativa | Cadastro de Região, Área, Polo e Igreja |
| Usuários e perfis | Acesso por login e senha, com permissões por perfil |
| Solicitações de obra | Igreja solicita reforma, ampliação, construção ou manutenção |
| Prioridades | Emergencial, P1, P2, P3 |
| Aprovações hierárquicas | Fluxo de aprovação pela estrutura administrativa |
| Presbitério | Análise técnica e orçamentos |
| Execução | Acompanhamento em cinco fases de obra |
| Materiais e estoque | Controle de materiais e estoque |
| Financeiro | Controle de valores e gastos das obras |
| Fotos | Registro fotográfico das obras |
| Relatórios | Relatórios e indicadores |
| Auditoria | Registro de quem fez o quê e quando |

## Acesso
O sistema será **privado** e exigirá **autenticação** (login e senha). Não haverá conteúdo público.

## Princípio de rastreabilidade
Toda ação relevante (criação, alteração, aprovação, rejeição, mudança de fase, movimentação de estoque ou financeira) deve registrar **quem** fez, **quando** fez e **o que** foi alterado. Nada relevante é apagado sem rastro.
