"use client";

import { Button } from "@/components/ui/button";
import "./globals.css";

export default function ErroGlobal({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <p>Algo deu errado. Tente novamente.</p>
          <Button type="button" variant="outline" onClick={() => retry()}>
            Tentar novamente
          </Button>
        </main>
      </body>
    </html>
  );
}
