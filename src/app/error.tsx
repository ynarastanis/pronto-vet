"use client";

import { Button } from "@/components/ui/button";

export default function Erro({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="entrar-fade flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border bg-card px-5 py-6">
        <h1 className="text-xl font-semibold">Não foi possível carregar a página</h1>
        <p className="mt-1 text-muted-foreground">
          Ocorreu uma falha inesperada. Tente novamente; se continuar, recarregue o navegador.
        </p>
        <Button type="button" className="mt-4" onClick={() => retry()}>
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
