// Classes visuais compartilhadas por todas as telas. Centralizar aqui evita
// que cada página repita (e aos poucos divirja) o mesmo estilo de botão,
// campo, cartão ou título.

// `botaoBase` e `botaoAcaoBase` não definem borda nem cor: use-os quando o
// botão precisar de cores próprias, para não competir com as classes padrão.
export const botaoBase =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";

export const botaoAcaoBase =
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors";

export const botaoPrimario = `${botaoBase} bg-brand text-white hover:bg-brand-strong`;

export const botaoSecundario = `${botaoBase} border border-border hover:bg-background`;

export const botaoContorno = `${botaoBase} border border-brand text-brand hover:bg-background`;

// Ações dentro de linhas de tabela e cartões de lista.
export const botaoAcao = `${botaoAcaoBase} border border-border hover:bg-background`;

export const classeCampo =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none";

export const classeRotulo = "block text-sm font-medium";

export const cartao = "rounded-lg border border-border bg-surface";

export const tituloPagina = "text-2xl font-semibold tracking-tight text-brand";

export const tituloSecao = "font-semibold text-brand";

export const textoAuxiliar = "text-xs text-muted";
