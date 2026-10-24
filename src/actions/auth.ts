"use server";

import { redirect } from "next/navigation";
import { criarSessao, encerrarSessao } from "@/lib/auth/sessao";
import { senhaConfere } from "@/lib/auth/token";
import type { ResultadoAcao } from "@/lib/validacao/validar";

export async function entrar(
  _estado: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const senha = formData.get("senha");
  const digitada = typeof senha === "string" ? senha : "";
  if (!(await senhaConfere(digitada, process.env.APP_PASSWORD))) {
    await new Promise((resolver) => setTimeout(resolver, 1000));
    return { ok: false, erros: { senha: "Senha incorreta." } };
  }
  await criarSessao();
  redirect("/");
}

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/entrar");
}
