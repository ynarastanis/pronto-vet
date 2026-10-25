import { PencilLine } from "lucide-react";

/**
 * Ficha: superfície do prontuário com a faixa de campo cirúrgico na borda esquerda.
 * `copiado` dispara a varredura da faixa (ver `.varredura-copiado` em globals.css);
 * `emEdicao` deixa a faixa listrada (edição livre aberta).
 */
export function Ficha({
  titulo,
  icone,
  acao,
  copiado = false,
  emEdicao = false,
  notaEdicao,
  className,
  children,
}: {
  titulo: string;
  /** Ícone decorativo de 1.125rem ao lado do título. */
  icone?: React.ReactNode;
  acao?: React.ReactNode;
  copiado?: boolean;
  emEdicao?: boolean;
  /** Nota sob o título, visível só em edição (fade + altura). */
  notaEdicao?: string;
  /** Classe extra na raiz (ex.: `tema-anestesico`). */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-copiado={copiado ? "true" : "false"}
      data-edicao={emEdicao ? "true" : "false"}
      className={`ficha relative min-w-0 overflow-hidden rounded-2xl border bg-card pl-1.5${className ? ` ${className}` : ""}`}
    >
      <span
        aria-hidden
        className="varredura-copiado absolute inset-y-0 left-0 w-1.5 bg-primary"
      />
      <header className="px-4 pt-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold">
            {icone}
            {titulo}
          </h2>
          {acao}
        </div>
        {notaEdicao && (
          <div
            className="nota-ficha"
            data-visivel={emEdicao ? "true" : "false"}
            aria-hidden={!emEdicao}
          >
            <p className="flex items-start gap-1.5 pt-1.5 text-[0.8125rem] text-edicao">
              <PencilLine aria-hidden className="mt-px size-3.5 shrink-0" />
              <span className="min-w-0">{notaEdicao}</span>
            </p>
          </div>
        )}
      </header>
      <div className="px-4 pt-3 pb-5 sm:px-5">{children}</div>
    </section>
  );
}
