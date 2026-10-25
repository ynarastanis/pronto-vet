import { Carregando, Esqueleto, EsqueletoCabecalho, EsqueletoCampo } from "@/components/esqueleto";

// Mesma estrutura da edição: dados do procedimento, descrição anestésica e botão de excluir.
export default function CarregandoProcedimento() {
  return (
    <Carregando className="flex max-w-3xl flex-col gap-6">
      <EsqueletoCabecalho acao="w-20" />
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-5">
          <EsqueletoCampo />
          <EsqueletoCampo controle="h-56" />
          <EsqueletoCampo controle="h-56" />
          <Esqueleto className="h-10 w-28 md:h-9" />
        </div>
      </section>
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="mb-4 flex h-6 items-center">
          <Esqueleto className="h-4 w-44" />
        </div>
        <div className="flex flex-col gap-5">
          <EsqueletoCampo className="w-40" />
          <EsqueletoCampo controle="h-20" />
          <EsqueletoCampo controle="h-20" />
          <EsqueletoCampo controle="h-20" />
          <Esqueleto className="h-10 w-28 md:h-9" />
        </div>
      </section>
      <div>
        <Esqueleto className="h-10 w-44 md:h-9" />
      </div>
    </Carregando>
  );
}
