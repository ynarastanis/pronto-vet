import { SearchX } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NaoEncontrada() {
  return (
    <main className="entrar-fade flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border bg-card px-5 py-6">
        <span
          aria-hidden
          className="mb-3 flex size-14 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-8"
        >
          <SearchX />
        </span>
        <h1 className="text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-1 text-muted-foreground">
          O endereço não existe ou o item foi excluído. Volte para a tela Gerar.
        </p>
        <Link href="/" className={`${buttonVariants()} mt-4`}>
          Ir para Gerar
        </Link>
      </div>
    </main>
  );
}
