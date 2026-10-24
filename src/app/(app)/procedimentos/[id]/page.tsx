import Link from "next/link";
import { notFound } from "next/navigation";
import { excluirProcedimento } from "@/actions/procedimentos";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ConfirmarExclusao } from "@/components/confirmar-exclusao";
import { FormularioDescricaoAnestesica } from "@/components/procedimentos/formulario-descricao-anestesica";
import { FormularioProcedimento } from "@/components/procedimentos/formulario-procedimento";
import { buttonVariants } from "@/components/ui/button";
import { exigirSessao } from "@/lib/auth/sessao";
import { servicos } from "@/servicos";

export default async function PaginaProcedimento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirSessao();
  const { id } = await params;
  const procedimento = await servicos().procedimentos.obter(id);
  if (!procedimento) notFound();

  return (
    <div className="entrar-fade flex max-w-3xl flex-col gap-6">
      <CabecalhoPagina
        titulo={procedimento.nome}
        acao={
          <Link href="/procedimentos" className={buttonVariants({ variant: "ghost" })}>
            Voltar
          </Link>
        }
      />
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <FormularioProcedimento
          id={procedimento.id}
          inicial={{
            nome: procedimento.nome,
            descricaoTecnica: procedimento.descricaoTecnica,
            prescricao: procedimento.prescricao,
          }}
        />
      </section>
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="mb-4 text-base font-semibold">Descrição anestésica</h2>
        <FormularioDescricaoAnestesica
          procedimentoId={procedimento.id}
          inicial={procedimento.descricaoAnestesica}
        />
      </section>
      <div>
        <ConfirmarExclusao
          titulo="Excluir procedimento?"
          descricao="A descrição anestésica deste procedimento também será removida. Esta ação não pode ser desfeita."
          acao={excluirProcedimento.bind(null, procedimento.id)}
          rotuloBotao="Excluir procedimento"
        />
      </div>
    </div>
  );
}
