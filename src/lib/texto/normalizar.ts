/** Converte \r\n e \r em \n, remove espaços nas pontas; null/undefined viram "". */
export function normalizarTexto(valor: string | null | undefined): string {
  if (valor == null) return "";
  return valor.replace(/\r\n?/g, "\n").trim();
}
