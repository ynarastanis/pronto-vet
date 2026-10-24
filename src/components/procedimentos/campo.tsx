import { Label } from "@/components/ui/label";

/** Rótulo acima do campo, ajuda e erro abaixo (erro entra com fade + altura). */
export function Campo({
  id,
  rotulo,
  erro,
  ajuda,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  ajuda?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </Label>
      {children}
      {ajuda && <p className="text-[13px] text-muted-foreground">{ajuda}</p>}
      {erro && (
        <div className="erro-campo">
          <p id={`erro-${id}`} role="alert" className="text-[13px] text-destructive">
            {erro}
          </p>
        </div>
      )}
    </div>
  );
}
