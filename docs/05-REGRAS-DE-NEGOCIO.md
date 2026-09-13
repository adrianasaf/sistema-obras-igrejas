# 05 — Regras de Negócio

Somente regras já conhecidas. Nenhuma regra administrativa da igreja deve ser inventada; o que não foi informado fica como PENDENTE DE DEFINIÇÃO e vai para `11-PENDENCIAS.md`.

## Estrutura administrativa
| ID | Regra |
|---|---|
| RN-01 | A hierarquia é Região → Área → Polo → Igreja. |
| RN-02 | Toda Igreja pertence a exatamente um Polo; todo Polo a uma Área; toda Área a uma Região. |

## Obras
| ID | Regra |
|---|---|
| RN-03 | Os tipos de obra são: reforma, ampliação, construção e manutenção. |
| RN-04 | Toda obra tem uma prioridade: Emergencial, P1, P2 ou P3. **Quem define é o pastor responsável da CONBENS**, não quem abre a solicitação (DEC-013). Significado de cada nível: PENDENTE (PEN-006). |
| RN-05 | Toda obra nasce de uma solicitação feita por uma Igreja. O **Pastor Local** abre ou delega a alguém; quando delega, a solicitação segue direto para o Coordenador do Polo, **sem aprovação do pastor** (DEC-013). |
| RN-06 | A execução da obra é acompanhada em cinco fases. Nomes e conteúdo das fases: PENDENTE DE DEFINIÇÃO (PEN-009). |

## Aprovações
| ID | Regra |
|---|---|
| RN-07 | O fluxo interno tem **quatro etapas**, nesta ordem: Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável CONBENS (DEC-013). |
| RN-08 | Em cada etapa a decisão é Aprovar, Reprovar ou Solicitar correção. Só avança após a aprovação da etapa atual; **não é possível pular etapas**; a reprovação encerra o fluxo; "Correção solicitada" devolve para ajuste sem encerrar e volta à mesma etapa depois do reenvio (DEC-010). |
| RN-09 | Toda decisão registra usuário, data/hora e comentário; o comentário é obrigatório em reprovação e em pedido de correção. O histórico não é alterado nem apagado. |
| RN-10 | **O Presbitério não decide no sistema.** Depois da aprovação da CONBENS, a equipe da CONBENS leva o pedido ao **SGI** (sistema externo, oficial da Igreja Cristã Maranata) e o resultado — situação, valor aprovado e data — é registrado manualmente aqui, em campo próprio, fora das etapas do fluxo (DEC-013). |
| RN-11 | Depois da aprovação da CONBENS, a **igreja solicitante** monta 3 cotações de material, 3 cotações de mão de obra e o Croqui da obra (DEC-013). Módulo de Orçamento: etapa futura. |

## Estoque
| ID | Regra |
|---|---|
| RN-15 | Cada material pertence a uma igreja ou ao estoque geral (sem igreja vinculada) — DEC-015. |
| RN-16 | Todos que acessam a área de estoque veem os materiais de todas as igrejas, para permitir remanejamento (DEC-015). |
| RN-17 | A entrada de material soma na quantidade atual e gera uma movimentação com quem registrou. A **saída** aguarda a definição das cinco fases (PEN-009). |

## Rastreabilidade e auditoria
| ID | Regra |
|---|---|
| RN-12 | Toda ação relevante registra usuário, data/hora e conteúdo alterado. |
| RN-13 | Registros relevantes não são excluídos fisicamente; devem manter rastro (forma exata: PENDENTE DE DEFINIÇÃO). |

## Acesso
| ID | Regra |
|---|---|
| RN-14 | Nenhuma funcionalidade é acessível sem autenticação, e cada perfil só acessa as áreas liberadas (DEC-011). |
