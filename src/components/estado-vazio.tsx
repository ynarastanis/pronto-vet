export function EstadoVazio({
  icone,
  titulo,
  descricao,
  acao,
}: {
  /** Ícone lucide de 2rem (32px na base), mostrado dentro de um círculo --campo-suave. */
  icone?: React.ReactNode;
  titulo: string;
  descricao: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-card px-5 py-8">
      {icone && (
        <span
          aria-hidden
          className="mb-3 flex size-14 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-8"
        >
          {icone}
        </span>
      )}
      <h2 className="text-base font-semibold">{titulo}</h2>
      <p className="mt-1 max-w-[60ch] text-muted-foreground">{descricao}</p>
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
