export function EstadoVazio({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-card px-5 py-8">
      <h2 className="text-base font-semibold">{titulo}</h2>
      <p className="mt-1 max-w-[60ch] text-muted-foreground">{descricao}</p>
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
