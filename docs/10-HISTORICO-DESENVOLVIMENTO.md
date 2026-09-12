# 10 — Histórico de Desenvolvimento

Registro cronológico das etapas. **Nunca apagar nem reescrever retroativamente.** Novas entradas são adicionadas ao final.

## Formato
```
Data:
Etapa:
Versão:
Realizado:
Decisões:
Pendências:
Próximo passo:
```

---

## Entrada 001
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Etapa 1 — Fundação documental e organizacional
- **Versão:** 0.0.1 (documentação; sem código)
- **Realizado:**
  - Criada a pasta raiz `sistema-obras-igrejas/`.
  - Criado `CLAUDE.md` (memória operacional do projeto).
  - Criado `README.md` inicial.
  - Criada a pasta `docs/` com os documentos 01 a 11.
  - Registrada a estrutura Região → Área → Polo → Igreja, os tipos de obra, as prioridades e a visão dos módulos futuros.
  - Definido o roadmap em 8 fases.
- **Decisões:** DEC-001 a DEC-004 (ver `09-DECISOES.md`).
- **Pendências:** ver `11-PENDENCIAS.md` (PEN-001 em diante).
- **Próximo passo:** Fase 1 — Etapa 2: inicializar Git na raiz do projeto e escolher/registrar as tecnologias (aplicação web, banco, autenticação, hospedagem), sem implementar funcionalidades.

## Entrada 002
- **Data:** 2026-09-12
- **Etapa:** Fase 1 — Etapa 2 — Base técnica do site
- **Versão:** 0.1.0
- **Realizado:**
  - Git inicializado na raiz do projeto.
  - Aplicação criada com Next.js 16, TypeScript e Tailwind CSS 4 (App Router, `src/`).
  - Página inicial institucional e responsiva com nome, subtítulo e versão.
- **Decisões:** DEC-005 (stack do site).
- **Pendências:** hospedagem/deploy ainda não configurados (PEN-019 parcialmente resolvida).
- **Próximo passo:** interface do módulo Obras.

## Entrada 003
- **Data:** 2026-09-12
- **Etapa:** Fase 2 (interface) — Módulo Obras com dados demonstrativos
- **Versão:** 0.2.0
- **Realizado:**
  - Layout administrativo com menu lateral (Dashboard, Obras, Histórico de Desenvolvimento), responsivo.
  - `/obras`: lista de solicitações de exemplo (igreja, tipo, prioridade, data, status) e botão "Nova Solicitação".
  - `/obras/nova`: formulário (igreja, tipo, prioridade, título, descrição, fotos) — sem gravação; exibe aviso de que o envio ainda não está habilitado.
  - `/obras/[id]`: detalhes, descrição, fotos (espaço reservado), status e linha do tempo preparada para as aprovações.
  - `/historico`: exibe o conteúdo de `docs/10-HISTORICO-DESENVOLVIMENTO.md`.
- **Decisões:** status provisórios da obra (Solicitada, Em análise, Aprovada, Em execução, Concluída) apenas para demonstração — os oficiais dependem de PEN-004.
- **Pendências:** nenhuma nova.
- **Próximo passo:** login e autenticação.
