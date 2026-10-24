/**
 * Ficha: superfície do prontuário com a faixa de campo cirúrgico na borda esquerda.
 * `copiado` dispara a varredura da faixa (ver `.varredura-copiado` em globals.css).
 */
export function Ficha({
  titulo,
  acao,
  copiado = false,
  children,
}: {
  titulo: string;
  acao?: React.ReactNode;
  copiado?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      data-copiado={copiado ? "true" : "false"}
      className="ficha relative min-w-0 overflow-hidden rounded-2xl border bg-card pl-1.5"
    >
      <span
        aria-hidden
        className="varredura-copiado absolute inset-y-0 left-0 w-1.5 bg-primary"
      />
      <header className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-5">
        <h2 className="text-base font-semibold">{titulo}</h2>
        {acao}
      </header>
      <div className="px-4 pt-3 pb-5 sm:px-5">{children}</div>
    </section>
  );
}
