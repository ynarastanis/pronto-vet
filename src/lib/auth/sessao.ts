import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DURACAO_SESSAO_MS, NOME_COOKIE, assinarToken, verificarToken } from "./token";

export async function criarSessao(): Promise<void> {
  const expiraEm = Date.now() + DURACAO_SESSAO_MS;
  const token = await assinarToken(process.env.APP_SECRET, expiraEm);
  const jar = await cookies();
  jar.set(NOME_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SESSAO_MS / 1000,
  });
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  jar.delete(NOME_COOKIE);
}

/**
 * Primeira linha de TODA Server Action: sessão inválida redireciona para /entrar.
 * Não pode ficar dentro de try/catch (redirect() lança NEXT_REDIRECT).
 */
export async function exigirSessao(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(NOME_COOKIE)?.value;
  const valido = await verificarToken(token, process.env.APP_SECRET, Date.now());
  if (!valido) redirect("/entrar");
}
