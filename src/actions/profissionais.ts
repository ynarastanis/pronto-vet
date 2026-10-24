"use server";

import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exigirSessao } from "@/lib/auth/sessao";
import { schemaProfissional } from "@/lib/validacao/profissional";
import { validarFormulario, type ResultadoAcao } from "@/lib/validacao/validar";
import { ErroNaoEncontrado } from "@/servicos/erros";
import { servicos } from "@/servicos";

function revalidar() {
  revalidatePath("/profissionais");
  revalidatePath("/");
}

export async function criarProfissional(
  _estado: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirSessao();
  const resultado = validarFormulario(schemaProfissional, formData);
  if (!resultado.ok) {
    return { ok: false, erros: resultado.erros };
  }
  await servicos().profissionais.criar(resultado.dados);
  revalidar();
  return { ok: true };
}

export async function atualizarProfissional(
  id: string,
  _estado: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirSessao();
  const resultado = validarFormulario(schemaProfissional, formData);
  if (!resultado.ok) {
    return { ok: false, erros: resultado.erros };
  }
  try {
    await servicos().profissionais.atualizar(id, resultado.dados);
  } catch (erro) {
    if (erro instanceof ErroNaoEncontrado) {
      notFound();
    }
    throw erro;
  }
  revalidar();
  return { ok: true };
}

export async function excluirProfissional(id: string): Promise<void> {
  await exigirSessao();
  await servicos().profissionais.excluir(id);
  revalidar();
}
