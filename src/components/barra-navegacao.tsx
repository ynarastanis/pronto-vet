"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", rotulo: "Gerar" },
  { href: "/procedimentos", rotulo: "Procedimentos" },
  { href: "/profissionais", rotulo: "Profissionais" },
];

export function BarraNavegacao() {
  const caminho = usePathname();

  return (
    <header className="border-b bg-background">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-3 py-2"
      >
        <span className="mr-2 font-semibold">Pronto Vet</span>
        {LINKS.map(({ href, rotulo }) => {
          const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ativo ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                ativo ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {rotulo}
            </Link>
          );
        })}
        <form action={sair} className="ml-auto">
          <Button type="submit" variant="outline" size="sm">
            Sair
          </Button>
        </form>
      </nav>
    </header>
  );
}
