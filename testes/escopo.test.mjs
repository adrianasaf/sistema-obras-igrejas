// Testes do escopo do usuário sobre as obras (DEC-014).
// Rodar com: node --experimental-strip-types testes/escopo.test.mjs
import {
  filtroDeEscopo, temEscopoSobreObra, motivoSemEscopo,
} from "../src/lib/escopo.ts";
import { NIVEL_VINCULO_DO_PERFIL, podeDecidirEtapa } from "../src/lib/permissoes.ts";

let falhas = 0;
const ok = (c, m) => { console.log((c ? "  ok  " : "FALHOU") + " | " + m); if (!c) falhas++; };

// Obras de exemplo, com a cadeia igreja → polo → área → região.
const obraA = { igrejaId: "i01", poloId: "p1", areaId: "a1", regiaoId: "r1" };
const obraB = { igrejaId: "i09", poloId: "p6", areaId: "a3", regiaoId: "r2" };

// Nível de vínculo por perfil.
ok(NIVEL_VINCULO_DO_PERFIL["Pastor Local"] === "igreja", "Pastor Local se vincula a uma igreja");
ok(NIVEL_VINCULO_DO_PERFIL["Coordenador de Polo"] === "polo", "Coordenador de Polo se vincula a um polo");
ok(NIVEL_VINCULO_DO_PERFIL["Coordenador de Área"] === "area", "Coordenador de Área se vincula a uma área");
ok(NIVEL_VINCULO_DO_PERFIL["Coordenador de Região"] === "regiao", "Coordenador de Região se vincula a uma região");
ok(NIVEL_VINCULO_DO_PERFIL["Responsável CONBENS"] === "nenhum", "Responsável CONBENS tem abrangência geral");
ok(NIVEL_VINCULO_DO_PERFIL["Presbitério"] === "nenhum", "Presbitério tem abrangência geral (só visualiza)");
ok(NIVEL_VINCULO_DO_PERFIL["Administrador"] === "nenhum", "Administrador tem abrangência geral");

// Abrangência geral: veem tudo.
for (const perfil of ["Administrador", "Responsável CONBENS", "Presbitério"]) {
  const u = { perfil, vinculoId: null };
  ok(filtroDeEscopo(u).tipo === "tudo", `${perfil}: consulta sem filtro de escopo`);
  ok(temEscopoSobreObra(u, obraA) && temEscopoSobreObra(u, obraB), `${perfil} tem escopo sobre qualquer obra`);
}

// Coordenador de Polo: só o polo dele.
const polo1 = { perfil: "Coordenador de Polo", vinculoId: "p1" };
ok(temEscopoSobreObra(polo1, obraA), "Coordenador do polo p1 tem escopo sobre obra do p1");
ok(!temEscopoSobreObra(polo1, obraB), "Coordenador do polo p1 NÃO tem escopo sobre obra do p6");
const f = filtroDeEscopo(polo1);
ok(f.tipo === "nivel" && f.nivel === "polo" && f.id === "p1", "filtro do polo: " + JSON.stringify(f));

// Coordenador de Área e de Região: só a sua área/região.
const area1 = { perfil: "Coordenador de Área", vinculoId: "a1" };
ok(temEscopoSobreObra(area1, obraA) && !temEscopoSobreObra(area1, obraB), "Coordenador da área a1 só alcança obras da a1");
const regiao2 = { perfil: "Coordenador de Região", vinculoId: "r2" };
ok(temEscopoSobreObra(regiao2, obraB) && !temEscopoSobreObra(regiao2, obraA), "Coordenador da região r2 só alcança obras da r2");

// Pastor Local: só a igreja dele.
const pastor = { perfil: "Pastor Local", vinculoId: "i01" };
ok(temEscopoSobreObra(pastor, obraA) && !temEscopoSobreObra(pastor, obraB), "Pastor Local só alcança obras da sua igreja");

// Sem vínculo em perfil que exige vínculo: não alcança nada.
const semVinculo = { perfil: "Coordenador de Polo", vinculoId: null };
ok(filtroDeEscopo(semVinculo).tipo === "nada", "Coordenador sem vinculoId: nenhuma obra");
ok(!temEscopoSobreObra(semVinculo, obraA), "Coordenador sem vinculoId não tem escopo");
ok(motivoSemEscopo(semVinculo).includes("vínculo"), "mensagem explica a falta de vínculo");
ok(filtroDeEscopo({ perfil: null }).tipo === "nada", "sem perfil: nenhuma obra");

// Decisão = etapa do nível E escopo sobre a obra.
const podeDecidir = (u, etapa, obra) => podeDecidirEtapa(u.perfil, etapa) && temEscopoSobreObra(u, obra);
ok(podeDecidir(polo1, 1, obraA), "Coordenador do p1 decide a etapa 1 da obra do seu polo");
ok(!podeDecidir(polo1, 1, obraB), "Coordenador do p1 NÃO decide a etapa 1 de obra de outro polo");
ok(!podeDecidir(polo1, 2, obraA), "Coordenador do p1 NÃO decide a etapa 2 nem no seu polo");
ok(podeDecidir(area1, 2, obraA), "Coordenador da a1 decide a etapa 2 da obra da sua área");
ok(!podeDecidir(area1, 2, obraB), "Coordenador da a1 NÃO decide etapa 2 fora da sua área");
ok(podeDecidir(regiao2, 3, obraB), "Coordenador da r2 decide a etapa 3 da obra da sua região");
const conbens = { perfil: "Responsável CONBENS", vinculoId: null };
ok(podeDecidir(conbens, 4, obraA) && podeDecidir(conbens, 4, obraB), "CONBENS decide a etapa 4 de qualquer obra");
ok(!podeDecidir(conbens, 1, obraA), "CONBENS não decide etapas de outros níveis");
ok([1,2,3,4].every((e) => !podeDecidir({ perfil: "Presbitério", vinculoId: null }, e, obraA)), "Presbitério não decide nenhuma etapa");
ok([1,2,3,4].every((e) => !podeDecidir(pastor, e, obraA)), "Pastor Local não decide nenhuma etapa (só solicita)");

console.log(falhas === 0 ? "\nESCOPO: TODOS OS TESTES PASSARAM" : `\nESCOPO: ${falhas} FALHA(S)`);
process.exit(falhas ? 1 : 0);
