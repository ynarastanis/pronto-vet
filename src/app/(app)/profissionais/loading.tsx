import { Carregando, Esqueleto, EsqueletoCabecalho, EsqueletoCampo } from "@/components/esqueleto";

function EsqueletoColuna({ nomes }: { nomes: string[] }) {
  return (
    <section>
      <div className="mb-3 flex h-6 items-center">
        <Esqueleto className="h-4 w-28" />
      </div>
      <div className="divide-y overflow-hidden rounded-xl border bg-card">
        {nomes.map((largura, i) => (
          <div key={i} className="flex h-14 items-center px-3 md:h-[3.25rem]">
            <Esqueleto className={`h-4 max-w-full ${largura}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Mesma estrutura de Profissionais: formulário de cadastro e duas colunas de lista.
export default function CarregandoProfissionais() {
  return (
    <Carregando>
      <EsqueletoCabecalho />
      <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-start">
        <EsqueletoCampo className="sm:flex-1" />
        <EsqueletoCampo className="sm:w-48" />
        <Esqueleto className="h-10 w-28 shrink-0 md:h-9 sm:mt-[1.625rem]" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <EsqueletoColuna nomes={["w-40", "w-52", "w-36", "w-48"]} />
        <EsqueletoColuna nomes={["w-44", "w-32", "w-56", "w-40"]} />
      </div>
    </Carregando>
  );
}
