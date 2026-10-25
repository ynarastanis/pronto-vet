import { FormularioEntrar } from "@/components/entrar/formulario-entrar";
import { FundoCelulas } from "@/components/entrar/fundo-celulas";
import { Ficha } from "@/components/ficha";

export default function PaginaEntrar() {
  return (
    <>
      <FundoCelulas />
      <main className="entrar-fade relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div data-respiro-fundo className="w-full max-w-sm">
          <Ficha titulo="Pronto Vet">
            <p className="mb-5 text-muted-foreground">Digite a senha da equipe para entrar.</p>
            <FormularioEntrar />
          </Ficha>
        </div>
      </main>
    </>
  );
}
