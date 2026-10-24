"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ClipboardPlus, LogOut, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { sair } from "@/actions/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", rotulo: "Gerar", Icone: ClipboardList },
  { href: "/procedimentos", rotulo: "Procedimentos", Icone: ClipboardPlus },
  { href: "/profissionais", rotulo: "Profissionais", Icone: Users },
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
    raiz.querySelectorAll("a").forEach((a) => observador.observe(a));
    // A Onest troca a fonte reserva depois do primeiro desenho; recalcula quando carregar.
    let cancelado = false;
    document.fonts?.ready.then(() => {
      if (!cancelado) posicionar();
    });
    return () => {
      cancelado = true;
      observador.disconnect();
    };
  }, [caminho]);

  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-card">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-full max-w-[70rem] items-center gap-2 px-4 sm:gap-3 md:gap-6 md:px-6"
      >
        <Link
          href="/"
          className="hidden shrink-0 items-center gap-2 rounded-md font-semibold sm:flex outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <span aria-hidden className="size-4 rounded-[0.1875rem] bg-primary" />
          <span className="text-base">Pronto Vet</span>
        </Link>

        <div
          ref={lista}
          className="relative -my-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span ref={pilula} aria-hidden className="pilula-ativa !top-1 !h-[calc(100%-0.5rem)]" />
          {LINKS.map(({ href, rotulo, Icone }) => {
            const ativo = estaAtivo(href, caminho);
            return (
              <Link
                key={href}
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-[0.8125rem] transition-colors duration-[180ms] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:px-2.5 sm:text-sm md:px-3",
                  ativo
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icone aria-hidden className="size-4 shrink-0" />
                {/* Abaixo de sm só o link ativo mostra o rótulo; os demais ficam só com ícone. */}
                <span className={cn(!ativo && "sr-only sm:not-sr-only")}>{rotulo}</span>
              </Link>
            );
          })}
        </div>

        <form action={sair} className="shrink-0">
          <button
            type="submit"
            aria-label="Sair"
            className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground sm:px-2.5 transition-colors duration-[180ms] outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <LogOut aria-hidden className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </form>
      </nav>
    </header>
  );
}
