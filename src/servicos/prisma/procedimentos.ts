import { db } from "@/lib/db";
import type { DadosDescricaoAnestesica } from "@/lib/texto/tipos";
import type { DadosDescricaoAnestesicaForm } from "@/lib/validacao/descricao-anestesica";
import { ErroNaoEncontrado } from "../erros";
import { compararNomes, nomeContemTermo } from "../nomes";
import type { Procedimento, ProcedimentoCompleto, ServicoProcedimentos } from "../tipos";
import { traduzirErroPrisma } from "./erros";

const incluirDescricao = { descricaoAnestesica: true } as const;

type LinhaProcedimento = {
  id: string;
  nome: string;
  descricaoTecnica: string;
  prescricao: string;
  descricaoAnestesica: DadosDescricaoAnestesica | null;
};

/** Copia só os campos de domínio (descarta id, procedimentoId e datas da linha do banco). */
function camposDescricao(d: DadosDescricaoAnestesica): DadosDescricaoAnestesica {
  return {
    asa: d.asa,
    mpa: d.mpa,
    inducao: d.inducao,
    manutencao: d.manutencao,
    bloqueioLocal: d.bloqueioLocal,
    analgesiaTrans: d.analgesiaTrans,
    antibioticoPre: d.antibioticoPre,
    posImediato: d.posImediato,
    observacoes: d.observacoes,
  };
}

function paraDominio(linha: LinhaProcedimento): Procedimento {
  return {
    id: linha.id,
    nome: linha.nome,
    descricaoTecnica: linha.descricaoTecnica,
    prescricao: linha.prescricao,
    descricaoAnestesica: linha.descricaoAnestesica
      ? camposDescricao(linha.descricaoAnestesica)
      : null,
  };
}

export function criarServicoProcedimentos(): ServicoProcedimentos {
  return {
    async listar(busca = "") {
      try {
        // Filtro e ordenação em JS (mesma regra da memória): a collation do banco e o ILIKE não
        // garantem a mesma ordem nem a mesma busca fora do ASCII, e o volume é pequeno.
        const linhas = await db.procedimentoCirurgico.findMany({
          select: { id: true, nome: true, descricaoAnestesica: { select: { id: true } } },
        });
        return linhas
          .filter((p) => nomeContemTermo(p.nome, busca))
          .sort((a, b) => compararNomes(a.nome, b.nome))
          .map((p) => ({
            id: p.id,
            nome: p.nome,
            temDescricaoAnestesica: p.descricaoAnestesica !== null,
          }));
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async listarCompletos() {
      try {
        const linhas = await db.procedimentoCirurgico.findMany({
          where: { descricaoAnestesica: { isNot: null } },
          include: incluirDescricao,
        });
        return linhas
          .map(paraDominio)
          .filter((p): p is ProcedimentoCompleto => p.descricaoAnestesica !== null)
          .sort((a, b) => compararNomes(a.nome, b.nome));
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async obter(id) {
      try {
        const linha = await db.procedimentoCirurgico.findUnique({
          where: { id },
          include: incluirDescricao,
        });
        return linha ? paraDominio(linha) : null;
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async criar(dados) {
      try {
        const linha = await db.procedimentoCirurgico.create({
          data: {
            nome: dados.nome.trim(),
            descricaoTecnica: dados.descricaoTecnica,
            prescricao: dados.prescricao,
          },
        });
        // Procedimento recém-criado nunca tem descrição anestésica. Sem `include`: o driver HTTP
        // do Neon não suporta a transação implícita que o Prisma abre para escrita com relação.
        return paraDominio({ ...linha, descricaoAnestesica: null });
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async atualizar(id, dados) {
      try {
        const linha = await db.procedimentoCirurgico.update({
          where: { id },
          data: {
            nome: dados.nome.trim(),
            descricaoTecnica: dados.descricaoTecnica,
            prescricao: dados.prescricao,
          },
        });
        // Leitura separada (sem `include`) pelo mesmo motivo do `criar`: driver HTTP sem transação.
        const descricaoAnestesica = await db.descricaoAnestesica.findUnique({
          where: { procedimentoId: id },
        });
        return paraDominio({ ...linha, descricaoAnestesica });
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async excluir(id) {
      try {
        // A descrição anestésica sai junto (onDelete: Cascade); id inexistente é no-op.
        await db.procedimentoCirurgico.deleteMany({ where: { id } });
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
    async salvarDescricaoAnestesica(procedimentoId, dados: DadosDescricaoAnestesicaForm) {
      try {
        const existe = await db.procedimentoCirurgico.findUnique({
          where: { id: procedimentoId },
          select: { id: true },
        });
        if (!existe) throw new ErroNaoEncontrado();
        const campos = camposDescricao(dados);
        await db.descricaoAnestesica.upsert({
          where: { procedimentoId },
          create: { procedimentoId, ...campos },
          update: campos,
        });
      } catch (e) {
        throw traduzirErroPrisma(e);
      }
    },
  };
}
