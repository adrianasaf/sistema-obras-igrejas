// --- Orçamentos: habilitação + quem lança (DEC-013 / DEC-014) ---
// Testes do módulo de orçamento: habilitação e quem lança (DEC-013 / DEC-014).
// Rodar com: node --experimental-strip-types testes/orcamentos.test.mjs
import { impedimentoParaOrcar, podeOrcar } from "../src/lib/escopo.ts";
{
  const obra = { igrejaId: "i01", poloId: "p1", areaId: "a1", regiaoId: "r1" };
  const pastorDaIgreja = { perfil: "Pastor Local", vinculoId: "i01" };
  const pastorDeOutra = { perfil: "Pastor Local", vinculoId: "i09" };

  let f2 = 0;
  const ok2 = (c, m) => { console.log((c ? "  ok  " : "FALHOU") + " | " + m); if (!c) f2++; };

  ok2(!podeOrcar(pastorDaIgreja, obra, "Em andamento"), "obra em aprovação: não pode lançar cotação");
  ok2(impedimentoParaOrcar(pastorDaIgreja, obra, "Em andamento").includes("aprovação da CONBENS"),
      "aviso explica que falta a aprovação da CONBENS");
  ok2(!podeOrcar(pastorDaIgreja, obra, "Em correção"), "obra em correção: não pode lançar");
  ok2(!podeOrcar(pastorDaIgreja, obra, "Reprovada"), "obra reprovada: não pode lançar");
  ok2(podeOrcar(pastorDaIgreja, obra, "Aprovada"), "aprovada: a igreja solicitante pode lançar");
  ok2(!podeOrcar(pastorDeOutra, obra, "Aprovada"), "outra igreja não lança nesta obra");
  ok2(podeOrcar({ perfil: "Administrador", vinculoId: null }, obra, "Aprovada"), "Administrador pode lançar");
  ok2(podeOrcar({ perfil: "Responsável CONBENS", vinculoId: null }, obra, "Aprovada"), "Responsável CONBENS pode lançar");
  ok2(!podeOrcar({ perfil: "Presbitério", vinculoId: null }, obra, "Aprovada"), "Presbitério só visualiza (não lança)");
  ok2(podeOrcar({ perfil: "Coordenador de Polo", vinculoId: "p1" }, obra, "Aprovada"),
      "coordenador do polo da obra tem escopo para lançar");
  ok2(!podeOrcar({ perfil: "Coordenador de Polo", vinculoId: "p6" }, obra, "Aprovada"),
      "coordenador de outro polo não lança");
  ok2(!podeOrcar({ perfil: null }, obra, "Aprovada"), "sem perfil não lança");

  console.log(f2 === 0 ? "\nORÇAMENTOS: TODOS OS TESTES PASSARAM" : `\nORÇAMENTOS: ${f2} FALHA(S)`);
  process.exit(f2 ? 1 : 0);
}
