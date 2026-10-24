import { z } from "zod";

export const schemaProfissional = z.object({
  nome: z
    .string({ error: "Informe o nome." })
    .trim()
    .min(1, { error: "Informe o nome." })
    .max(120, { error: "Máximo de 120 caracteres." }),
  papel: z.enum(["CIRURGIAO", "ANESTESISTA"], { error: "Selecione o papel." }),
});

export type DadosProfissional = z.infer<typeof schemaProfissional>;
