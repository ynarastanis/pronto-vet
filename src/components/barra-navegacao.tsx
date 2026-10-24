"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { sair } from "@/actions/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", rotulo: "Gerar" },
  { href: "/procedimentos", rotulo: "Procedimentos" },
  { href: "/profissionais", rotulo: "Profissionais" },
];

function estaAtivo(href: string, caminho: string) {
  return href === "/" ? caminho === "/" : caminho.startsWith(href);
}

export function BarraNavegacao() {
  const caminho = usePathname();
  const lista = useRef<HTMLDivElement>(null);
  const pilula = useRef<HTMLSpanElement>(null);
  const jaPosicionada = useRef(false);

  // Posiciona a pílula sob o link ativo; ao mudar de página ela desliza (CSS transition).
  useEffect(() => {
    const raiz = lista.current;
    const marca = pilula.current;
    if (!raiz || !marca) return;

    function posicionar() {
      const ativo = raiz?.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!ativo || !marca) {
        if (marca) marca.style.opacity = "0";
        return;
      }
      const primeira = !jaPosicionada.current;
      if (primeira) marca.style.transition = "none";
      marca.style.width = `${ativo.offsetWidth}px`;
      marca.style.transform = `translateX(${ativo.offsetLeft}px)`;
      marca.style.opacity = "1";
      if (primeira) {
        void marca.offsetWidth;
        marca.style.transition = "";
        jaPosicionada.current = true;
      }
    }

    posicionar();
    const observador = new ResizeObserver(posicionar);
    observador.observe(raiz);
    return () => observador.disconnect();
  }, [caminho]);

  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-card">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-full max-w-[1120px] items-center gap-3 px-4 md:gap-6 md:px-6"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <span aria-hidden className="size-4 rounded-[3px] bg-primary" />
          <span className="hidden text-base sm:inline">Pronto Vet</span>
          <span className="sr-only sm:hidden">Pronto Vet</span>
        </Link>

        <div
          ref={lista}
          className="relative -my-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span ref={pilula} aria-hidden className="pilula-ativa !top-1 !h-[calc(100%-0.5rem)]" />
          {LINKS.map(({ href, rotulo }) => {
            const ativo = estaAtivo(href, caminho);
            return (
              <Link
                key={href}
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex h-10 shrink-0 items-center rounded-lg px-2.5 text-sm transition-colors duration-[180ms] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:px-3",
                  ativo
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {rotulo}
              </Link>
            );
          })}
        </div>

        <form action={sair} className="shrink-0">
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg px-2.5 text-sm text-muted-foreground transition-colors duration-[180ms] outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Sair
          </button>
        </form>
      </nav>
    </header>
  );
}
