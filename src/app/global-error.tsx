"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function ErroGlobal({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-xl border bg-card px-5 py-6">
          <span
            aria-hidden
            className="mb-3 flex size-14 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-8"
          >
            <TriangleAlert />
          </span>
            <h1 className="text-xl font-semibold">Não foi possível carregar o Pronto Vet</h1>
            <p className="mt-1 text-muted-foreground">
              Ocorreu uma falha inesperada. Tente novamente; se continuar, recarregue o navegador.
            </p>
            <Button type="button" className="mt-4" onClick={() => retry()}>
              Tentar novamente
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
