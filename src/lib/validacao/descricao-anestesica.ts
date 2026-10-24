import { z } from "zod";

export const OPCOES_ASA = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "I E",
  "II E",
  "III E",
  "IV E",
  "V E",
] as const;

/** Texto opcional: ausente, vazio ou só com espaços vira `null`. */
const opcional = z
  .string()
  .trim()
  .max(2000, { error: "Máximo de 2000 caracteres." })
  .nullish()
  .transform((valor) => (valor ? valor : null));

export const schemaDescricaoAnestesica = z.object({
  asa: z.enum(OPCOES_ASA, { error: "Selecione a classificação ASA." }),
  mpa: opcional,
  inducao: opcional,
  manutencao: opcional,
  bloqueioLocal: opcional,
  analgesiaTrans: opcional,
  antibioticoPre: opcional,
  posImediato: opcional,
  observacoes: opcional,
});

export type DadosDescricaoAnestesicaForm = z.infer<typeof schemaDescricaoAnestesica>;
