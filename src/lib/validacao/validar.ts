import type { z } from "zod";

export type ErrosCampos = Record<string, string>;

export type ResultadoValidacao<T> =
  | { ok: true; dados: T }
  | { ok: false; erros: ErrosCampos };

/** Estado do `useActionState` nas Server Actions. */
export type ResultadoAcao = { ok: true } | { ok: false; erros: ErrosCampos } | null;

export function validarFormulario<T>(
  schema: z.ZodType<T>,
  formData: FormData,
): ResultadoValidacao<T> {
  const resultado = schema.safeParse(Object.fromEntries(formData));
  if (resultado.success) {
    return { ok: true, dados: resultado.data };
  }
  const erros: ErrosCampos = {};
  for (const issue of resultado.error.issues) {
    const campo = String(issue.path[0] ?? "formulario");
    if (!(campo in erros)) {
      erros[campo] = issue.message;
    }
  }
  return { ok: false, erros };
}
