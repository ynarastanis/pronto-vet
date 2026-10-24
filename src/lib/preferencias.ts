export const CHAVE_CIRURGIAO = "prontovet:cirurgiaoId";
export const CHAVE_ANESTESISTA = "prontovet:anestesistaId";

/** Id salvo que não está mais na lista (profissional excluído) vira null. */
export function resolverIdSalvo(
  idSalvo: string | null,
  idsDisponiveis: string[],
): string | null {
  if (idSalvo === null) return null;
  return idsDisponiveis.includes(idSalvo) ? idSalvo : null;
}

/** localStorage indisponível ou bloqueado: devolve null. */
export function lerPreferencia(chave: string): string | null {
  try {
    return globalThis.localStorage?.getItem(chave) ?? null;
  } catch {
    return null;
  }
}

/** null remove a chave. Falhas de armazenamento são ignoradas. */
export function gravarPreferencia(chave: string, valor: string | null): void {
  try {
    const armazenamento = globalThis.localStorage;
    if (!armazenamento) return;
    if (valor === null) armazenamento.removeItem(chave);
    else armazenamento.setItem(chave, valor);
  } catch {
    // sem armazenamento: a preferência simplesmente não é lembrada
  }
}
