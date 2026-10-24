import { db } from "@/lib/db";
import { compararNomes } from "../nomes";
import type { Papel, Profissional, ServicoProfissionais } from "../tipos";
import { traduzirErroPrisma } from "./erros";

type LinhaProfissional = { id: string; nome: string; papel: Papel };

function paraDominio(linha: LinhaProfissional): Profissional {
  return { id: linha.id, nome: linha.nome, papel: linha.papel };
}

export function criarServicoProfissionais(): ServicoProfissionais {
  return {
    async listar() {
      try {
        const linhas = await db.profissional.findMany();
        return linhas.map(paraDominio).sort((a, b) => compararNomes(a.nome, b.nome));
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async criar(dados) {
      try {
        return paraDominio(
          await db.profissional.create({ data: { nome: dados.nome, papel: dados.papel } }),
        );
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async atualizar(id, dados) {
      try {
        return paraDominio(
          await db.profissional.update({
            where: { id },
            data: { nome: dados.nome, papel: dados.papel },
          }),
        );
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async excluir(id) {
      try {
        await db.profissional.deleteMany({ where: { id } });
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
  };
}
