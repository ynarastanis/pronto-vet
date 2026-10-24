import { z } from "zod";

export const schemaProcedimento = z.object({
  nome: z
    .string({ error: "Informe o nome." })
    .trim()
    .min(1, { error: "Informe o nome." })
    .max(150, { error: "Máximo de 150 caracteres." }),
  descricaoTecnica: z
    .string({ error: "Informe a descrição da técnica." })
    .trim()
    .min(1, { error: "Informe a descrição da técnica." })
    .max(10000, { error: "Máximo de 10000 caracteres." }),
  prescricao: z
    .string({ error: "Informe a prescrição." })
    .trim()
    .min(1, { error: "Informe a prescrição." })
    .max(10000, { error: "Máximo de 10000 caracteres." }),
});

export type DadosProcedimentoForm = z.infer<typeof schemaProcedimento>;
