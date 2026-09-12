// Dados DEMONSTRATIVOS da linha do tempo de versões. Servem apenas para
// exibir a interface desta tela: não são o histórico real do projeto, que
// continua registrado em docs/10-HISTORICO-DESENVOLVIMENTO.md e é exibido
// no fim da página.

export const TIPOS_ALTERACAO = [
  "Nova funcionalidade",
  "Melhoria",
  "Correção",
  "Segurança",
  "Regra de negócio",
] as const;
export type TipoAlteracao = (typeof TIPOS_ALTERACAO)[number];

export type VersaoSistema = {
  versao: string;
  data: string; // ISO (AAAA-MM-DD)
  titulo: string;
  tipo: TipoAlteracao;
  resumo: string;
  itens: string[];
};

export const VERSOES: VersaoSistema[] = [
  {
    versao: "1.2.0",
    data: "2026-09-10",
    titulo: "Estrutura administrativa completa",
    tipo: "Nova funcionalidade",
    resumo:
      "Cadastro dos quatro níveis da estrutura, com listas, visualização e edição.",
    itens: [
      "Telas de Regiões, Áreas, Polos e Igrejas.",
      "Formulários de cadastro e edição em cada nível.",
      "Visualização mostrando os registros vinculados ao nível seguinte.",
    ],
  },
  {
    versao: "1.1.2",
    data: "2026-08-29",
    titulo: "Ajuste nos totais do dashboard",
    tipo: "Correção",
    resumo:
      "Obras canceladas deixaram de ser somadas no valor total estimado.",
    itens: [
      "Correção na contagem das obras por prioridade.",
      "Arredondamento dos valores exibidos nos cartões.",
    ],
  },
  {
    versao: "1.1.1",
    data: "2026-08-21",
    titulo: "Revisão de acesso por perfil",
    tipo: "Segurança",
    resumo:
      "Cada usuário passa a visualizar apenas as obras da sua abrangência.",
    itens: [
      "Validação da sessão nas páginas internas.",
      "Registro de quem acessou cada solicitação.",
      "Expiração automática da sessão inativa.",
    ],
  },
  {
    versao: "1.1.0",
    data: "2026-08-12",
    titulo: "Orçamentos de material e mão de obra",
    tipo: "Nova funcionalidade",
    resumo:
      "Três orçamentos por categoria, com seleção e resumo dos valores.",
    itens: [
      "Cadastro de fornecedor, valor e data por orçamento.",
      "Seleção do orçamento escolhido em cada categoria.",
      "Resumo com total de material, mão de obra e total estimado.",
    ],
  },
  {
    versao: "1.0.3",
    data: "2026-07-30",
    titulo: "Prioridade Emergencial no topo da fila",
    tipo: "Regra de negócio",
    resumo:
      "Solicitações emergenciais passam a ser listadas antes das demais prioridades.",
    itens: [
      "Ordenação das listas por prioridade e data.",
      "Destaque visual das obras emergenciais no dashboard.",
    ],
  },
  {
    versao: "1.0.2",
    data: "2026-07-18",
    titulo: "Melhorias de navegação em celular",
    tipo: "Melhoria",
    resumo:
      "Menu lateral sobreposto e listas em cartões nas telas estreitas.",
    itens: [
      "Abertura e fechamento do menu pelo topo da tela.",
      "Tabelas convertidas em cartões no celular.",
      "Barra superior fixa ao rolar a página.",
    ],
  },
  {
    versao: "1.0.1",
    data: "2026-07-05",
    titulo: "Correção no envio de solicitações",
    tipo: "Correção",
    resumo:
      "Campos obrigatórios passaram a ser sinalizados antes do envio.",
    itens: [
      "Aviso quando a descrição da necessidade fica em branco.",
      "Bloqueio do envio duplicado da mesma solicitação.",
    ],
  },
  {
    versao: "1.0.0",
    data: "2026-06-24",
    titulo: "Primeira versão em uso",
    tipo: "Nova funcionalidade",
    resumo:
      "Solicitação de obras, linha do tempo de aprovações e acompanhamento da execução.",
    itens: [
      "Dashboard com indicadores das obras.",
      "Solicitação de obra e detalhes em abas.",
      "Aprovações do Pastor Local ao Presbitério.",
      "Execução acompanhada em cinco fases.",
    ],
  },
  {
    versao: "0.9.0",
    data: "2026-06-02",
    titulo: "Versão de homologação",
    tipo: "Melhoria",
    resumo:
      "Ajustes de layout e textos após a primeira avaliação dos responsáveis.",
    itens: [
      "Padronização das cores de prioridade e status.",
      "Revisão dos termos usados nas telas.",
    ],
  },
];

export function formatarDataVersao(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
