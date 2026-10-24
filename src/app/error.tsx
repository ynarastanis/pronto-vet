"use client";

import { Button } from "@/components/ui/button";

export default function Erro({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p>Algo deu errado. Tente novamente.</p>
      <Button type="button" variant="outline" onClick={() => retry()}>
        Tentar novamente
      </Button>
    </main>
  );
}
