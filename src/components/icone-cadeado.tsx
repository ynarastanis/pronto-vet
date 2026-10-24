"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cadeado com corpo e haste separados. Aberto: a haste sobe 1px e gira -25° em torno
 * do pino esquerdo, e o corpo dá um "clique" de escala (ver `.cadeado-*` em globals.css).
 * Decorativo: quem usa o ícone fornece o rótulo acessível.
 */
export function IconeCadeado({
  aberto,
  className,
}: {
  aberto: boolean;
  className?: string;
}) {
  // O clique só toca depois da primeira mudança (não na carga da página).
  const [anterior, setAnterior] = useState(aberto);
  const [mudou, setMudou] = useState(false);
  if (anterior !== aberto) {
    setAnterior(aberto);
    setMudou(true);
  }

  return (
    <svg
      aria-hidden
      overflow="visible"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-aberto={aberto ? "true" : "false"}
      data-mudou={mudou ? "true" : "false"}
      className={cn("cadeado size-4 shrink-0", className)}
    >
      <path className="cadeado-haste" d="M7 13V9a5 5 0 0 1 10 0v4" />
      <rect
        className="cadeado-corpo"
        x="4"
        y="13"
        width="16"
        height="9"
        rx="2"
      />
    </svg>
  );
}
