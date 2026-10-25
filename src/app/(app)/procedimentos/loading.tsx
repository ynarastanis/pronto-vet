import { Carregando, Esqueleto, EsqueletoCabecalho } from "@/components/esqueleto";

const NOMES = ["w-56", "w-72", "w-48", "w-64", "w-80", "w-52"];

// Mesma estrutura da lista de procedimentos: cabeçalho com ação, busca e linhas de min-h-12.
export default function CarregandoProcedimentos() {
  return (
    <Carregando>
      <EsqueletoCabecalho acao="w-44" />
      <div className="mb-4 flex max-w-md gap-2">
        <Esqueleto className="h-10 min-w-0 flex-1 md:h-9" />
        <Esqueleto className="h-10 w-24 shrink-0 md:h-9" />
      </div>
      <div className="divide-y overflow-hidden rounded-xl border bg-card">
        {NOMES.map((largura, i) => (
          <div key={i} className="flex min-h-12 items-center px-4 py-3">
            <Esqueleto className={`h-4 max-w-full ${largura}`} />
          </div>
        ))}
      </div>
    </Carregando>
  );
}
