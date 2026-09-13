// Testes do registro do resultado do SGI (DEC-013).
// Rodar com: node --experimental-strip-types testes/sgi.test.mjs
import {
  SITUACOES_SGI, PERFIS_SGI, impedimentoParaRegistrarSgi, podeRegistrarSgi,
  validarResultadoSgi, rotuloStatusGeral, corStatusGeral,
} from "../src/lib/aprovacao.ts";
import { PERFIS } from "../src/lib/permissoes.ts";

let falhas = 0;
const ok = (c, m) => { console.log((c ? "  ok  " : "FALHOU") + " | " + m); if (!c) falhas++; };

ok(SITUACOES_SGI.join(" / ") === "Aguardando SGI / Aprovado no SGI / Reprovado no SGI",
   "situações do SGI: " + SITUACOES_SGI.join(" / "));

// 1. Bloqueio antes da aprovação de todas as etapas.
for (const situacao of ["Em andamento", "Em correção", "Reprovada"]) {
  ok(!podeRegistrarSgi("Responsável CONBENS", situacao),
     `fluxo "${situacao}": CONBENS não registra o resultado`);
  ok(impedimentoParaRegistrarSgi("Administrador", situacao).includes("todas as etapas"),
     `fluxo "${situacao}": aviso explica que falta a aprovação`);
}

// 2. Bloqueio por perfil (só CONBENS e Administrador).
ok(PERFIS_SGI.length === 2, "apenas dois perfis registram: " + PERFIS_SGI.join(", "));
for (const perfil of PERFIS_SGI) {
  ok(podeRegistrarSgi(perfil, "Aprovada"), `${perfil} registra o resultado com o fluxo aprovado`);
}
for (const perfil of PERFIS.filter((p) => !PERFIS_SGI.includes(p))) {
  ok(!podeRegistrarSgi(perfil, "Aprovada"), `${perfil} NÃO registra o resultado`);
  ok(impedimentoParaRegistrarSgi(perfil, "Aprovada").includes("CONBENS"),
     `${perfil}: aviso aponta a CONBENS`);
}
ok(!podeRegistrarSgi(null, "Aprovada"), "sem perfil não registra");

// 3. Valor aprovado obrigatório só quando "Aprovado no SGI".
ok(validarResultadoSgi({ situacao: "Aprovado no SGI", valorAprovado: null }) !== null,
   "aprovado sem valor é rejeitado");
ok(validarResultadoSgi({ situacao: "Aprovado no SGI", valorAprovado: 0 }) !== null,
   "aprovado com valor zero é rejeitado");
ok(validarResultadoSgi({ situacao: "Aprovado no SGI", valorAprovado: 48500 }) === null,
   "aprovado com valor é aceito");
ok(validarResultadoSgi({ situacao: "Reprovado no SGI", valorAprovado: null }) === null,
   "reprovado sem valor é aceito");
ok(validarResultadoSgi({ situacao: "Aguardando SGI", valorAprovado: null }) === null,
   "aguardando sem valor é aceito");

// 4. Rótulo e cor do status geral.
ok(rotuloStatusGeral("Aprovada", 4, "Aprovado no SGI") === "Aprovada para execução",
   "aprovado no SGI → " + rotuloStatusGeral("Aprovada", 4, "Aprovado no SGI"));
ok(rotuloStatusGeral("Aprovada", 4, "Reprovado no SGI") === "Reprovada no SGI",
   "reprovado no SGI aparece claramente");
ok(rotuloStatusGeral("Aprovada", 4, "Aguardando SGI") === "Aprovada pela CONBENS · aguardando SGI",
   "aprovada pela CONBENS e aguardando SGI");
ok(rotuloStatusGeral("Em andamento", 2, "Aguardando SGI") === "Aguardando Coordenador da Área",
   "em aprovação: rótulo continua o da etapa");
ok(corStatusGeral("Aprovada", "Aprovado no SGI") === "Aprovado", "cor de aprovado");
ok(corStatusGeral("Aprovada", "Reprovado no SGI") === "Reprovado", "cor de reprovado");
ok(corStatusGeral("Aprovada", "Aguardando SGI") === "Aguardando", "cor de aguardando");

console.log(falhas === 0 ? "\nSGI: TODOS OS TESTES PASSARAM" : `\nSGI: ${falhas} FALHA(S)`);
process.exit(falhas ? 1 : 0);
