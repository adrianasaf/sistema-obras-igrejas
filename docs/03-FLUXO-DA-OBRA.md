# 03 — Fluxo da Obra

Visão macro do caminho de uma obra, com o que já se conhece. Os detalhes de cada etapa serão definidos nas fases correspondentes do roadmap.

## Fluxo macro (DEC-013)
```
1. Solicitação (Igreja — Pastor Local ou pessoa por ele delegada)
      ↓
2. Coordenador do Polo        (etapa 1)
      ↓
3. Coordenador da Área        (etapa 2)
      ↓
4. Coordenador da Região      (etapa 3)
      ↓
5. Responsável CONBENS        (etapa 4)
      ↓
6. SGI — sistema externo (fora do sistema): a equipe da CONBENS leva o pedido
   e o resultado é registrado manualmente aqui
      ↓
7. Orçamentos e Croqui, montados pela IGREJA SOLICITANTE
      ↓
8. Execução (cinco fases)
      ↓
9. Conclusão
```

## 1. Solicitação
- Feita pela igreja: o **Pastor Local** abre ou **delega** a alguém. Quando delega, a solicitação segue direto para o Coordenador do Polo — **não há aprovação do pastor** (DEC-013, resolve PEN-003).
- Tipos de obra: reforma, ampliação, construção, manutenção.
- **A prioridade não é informada por quem abre**: quem define é o pastor responsável da CONBENS (DEC-013).
- Campos obrigatórios da solicitação: PENDENTE DE DEFINIÇÃO (PEN-012).

## 2. Aprovações internas (quatro etapas)
- Ordem (DEC-013, resolve PEN-004): **Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável CONBENS**.
- Situações de cada etapa: Aguardando, Aprovado, Reprovado, Correção solicitada.
- A solicitação só avança após a aprovação da etapa atual; **não é possível pular etapas**; a reprovação encerra o fluxo; "Correção solicitada" devolve para ajuste sem encerrar, e a solicitação volta à mesma etapa após o reenvio (DEC-010).
- Cada decisão registra usuário, data/hora e comentário. O histórico não é alterado nem apagado.
- Quem pode reenviar após correção e se uma reprovação pode ser reaberta: PENDENTE DE DEFINIÇÃO (PEN-024).
- Alçadas por valor ou prioridade e prazos: PENDENTE DE DEFINIÇÃO.

## 3. SGI (sistema externo)
- Depois da aprovação da CONBENS, alguém da equipe da CONBENS leva o pedido ao **SGI**, sistema oficial da Igreja Cristã Maranata. **O Presbitério não decide dentro deste sistema** (DEC-013, resolve PEN-007).
- O resultado volta para cá **registrado manualmente**: situação (Aguardando SGI, Aprovado no SGI, Reprovado no SGI), valor aprovado (quando aprovado) e data. É um campo próprio, **não** uma etapa do fluxo.
- A tela desse registro será feita em etapa futura; a estrutura de dados já existe (migração 004).

## 4. Orçamentos e Croqui
- Depois da aprovação da CONBENS, quem monta é a **igreja solicitante** (DEC-013, resolve PEN-008): **3 cotações de material**, **3 cotações de mão de obra** e o **Croqui** da obra.
- Módulo de Orçamento: etapa futura. Critérios de escolha entre as cotações: PENDENTE DE DEFINIÇÃO.

## 5. Execução em cinco fases
- A execução é acompanhada em **cinco fases**.
- Nome e conteúdo de cada fase: PENDENTE DE DEFINIÇÃO (PEN-009).
- Durante a execução: materiais, estoque, financeiro e fotos.

## 6. Conclusão
- Critérios de encerramento da obra: PENDENTE DE DEFINIÇÃO (PEN-010).

## Prioridades
| Prioridade | Significado |
|---|---|
| Emergencial | PENDENTE DE DEFINIÇÃO |
| P1 | PENDENTE DE DEFINIÇÃO |
| P2 | PENDENTE DE DEFINIÇÃO |
| P3 | PENDENTE DE DEFINIÇÃO |

Quem define a prioridade: o **pastor responsável da CONBENS** (DEC-013). O significado operacional de cada nível e se Emergencial altera o fluxo: PENDENTE DE DEFINIÇÃO (PEN-006).
