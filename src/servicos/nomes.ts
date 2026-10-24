/** Ordenação de nomes (pt-BR) compartilhada pelas duas fontes de dados. */
export function compararNomes(a: string, b: string): number {
  return a.localeCompare(b, "pt-BR");
}

/**
 * Regra de busca compartilhada pelas duas fontes: termo sem espaços nas pontas, sem diferenciar
 * maiúsculas (inclusive acentuadas) e com `%` / `_` literais. Termo vazio casa com tudo.
 */
export function nomeContemTermo(nome: string, termo: string): boolean {
  return nome.toLowerCase().includes(termo.trim().toLowerCase());
}
