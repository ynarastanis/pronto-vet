import { cn } from "@/lib/utils";

/** Bloco cinza com brilho suave; só decorativo (o aviso para leitores de tela fica no `Carregando`). */
export function Esqueleto({ className }: { className?: string }) {
  return <div aria-hidden className={cn("esqueleto rounded-lg", className)} />;
}

/** Raiz de um `loading.tsx`: marca a região como ocupada e avisa leitores de tela. */
export function Carregando({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div aria-busy="true" className={className}>
      <span role="status" className="sr-only">
        Carregando…
      </span>
      {children}
    </div>
  );
}

/** Cabeçalho de página (mesma altura de `CabecalhoPagina`): título, descrição opcional e ação. */
export function EsqueletoCabecalho({
  descricao = false,
  acao,
}: {
  descricao?: boolean;
  acao?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div className="min-w-0 flex-1">
        {/* Título: text-[1.625rem] com leading-tight (1,25) */}
        <div className="flex h-[2.03rem] items-center">
          <Esqueleto className="h-6 w-40 max-w-full" />
        </div>
        {descricao && (
          <div className="mt-1 flex h-6 items-center">
            <Esqueleto className="h-4 w-[32rem] max-w-full" />
          </div>
        )}
      </div>
      {acao && <Esqueleto className={cn("h-10 md:h-9", acao)} />}
    </div>
  );
}

/** Rótulo + controle de formulário (rótulo text-sm = 1,25rem; gap-2). */
export function EsqueletoCampo({
  controle = "h-10 md:h-9",
  className,
}: {
  controle?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div className="flex h-5 items-center">
        <Esqueleto className="h-3.5 w-28" />
      </div>
      <Esqueleto className={controle} />
    </div>
  );
}

/** Linhas de texto de largura variada (corpo de ficha ou de descrição). */
export function EsqueletoLinhas({ larguras }: { larguras: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {larguras.map((l, i) => (
        <Esqueleto key={i} className={cn("h-4", l)} />
      ))}
    </div>
  );
}
