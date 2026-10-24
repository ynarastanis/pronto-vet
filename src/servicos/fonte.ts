export type FonteDados = "memoria" | "prisma";

/** Só "memoria" (após trim, sem diferenciar maiúsculas) ativa o mock; todo o resto é banco. */
export function escolherFonte(valor: string | undefined): FonteDados {
  return valor?.trim().toLowerCase() === "memoria" ? "memoria" : "prisma";
}
