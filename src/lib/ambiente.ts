/** Rótulo do ambiente para o cabeçalho; `null` em produção (nada é exibido). */
export function rotuloAmbiente(vercelEnv: string | undefined): string | null {
  if (vercelEnv === "production") return null;
  if (vercelEnv === "preview") return "Preview";
  if (!vercelEnv || vercelEnv === "development") return "Local";
  return vercelEnv;
}
