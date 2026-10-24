import Link from "next/link";

export default function NaoEncontrada() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p>Página não encontrada.</p>
      <Link href="/" className="underline">
        Voltar ao início
      </Link>
    </main>
  );
}
