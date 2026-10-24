export type DadosDescricaoAnestesica = {
  asa: string;
  mpa: string | null;
  inducao: string | null;
  manutencao: string | null;
  bloqueioLocal: string | null;
  analgesiaTrans: string | null;
  antibioticoPre: string | null;
  posImediato: string | null;
  observacoes: string | null;
};

export type DadosProcedimento = {
  nome: string;
  descricaoTecnica: string;
  prescricao: string;
  descricaoAnestesica: DadosDescricaoAnestesica;
};

export type EntradaGeracao = {
  procedimento: DadosProcedimento;
  /** Nome do cirurgião. */
  cirurgiao: string | null;
  /** Nome do anestesista. */
  anestesista: string | null;
  /** Texto livre, pode ser "". */
  peso: string;
};
