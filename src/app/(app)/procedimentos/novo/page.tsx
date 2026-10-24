import Link from "next/link";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { FormularioProcedimento } from "@/components/procedimentos/formulario-procedimento";
import { buttonVariants } from "@/components/ui/button";
import { exigirSessao } from "@/lib/auth/sessao";

export default async function PaginaNovoProcedimento() {
  await exigirSessao();
  return (
    <div className="entrar-fade max-w-3xl">
      <CabecalhoPagina
        titulo="Novo procedimento"
        descricao="Depois de salvar, você poderá adicionar a descrição anestésica."
        acao={
          <Link href="/procedimentos" className={buttonVariants({ variant: "ghost" })}>
            Voltar
          </Link>
        }
      />
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <FormularioProcedimento />
      </section>
    </div>
  );
}
