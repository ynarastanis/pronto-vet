export const MAXIMO_RECENTES = 4;

export const CHAVE_CIRURGIOES_RECENTES = "prontovet:cirurgioesRecentes";
export const CHAVE_ANESTESISTAS_RECENTES = "prontovet:anestesistasRecentes";

/** Coloca o id no início, sem repetir, limitado a `maximo`. Não altera a lista original. */
export function registrarRecente(
  recentes: string[],
  id: string,
  maximo = MAXIMO_RECENTES,
): string[] {
  return [id, ...recentes.filter((r) => r !== id)].slice(0, maximo);
}

/** Descarta ids que não existem mais e repetidos; mantém a ordem e o limite. */
export function resolverRecentes(
  recentes: string[],
  idsExistentes: string[],
  maximo = MAXIMO_RECENTES,
): string[] {
  const existentes = new Set(idsExistentes);
  const unicos: string[] = [];
  for (const id of recentes) {
    if (existentes.has(id) && !unicos.includes(id)) unicos.push(id);
  }
  return unicos.slice(0, maximo);
}

/** Lê o JSON salvo; qualquer formato inesperado vira lista vazia. */
export function lerListaRecentes(bruto: string | null): string[] {
  if (bruto === null) return [];
  try {
    const valor: unknown = JSON.parse(bruto);
    if (!Array.isArray(valor)) return [];
    return valor.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

function semAcento(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** Filtra por trecho do nome, sem diferenciar maiúsculas nem acentos. */
export function filtrarPorTexto<T extends { nome: string }>(
  itens: T[],
  texto: string,
): T[] {
  const busca = semAcento(texto.trim());
  if (busca === "") return itens;
  return itens.filter((i) => semAcento(i.nome).includes(busca));
}
