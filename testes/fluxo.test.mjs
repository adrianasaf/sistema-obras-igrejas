// Testes das regras do fluxo de aprovação (DEC-010 + DEC-013: quatro etapas).
// Rodar com: node --experimental-strip-types testes/fluxo.test.mjs
import {
  NIVEIS_APROVACAO, TOTAL_ETAPAS, proximoEstado, rotuloSituacao,
  impedimentoParaDecidir, impedimentoParaReenviar, SITUACOES_SGI,
} from "../src/lib/aprovacao.ts";

let falhas = 0;
const ok = (c, m) => { console.log((c ? "  ok  " : "FALHOU") + " | " + m); if (!c) falhas++; };

ok(TOTAL_ETAPAS === 4, "o fluxo tem 4 etapas: " + TOTAL_ETAPAS);
ok(NIVEIS_APROVACAO.join(" → ") ===
   "Coordenador do Polo → Coordenador da Área → Coordenador da Região → Responsável CONBENS",
   "ordem dos níveis: " + NIVEIS_APROVACAO.join(" → "));
ok(!NIVEIS_APROVACAO.includes("Pastor Local"), "Pastor Local não é etapa de aprovação");
ok(!NIVEIS_APROVACAO.includes("Presbitério"), "Presbitério não é etapa de aprovação");

// Caminho completo: quatro aprovações, concluindo na COMBENS.
let estado = { etapaAtual: 1, situacao: "Em andamento" };
for (let etapa = 1; etapa <= TOTAL_ETAPAS; etapa++) {
  ok(impedimentoParaDecidir(estado, etapa) === null, `etapa ${etapa} (${NIVEIS_APROVACAO[etapa-1]}) pode decidir`);
  estado = proximoEstado(etapa, "Aprovado");
}
ok(estado.situacao === "Aprovada", "após a COMBENS aprovar, fluxo = Aprovada");
ok(rotuloSituacao("Aprovada", 4) === "Aprovada pela CONBENS", "rótulo de concluída: " + rotuloSituacao("Aprovada", 4));
ok(impedimentoParaDecidir(estado, 4) !== null, "fluxo concluído não aceita nova decisão");

// Não pular etapas.
estado = { etapaAtual: 2, situacao: "Em andamento" };
ok(impedimentoParaDecidir(estado, 4) !== null, "decidir a etapa 4 estando na 2 é rejeitado");
ok(impedimentoParaDecidir(estado, 1) !== null, "decidir a etapa 1 estando na 2 é rejeitado");
ok(impedimentoParaDecidir(estado, 2) === null, "decidir a etapa atual é permitido");

// Reprovação encerra.
estado = proximoEstado(2, "Reprovado");
ok(estado.situacao === "Reprovada" && estado.etapaAtual === 2, "reprovação encerra na etapa 2");
ok(impedimentoParaDecidir(estado, 2) !== null, "fluxo reprovado não aceita nova decisão");

// Correção mantém a etapa e exige reenvio.
estado = proximoEstado(3, "Correção solicitada");
ok(estado.situacao === "Em correção" && estado.etapaAtual === 3, "correção mantém a etapa 3");
ok(impedimentoParaDecidir(estado, 3) !== null, "em correção, decisão é bloqueada até o reenvio");
ok(impedimentoParaReenviar(estado) === null, "em correção, pode reenviar");
ok(impedimentoParaReenviar({ etapaAtual: 3, situacao: "Em andamento" }) !== null, "fora de correção, reenvio é rejeitado");

// Rótulos e SGI.
ok(rotuloSituacao("Em andamento", 4) === "Aguardando Responsável CONBENS", "rótulo da etapa 4");
ok(SITUACOES_SGI.length === 3 && SITUACOES_SGI[0] === "Aguardando SGI", "situações do SGI: " + SITUACOES_SGI.join(", "));

console.log(falhas === 0 ? "\nFLUXO: TODOS OS TESTES PASSARAM" : `\nFLUXO: ${falhas} FALHA(S)`);
process.exit(falhas ? 1 : 0);
