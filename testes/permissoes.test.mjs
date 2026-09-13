// Testes da matriz de permissões (DEC-011 + renumeração de DEC-013).
// Rodar com: node --experimental-strip-types testes/permissoes.test.mjs
import {
  PERFIS, AREAS, areaDaRota, podeAcessarRota, podeAcessarArea,
  podeDecidirEtapa, etapaDoPerfil, areasDoPerfil, ehPerfil,
} from "../src/lib/permissoes.ts";

let falhas = 0;
const ok = (c, m) => { console.log((c ? "  ok  " : "FALHOU") + " | " + m); if (!c) falhas++; };

const rotas = {
  "/": "dashboard", "/obras": "obras", "/obras/nova": "obras", "/obras/2026-0001": "obras",
  "/regioes": "estrutura", "/areas/a1/editar": "estrutura", "/polos/p1": "estrutura",
  "/igrejas": "estrutura", "/usuarios": "usuarios", "/estoque": "estoque",
  "/historico": "historico", "/configuracoes": "configuracoes",
  "/configuracoes/banco": "configuracoes",
};
for (const [rota, area] of Object.entries(rotas)) ok(areaDaRota(rota) === area, `rota ${rota} → ${area}`);
ok(areaDaRota("/rota-inexistente") === null, "rota desconhecida → nenhuma área");
ok(!podeAcessarRota("Administrador", "/rota-inexistente"), "rota desconhecida negada até para Administrador");
ok(AREAS.every((a) => podeAcessarArea("Administrador", a)), "Administrador acessa todas as áreas");

for (const perfil of PERFIS.filter((p) => p !== "Administrador")) {
  ok(podeAcessarRota(perfil, "/obras"), `${perfil} acessa Obras`);
  ok(!podeAcessarRota(perfil, "/usuarios"), `${perfil} NÃO acessa Usuários`);
  ok(!podeAcessarRota(perfil, "/regioes"), `${perfil} NÃO acessa a estrutura administrativa`);
}

// Etapas renumeradas (DEC-013): 4 etapas, sem Pastor Local e sem Presbitério.
const etapas = { "Coordenador de Polo": 1, "Coordenador de Área": 2,
                 "Coordenador de Região": 3, "Responsável COMBENS": 4 };
for (const [perfil, etapa] of Object.entries(etapas)) {
  ok(etapaDoPerfil(perfil) === etapa, `${perfil} decide a etapa ${etapa}`);
  for (let outra = 1; outra <= 4; outra++)
    if (outra !== etapa) ok(!podeDecidirEtapa(perfil, outra), `${perfil} NÃO decide a etapa ${outra}`);
}
ok(etapaDoPerfil("Pastor Local") === null, "Pastor Local não decide etapa (só solicita)");
ok([1,2,3,4].every((e) => !podeDecidirEtapa("Pastor Local", e)), "Pastor Local não decide nenhuma etapa");
ok(etapaDoPerfil("Presbitério") === null, "Presbitério não decide etapa (resultado vem do SGI)");
ok([1,2,3,4].every((e) => !podeDecidirEtapa("Presbitério", e)), "Presbitério não decide nenhuma etapa");
ok([1,2,3,4].every((e) => podeDecidirEtapa("Administrador", e)), "Administrador decide qualquer etapa");

ok(!podeAcessarRota(null, "/"), "usuário sem perfil não acessa o Dashboard");
ok(!podeDecidirEtapa(null, 1), "usuário sem perfil não decide etapa");
ok(!ehPerfil("Coordenador"), "perfil inválido é rejeitado");
ok(areasDoPerfil("Pastor Local").length === 2, "Pastor Local tem 2 áreas: " + areasDoPerfil("Pastor Local").join(", "));

console.log(falhas === 0 ? "\nPERMISSÕES: TODOS OS TESTES PASSARAM" : `\nPERMISSÕES: ${falhas} FALHA(S)`);
process.exit(falhas ? 1 : 0);
