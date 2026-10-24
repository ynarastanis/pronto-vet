"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { exigirSessao } from "@/lib/auth/sessao";
import { schemaDescricaoAnestesica } from "@/lib/validacao/descricao-anestesica";
import { schemaProcedimento } from "@/lib/validacao/procedimento";
import { validarFormulario, type ResultadoAcao } from "@/lib/validacao/validar";
import { ErroNaoEncontrado, ErroNomeDuplicado } from "@/servicos/erros";
import { servicos } from "@/servicos";

const MENSAGEM_DUPLICADO = "Já existe um procedimento com este nome.";

function revalidar() {
  revalidatePath("/procedimentos");
  revalidatePath("/");
}

export async function criarProcedimento(
  _estado: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirSessao();
  const validacao = validarFormulario(schemaProcedimento, formData);
  if (!validacao.ok) return { ok: false, erros: validacao.erros };

  let id: string;
  try {
    const criado = await servicos().procedimentos.criar(validacao.dados);
    id = criado.id;
  } catch (erro) {
    if (erro instanceof ErroNomeDuplicado) {
      return { ok: false, erros: { nome: MENSAGEM_DUPLICADO } };
    }
    throw erro;
  }
  revalidar();
  redirect(`/procedimentos/${id}`);
}

export async function atualizarProcedimento(
  id: string,
  _estado: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirSessao();
  const validacao = validarFormulario(schemaProcedimento, formData);
  if (!validacao.ok) return { ok: false, erros: validacao.erros };

  let naoEncontrado = false;
  try {
    await servicos().procedimentos.atualizar(id, validacao.dados);
  } catch (erro) {
    if (erro instanceof ErroNomeDuplicado) {
      return { ok: false, erros: { nome: MENSAGEM_DUPLICADO } };
    }
    if (erro instanceof ErroNaoEncontrado) {
      naoEncontrado = true;
    } else {
      throw erro;
    }
  }
  if (naoEncontrado) notFound();
  revalidar();
  revalidatePath(`/procedimentos/${id}`);
  return { ok: true };
}

export async function excluirProcedimento(id: string): Promise<void> {
  await exigirSessao();
  await servicos().procedimentos.excluir(id);
  revalidar();
  redirect("/procedimentos");
}

export async function salvarDescricaoAnestesica(
  procedimentoId: string,
  _estado: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirSessao();
  const validacao = validarFormulario(schemaDescricaoAnestesica, formData);
  if (!validacao.ok) return { ok: false, erros: validacao.erros };

  let naoEncontrado = false;
  try {
    await servicos().procedimentos.salvarDescricaoAnestesica(
      procedimentoId,
      validacao.dados,
    );
  } catch (erro) {
    if (erro instanceof ErroNaoEncontrado) {
      naoEncontrado = true;
    } else {
      throw erro;
    }
  }
  if (naoEncontrado) notFound();
  revalidar();
  revalidatePath(`/procedimentos/${procedimentoId}`);
  return { ok: true };
}
