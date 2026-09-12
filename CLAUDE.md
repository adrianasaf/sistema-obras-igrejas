# CLAUDE.md — Memória operacional do projeto

Projeto: **Sistema de Gestão de Obras das Igrejas** (nome provisório) — Paraíba.
Raiz oficial do projeto: esta pasta (`sistema-obras-igrejas/`). Nada deste projeto fica fora dela.

## Antes de trabalhar
- Consulte **somente** os documentos em `docs/` relevantes à tarefa atual. Não releia toda a documentação sem necessidade.
- Verifique `docs/08-ROADMAP.md` para saber em qual fase/etapa o projeto está.
- Não desenvolva funcionalidades fora do escopo da etapa solicitada. Não antecipe etapas futuras.

## Regras institucionais
- **Não invente regras administrativas da igreja** (hierarquia, alçadas, prazos, critérios de aprovação, etc.).
- O que não estiver definido é marcado como `PENDENTE DE DEFINIÇÃO`.
- Dúvidas institucionais vão para `docs/11-PENDENCIAS.md`.

## Registro e histórico
- Decisões importantes vão para `docs/09-DECISOES.md` (formato DEC-NNN). Nunca apague decisões antigas; mude o `Status` e registre uma nova decisão.
- Ao concluir uma etapa relevante, adicione uma entrada em `docs/10-HISTORICO-DESENVOLVIMENTO.md`. O histórico nunca é apagado nem reescrito retroativamente.
- Não altere arquitetura, regras de negócio ou fluxos importantes silenciosamente: registre a decisão antes.

## Código (quando houver)
- Nunca coloque segredos (chaves, senhas, tokens) no código ou em arquivos versionados. Use variáveis de ambiente.
- Mantenha o código simples, sustentável e documentado.
- Toda ação relevante no sistema deve ser rastreável (quem, quando, o quê).

## Idioma
- Documentação, commits e interface em **português do Brasil**.
