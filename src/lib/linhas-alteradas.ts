/**
 * Índices (base 0) das linhas de `novo` que não existem em `anterior`,
 * comparando por subsequência comum mais longa. Linhas em branco nunca são
 * realçadas. Sem texto anterior, nada é realçado.
 */
export function linhasAlteradas(anterior: string | null, novo: string): number[] {
  if (anterior === null) return [];
  const a = anterior.split("\n");
  const b = novo.split("\n");

  // tabela do tamanho da LCS de sufixos
  const tabela: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      tabela[i][j] =
        a[i] === b[j]
          ? tabela[i + 1][j + 1] + 1
          : Math.max(tabela[i + 1][j], tabela[i][j + 1]);
    }
  }

  const alteradas: number[] = [];
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      i++;
      j++;
    } else if (i < a.length && tabela[i + 1][j] >= tabela[i][j + 1]) {
      i++;
    } else {
      if (b[j].trim() !== "") alteradas.push(j);
      j++;
    }
  }
  return alteradas;
}
