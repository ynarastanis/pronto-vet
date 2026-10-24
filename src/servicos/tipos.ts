import type { DadosDescricaoAnestesica } from "@/lib/texto/tipos";
import type { DadosDescricaoAnestesicaForm } from "@/lib/validacao/descricao-anestesica";
import type { DadosProcedimentoForm } from "@/lib/validacao/procedimento";
import type { DadosProfissional } from "@/lib/validacao/profissional";

export type Papel = "CIRURGIAO" | "ANESTESISTA";

export type Profissional = { id: string; nome: string; papel: Papel };

export type Procedimento = {
  id: string;
  nome: string;
  descricaoTecnica: string;
  prescricao: string;
  descricaoAnestesica: DadosDescricaoAnestesica | null;
};

export type ProcedimentoCompleto = Procedimento & {
  descricaoAnestesica: DadosDescricaoAnestesica;
};

export type ProcedimentoResumo = {
  id: string;
  nome: string;
  temDescricaoAnestesica: boolean;
};

export interface ServicoProfissionais {
  /** Ordenado por nome (pt-BR). */
  listar(): Promise<Profissional[]>;
  criar(dados: DadosProfissional): Promise<Profissional>;
  /** Lança ErroNaoEncontrado. */
  atualizar(id: string, dados: DadosProfissional): Promise<Profissional>;
  /** Id inexistente: no-op. */
  excluir(id: string): Promise<void>;
}

export interface ServicoProcedimentos {
  /** Busca por nome sem diferenciar maiúsculas; ordenado por nome. */
  listar(busca?: string): Promise<ProcedimentoResumo[]>;
  /** Só procedimentos com descrição anestésica. */
  listarCompletos(): Promise<ProcedimentoCompleto[]>;
  obter(id: string): Promise<Procedimento | null>;
  /** Lança ErroNomeDuplicado. */
  criar(dados: DadosProcedimentoForm): Promise<Procedimento>;
  /** Lança ErroNaoEncontrado ou ErroNomeDuplicado. */
  atualizar(id: string, dados: DadosProcedimentoForm): Promise<Procedimento>;
  /** Remove a descrição anestésica junto; id inexistente: no-op. */
  excluir(id: string): Promise<void>;
  /** Upsert. Lança ErroNaoEncontrado. */
  salvarDescricaoAnestesica(
    procedimentoId: string,
    dados: DadosDescricaoAnestesicaForm,
  ): Promise<void>;
}

export type Servicos = {
  profissionais: ServicoProfissionais;
  procedimentos: ServicoProcedimentos;
};
