"use client";

export default function Erro({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p>Algo deu errado. Tente novamente.</p>
      <button type="button" onClick={() => reset()} className="rounded-md border px-4 py-2">
        Tentar novamente
      </button>
    </main>
  );
}
