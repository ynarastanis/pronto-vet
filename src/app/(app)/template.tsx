// Template (remonta a cada navegação): dá o fade de 160ms ao conteúdo e define a largura da página.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <main className="entrar-fade mx-auto w-full max-w-[70rem] flex-1 px-4 py-6 md:px-6 md:py-8">
      {children}
    </main>
  );
}
