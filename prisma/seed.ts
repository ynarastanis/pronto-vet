import "./carregar-env";
import { db } from "../src/lib/db";
import { DADOS_DEMONSTRACAO } from "../src/servicos/memoria/dados-demonstracao";

/** Idempotente e sem sobrescrever edições feitas depois: procedimentos por `nome` (upsert), profissionais só se o nome ainda não existir. */
async function semear() {
  for (const p of DADOS_DEMONSTRACAO.procedimentos) {
    const procedimento = await db.procedimentoCirurgico.upsert({
      where: { nome: p.nome },
      create: {
        nome: p.nome,
        descricaoTecnica: p.descricaoTecnica,
        prescricao: p.prescricao,
      },
      update: {},
    });
    if (p.descricaoAnestesica) {
      await db.descricaoAnestesica.upsert({
        where: { procedimentoId: procedimento.id },
        create: { procedimentoId: procedimento.id, ...p.descricaoAnestesica },
        update: {},
      });
    }
  }

  for (const prof of DADOS_DEMONSTRACAO.profissionais) {
    const existe = await db.profissional.findFirst({ where: { nome: prof.nome } });
    if (!existe) await db.profissional.create({ data: { nome: prof.nome, papel: prof.papel } });
  }

  const [procedimentos, profissionais] = await Promise.all([
    db.procedimentoCirurgico.count(),
    db.profissional.count(),
  ]);
  console.log(`Seed concluído: ${procedimentos} procedimento(s), ${profissionais} profissional(is).`);
}

semear()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
