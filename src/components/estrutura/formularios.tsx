import {
  Campo,
  FormularioCadastro,
  classeCampo,
} from "@/components/formulario-cadastro";
import {
  AREAS,
  POLOS,
  REGIOES,
  type Area,
  type Igreja,
  type Polo,
  type Regiao,
} from "@/lib/estrutura-mock";

// Formulários visuais dos quatro cadastros da estrutura administrativa.
// Quando um registro é passado, os campos vêm preenchidos (modo edição).
// Nada é gravado em nenhum dos casos.

function SelectStatus({ valor }: { valor?: string }) {
  return (
    <select
      id="status"
      name="status"
      className={classeCampo}
      defaultValue={valor ?? "Ativo"}
    >
      <option value="Ativo">Ativo</option>
      <option value="Inativo">Inativo</option>
    </select>
  );
}

export function FormularioRegiao({ regiao }: { regiao?: Regiao }) {
  return (
    <FormularioCadastro
      voltarHref={regiao ? `/regioes/${regiao.id}` : "/regioes"}
      rotuloSalvar={regiao ? "Salvar alterações" : "Salvar região"}
    >
      <Campo id="nome" rotulo="Nome da região" largura="inteira">
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={80}
          placeholder="Ex.: Região Litoral"
          defaultValue={regiao?.nome}
          className={classeCampo}
        />
      </Campo>

      <Campo id="codigo" rotulo="Código" ajuda="Código interno da região.">
        <input
          id="codigo"
          name="codigo"
          type="text"
          required
          maxLength={10}
          placeholder="Ex.: R01"
          defaultValue={regiao?.codigo}
          className={classeCampo}
        />
      </Campo>

      <Campo id="status" rotulo="Status">
        <SelectStatus valor={regiao?.status} />
      </Campo>

      <Campo
        id="responsavel"
        rotulo="Coordenador da Região"
        largura="inteira"
        ajuda="Vínculo com usuários do sistema será feito em etapa futura."
      >
        <input
          id="responsavel"
          name="responsavel"
          type="text"
          maxLength={80}
          placeholder="Nome do responsável"
          defaultValue={regiao?.responsavel}
          className={classeCampo}
        />
      </Campo>
    </FormularioCadastro>
  );
}

export function FormularioArea({ area }: { area?: Area }) {
  return (
    <FormularioCadastro
      voltarHref={area ? `/areas/${area.id}` : "/areas"}
      rotuloSalvar={area ? "Salvar alterações" : "Salvar área"}
    >
      <Campo id="regiao" rotulo="Região vinculada" largura="inteira">
        <select
          id="regiao"
          name="regiao"
          required
          className={classeCampo}
          defaultValue={area?.regiaoId ?? ""}
        >
          <option value="" disabled>
            Selecione a região
          </option>
          {REGIOES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.codigo} · {r.nome}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="nome" rotulo="Nome da área" largura="inteira">
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={80}
          placeholder="Ex.: Área João Pessoa"
          defaultValue={area?.nome}
          className={classeCampo}
        />
      </Campo>

      <Campo id="codigo" rotulo="Código" ajuda="Código interno da área.">
        <input
          id="codigo"
          name="codigo"
          type="text"
          required
          maxLength={10}
          placeholder="Ex.: A01"
          defaultValue={area?.codigo}
          className={classeCampo}
        />
      </Campo>

      <Campo id="status" rotulo="Status">
        <SelectStatus valor={area?.status} />
      </Campo>

      <Campo
        id="responsavel"
        rotulo="Coordenador da Área"
        largura="inteira"
        ajuda="Vínculo com usuários do sistema será feito em etapa futura."
      >
        <input
          id="responsavel"
          name="responsavel"
          type="text"
          maxLength={80}
          placeholder="Nome do responsável"
          defaultValue={area?.responsavel}
          className={classeCampo}
        />
      </Campo>
    </FormularioCadastro>
  );
}

export function FormularioPolo({ polo }: { polo?: Polo }) {
  return (
    <FormularioCadastro
      voltarHref={polo ? `/polos/${polo.id}` : "/polos"}
      rotuloSalvar={polo ? "Salvar alterações" : "Salvar polo"}
    >
      <Campo
        id="area"
        rotulo="Área vinculada"
        largura="inteira"
        ajuda="A região é definida pela área escolhida."
      >
        <select
          id="area"
          name="area"
          required
          className={classeCampo}
          defaultValue={polo?.areaId ?? ""}
        >
          <option value="" disabled>
            Selecione a área
          </option>
          {AREAS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.codigo} · {a.nome}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="nome" rotulo="Nome do polo" largura="inteira">
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={80}
          placeholder="Ex.: Polo Centro"
          defaultValue={polo?.nome}
          className={classeCampo}
        />
      </Campo>

      <Campo id="codigo" rotulo="Código" ajuda="Código interno do polo.">
        <input
          id="codigo"
          name="codigo"
          type="text"
          required
          maxLength={10}
          placeholder="Ex.: P01"
          defaultValue={polo?.codigo}
          className={classeCampo}
        />
      </Campo>

      <Campo id="status" rotulo="Status">
        <SelectStatus valor={polo?.status} />
      </Campo>

      <Campo
        id="responsavel"
        rotulo="Coordenador do Polo"
        largura="inteira"
        ajuda="Vínculo com usuários do sistema será feito em etapa futura."
      >
        <input
          id="responsavel"
          name="responsavel"
          type="text"
          maxLength={80}
          placeholder="Nome do responsável"
          defaultValue={polo?.responsavel}
          className={classeCampo}
        />
      </Campo>
    </FormularioCadastro>
  );
}

export function FormularioIgreja({ igreja }: { igreja?: Igreja }) {
  return (
    <FormularioCadastro
      voltarHref={igreja ? `/igrejas/${igreja.id}` : "/igrejas"}
      rotuloSalvar={igreja ? "Salvar alterações" : "Salvar igreja"}
    >
      <Campo
        id="polo"
        rotulo="Polo vinculado"
        largura="inteira"
        ajuda="A área e a região são definidas pelo polo escolhido."
      >
        <select
          id="polo"
          name="polo"
          required
          className={classeCampo}
          defaultValue={igreja?.poloId ?? ""}
        >
          <option value="" disabled>
            Selecione o polo
          </option>
          {POLOS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.codigo} · {p.nome}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="nome" rotulo="Nome da igreja" largura="inteira">
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={80}
          placeholder="Ex.: Igreja Exemplo Centro"
          defaultValue={igreja?.nome}
          className={classeCampo}
        />
      </Campo>

      <Campo id="codigo" rotulo="Código" ajuda="Código interno da igreja.">
        <input
          id="codigo"
          name="codigo"
          type="text"
          required
          maxLength={10}
          placeholder="Ex.: IG001"
          defaultValue={igreja?.codigo}
          className={classeCampo}
        />
      </Campo>

      <Campo id="cidade" rotulo="Cidade">
        <input
          id="cidade"
          name="cidade"
          type="text"
          required
          maxLength={80}
          placeholder="Ex.: João Pessoa"
          defaultValue={igreja?.cidade}
          className={classeCampo}
        />
      </Campo>

      <Campo id="status" rotulo="Status">
        <SelectStatus valor={igreja?.status} />
      </Campo>
    </FormularioCadastro>
  );
}
