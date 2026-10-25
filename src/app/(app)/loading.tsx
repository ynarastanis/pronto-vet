import {
  Carregando,
  Esqueleto,
  EsqueletoCabecalho,
  EsqueletoCampo,
  EsqueletoLinhas,
} from "@/components/esqueleto";

function EsqueletoFicha() {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border bg-card pl-1.5">
      <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-5">
        <Esqueleto className="h-5 w-44 max-w-full" />
        <Esqueleto className="size-10 shrink-0 md:size-9" />
      </div>
      <div className="px-4 pt-3 pb-5 sm:px-5">
        <EsqueletoLinhas
          larguras={["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-2/3", "w-3/4"]}
        />
      </div>
    </div>
  );
}

// Mesma grade da tela Gerar (formulário de escolhas + duas fichas) para não pular ao carregar.
export default function CarregandoGerar() {
  return (
    <Carregando>
      <EsqueletoCabecalho descricao />
      <div className="flex min-w-0 flex-col gap-6">
        <div className="grid grid-cols-1 items-start gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)]">
          <EsqueletoCampo />
          <EsqueletoCampo />
          <EsqueletoCampo />
          <EsqueletoCampo />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          <EsqueletoFicha />
          <EsqueletoFicha />
        </div>
      </div>
    </Carregando>
  );
}
