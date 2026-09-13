// Migrações do banco, em ordem. Cada migração é uma lista de comandos SQL
// aplicados em transação e registrados na tabela `migracoes`, para nunca
// rodarem duas vezes. A aplicação é feita pela tela Configurações → Banco de
// dados (só Administrador) e o SQL fica aqui, versionado, como fonte única.

export type Migracao = {
  id: string;
  titulo: string;
  descricao: string;
  comandos: string[];
};

export const MIGRACOES: Migracao[] = [
  {
    id: "001",
    titulo: "Fluxo de aprovação",
    descricao:
      "Estado do fluxo de cada solicitação e histórico das decisões (DEC-010).",
    comandos: [
      `create table if not exists fluxo_aprovacao (
         obra_id        text        primary key,
         etapa_atual    smallint    not null default 1 check (etapa_atual between 1 and 6),
         situacao       text        not null default 'Em andamento'
                        check (situacao in ('Em andamento', 'Em correção', 'Reprovada', 'Aprovada')),
         criado_em      timestamptz not null default now(),
         atualizado_em  timestamptz not null default now()
       )`,
      `create table if not exists decisoes_aprovacao (
         id             bigserial   primary key,
         obra_id        text        not null,
         etapa          smallint    not null check (etapa between 1 and 6),
         nivel          text        not null,
         decisao        text        not null
                        check (decisao in ('Aprovado', 'Reprovado', 'Correção solicitada',
                                           'Reenviada após correção')),
         comentario     text,
         usuario_id     text        not null,
         usuario_nome   text        not null,
         usuario_email  text,
         criado_em      timestamptz not null default now()
       )`,
      `create index if not exists decisoes_aprovacao_obra_idx
         on decisoes_aprovacao (obra_id, id)`,
    ],
  },
  {
    id: "002",
    titulo: "Estrutura administrativa",
    descricao:
      "Regiões, áreas, polos e igrejas, com os vínculos entre os níveis (DEC-012).",
    comandos: [
      `create table if not exists regioes (
         id            text        primary key,
         codigo        text        not null unique,
         nome          text        not null,
         status        text        not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
         responsavel   text,
         criado_em     timestamptz not null default now(),
         atualizado_em timestamptz not null default now()
       )`,
      `create table if not exists areas (
         id            text        primary key,
         codigo        text        not null unique,
         nome          text        not null,
         status        text        not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
         responsavel   text,
         regiao_id     text        not null references regioes (id),
         criado_em     timestamptz not null default now(),
         atualizado_em timestamptz not null default now()
       )`,
      `create table if not exists polos (
         id            text        primary key,
         codigo        text        not null unique,
         nome          text        not null,
         status        text        not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
         responsavel   text,
         area_id       text        not null references areas (id),
         criado_em     timestamptz not null default now(),
         atualizado_em timestamptz not null default now()
       )`,
      `create table if not exists igrejas (
         id            text        primary key,
         codigo        text        not null unique,
         nome          text        not null,
         status        text        not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
         cidade        text        not null,
         polo_id       text        not null references polos (id),
         criado_em     timestamptz not null default now(),
         atualizado_em timestamptz not null default now()
       )`,
      `create index if not exists areas_regiao_idx on areas (regiao_id)`,
      `create index if not exists polos_area_idx on polos (area_id)`,
      `create index if not exists igrejas_polo_idx on igrejas (polo_id)`,
    ],
  },
  {
    id: "003",
    titulo: "Dados de teste da estrutura administrativa",
    descricao:
      "Carrega as 4 regiões, 7 áreas, 12 polos e 16 igrejas fictícias usadas até agora. Pode ser removida com a limpeza documentada em docs/06-BANCO-DE-DADOS.md.",
    comandos: [
      `insert into regioes (id, codigo, nome, status, responsavel) values
         ('r1','R01','Região Litoral','Ativo','Irmão Exemplo Alves'),
         ('r2','R02','Região Agreste','Ativo','Irmão Exemplo Barros'),
         ('r3','R03','Região Sertão','Ativo','Irmão Exemplo Cunha'),
         ('r4','R04','Região Brejo','Inativo','A definir')
       on conflict (id) do nothing`,
      `insert into areas (id, codigo, nome, status, responsavel, regiao_id) values
         ('a1','A01','Área João Pessoa','Ativo','Irmão Exemplo Lima','r1'),
         ('a2','A02','Área Costa Norte','Ativo','Irmão Exemplo Freire','r1'),
         ('a3','A03','Área Campina Grande','Ativo','Irmão Exemplo Dantas','r2'),
         ('a4','A04','Área Serra do Agreste','Ativo','Irmão Exemplo Melo','r2'),
         ('a5','A05','Área Patos','Ativo','Irmão Exemplo Rocha','r3'),
         ('a6','A06','Área Alto Sertão','Ativo','Irmão Exemplo Vieira','r3'),
         ('a7','A07','Área Brejo Norte','Inativo','A definir','r4')
       on conflict (id) do nothing`,
      `insert into polos (id, codigo, nome, status, responsavel, area_id) values
         ('p1','P01','Polo Centro','Ativo','Irmão Exemplo Souza','a1'),
         ('p2','P02','Polo Zona Sul','Ativo','Irmão Exemplo Farias','a1'),
         ('p3','P03','Polo Litoral Norte','Ativo','Irmão Exemplo Ramos','a2'),
         ('p4','P04','Polo Praia','Ativo','Irmão Exemplo Duarte','a2'),
         ('p5','P05','Polo Campina Centro','Ativo','Irmão Exemplo Pereira','a3'),
         ('p6','P06','Polo Bairro Novo','Ativo','Irmão Exemplo Bezerra','a3'),
         ('p7','P07','Polo Serra Verde','Ativo','Irmão Exemplo Macedo','a4'),
         ('p8','P08','Polo Vale','Ativo','Irmão Exemplo Correia','a4'),
         ('p9','P09','Polo Patos Centro','Ativo','Irmão Exemplo Gomes','a5'),
         ('p10','P10','Polo Espinharas','Ativo','Irmão Exemplo Batista','a5'),
         ('p11','P11','Polo Sousa','Ativo','Irmão Exemplo Leite','a6'),
         ('p12','P12','Polo Cajazeiras','Inativo','A definir','a6')
       on conflict (id) do nothing`,
      `insert into igrejas (id, codigo, nome, status, cidade, polo_id) values
         ('i01','IG001','Igreja Exemplo Centro','Ativo','João Pessoa','p1'),
         ('i02','IG002','Igreja Exemplo Bairro Norte','Ativo','João Pessoa','p1'),
         ('i03','IG003','Igreja Exemplo Jardim Sul','Ativo','João Pessoa','p2'),
         ('i04','IG004','Igreja Exemplo Vila Nova','Ativo','Santa Rita','p2'),
         ('i05','IG005','Igreja Exemplo Litoral','Ativo','Cabedelo','p3'),
         ('i06','IG006','Igreja Exemplo Riacho Doce','Ativo','Bayeux','p3'),
         ('i07','IG007','Igreja Exemplo Praia Bela','Inativo','Pitimbu','p4'),
         ('i08','IG008','Igreja Exemplo Bela Vista','Ativo','Campina Grande','p5'),
         ('i09','IG009','Igreja Exemplo Morada Nova','Ativo','Campina Grande','p6'),
         ('i10','IG010','Igreja Exemplo Alto da Serra','Ativo','Esperança','p7'),
         ('i11','IG011','Igreja Exemplo Serra Branca','Ativo','Serra Branca','p7'),
         ('i12','IG012','Igreja Exemplo Vale','Ativo','Monteiro','p8'),
         ('i13','IG013','Igreja Exemplo Campo Verde','Ativo','Sumé','p8'),
         ('i14','IG014','Igreja Exemplo Sertão','Ativo','Patos','p9'),
         ('i15','IG015','Igreja Exemplo Espinharas','Ativo','Patos','p10'),
         ('i16','IG016','Igreja Exemplo Rio do Peixe','Ativo','Sousa','p11')
       on conflict (id) do nothing`,
    ],
  },
  {
    id: "004",
    titulo: "Fluxo com quatro etapas e resultado do SGI",
    descricao:
      "Ajusta as etapas para 1..4 (DEC-013) e acrescenta as colunas do resultado do SGI. Apaga os registros de teste do fluxo, porque a numeração das etapas mudou de significado.",
    comandos: [
      // Os registros anteriores usavam a numeração de seis etapas: mantê-los
      // tornaria o histórico incorreto.
      `delete from decisoes_aprovacao`,
      `delete from fluxo_aprovacao`,
      `alter table fluxo_aprovacao drop constraint if exists fluxo_aprovacao_etapa_atual_check`,
      `alter table fluxo_aprovacao
         add constraint fluxo_aprovacao_etapa_atual_check
         check (etapa_atual between 1 and 4)`,
      `alter table decisoes_aprovacao drop constraint if exists decisoes_aprovacao_etapa_check`,
      `alter table decisoes_aprovacao
         add constraint decisoes_aprovacao_etapa_check
         check (etapa between 1 and 4)`,
      // Resultado do SGI: fora das etapas do fluxo, registrado manualmente.
      `alter table fluxo_aprovacao
         add column if not exists sgi_situacao text
           check (sgi_situacao in ('Aguardando SGI', 'Aprovado no SGI', 'Reprovado no SGI'))`,
      `alter table fluxo_aprovacao
         add column if not exists sgi_valor_aprovado numeric(14,2)`,
      `alter table fluxo_aprovacao add column if not exists sgi_data date`,
      `alter table fluxo_aprovacao add column if not exists sgi_registrado_por text`,
      `alter table fluxo_aprovacao add column if not exists sgi_registrado_em timestamptz`,
    ],
  },
  {
    id: "005",
    titulo: "Solicitações de obras",
    descricao:
      "Tabela `obras` com a solicitação em si. O status não fica aqui: vem do fluxo de aprovação. A prioridade é definida depois pela CONBENS (DEC-013), por isso aceita vazio.",
    comandos: [
      `create table if not exists obras (
         id                      text        primary key,
         igreja_id               text        not null references igrejas (id),
         tipo                    text        not null
                                 check (tipo in ('Reforma', 'Ampliação', 'Construção', 'Manutenção')),
         titulo                  text        not null,
         descricao               text        not null,
         data_solicitacao        date        not null default current_date,
         responsavel_solicitacao text,
         prioridade              text
                                 check (prioridade in ('Emergencial', 'Prioridade 1',
                                                       'Prioridade 2', 'Prioridade 3')),
         criado_em               timestamptz not null default now()
       )`,
      `create index if not exists obras_igreja_idx on obras (igreja_id)`,
      `create index if not exists obras_data_idx on obras (data_solicitacao desc)`,
    ],
  },
  {
    id: "006",
    titulo: "Grafia CONBENS no histórico de decisões",
    descricao:
      "Atualiza o nome do nível gravado em decisoes_aprovacao de \"Responsável COMBENS\" para \"Responsável CONBENS\" (DEC-014). As migrações já aplicadas não são reescritas.",
    comandos: [
      `update decisoes_aprovacao
          set nivel = 'Responsável CONBENS'
        where nivel = 'Responsável COMBENS'`,
    ],
  },
];
