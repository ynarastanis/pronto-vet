"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DURACAO_COPIADO_MS = 2000;

/** Seleciona o conteúdo do alvo para o usuário copiar com Ctrl+C. */
function selecionarConteudo(alvo: HTMLElement | null) {
  if (!alvo) return;
  const selecao = window.getSelection();
  if (!selecao) return;
  const intervalo = document.createRange();
  intervalo.selectNodeContents(alvo);
  selecao.removeAllRanges();
  selecao.addRange(intervalo);
}

export function BotaoCopiar({
  texto,
  alvoRef,
  aoMudarCopiado,
}: {
  texto: string;
  alvoRef: React.RefObject<HTMLElement | null>;
  /** Avisa a ficha para varrer a faixa `--copiado`. */
  aoMudarCopiado?: (copiado: boolean) => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  function marcarCopiado() {
    setCopiado(true);
    aoMudarCopiado?.(true);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setCopiado(false);
      aoMudarCopiado?.(false);
    }, DURACAO_COPIADO_MS);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      marcarCopiado();
    } catch {
      selecionarConteudo(alvoRef.current);
      toast("Use Ctrl+C para copiar.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={copiar}
      disabled={!texto}
      className="min-w-28 text-foreground"
    >
      {copiado ? (
        <span key="copiado" className="check-copiado inline-flex items-center gap-1.5">
          <CheckIcon aria-hidden className="text-copiado" />
          Copiado
        </span>
      ) : (
        <span key="copiar" className="inline-flex items-center gap-1.5">
          <CopyIcon aria-hidden />
          Copiar
        </span>
      )}
      <span role="status" className="sr-only">
        {copiado ? "Texto copiado." : ""}
      </span>
    </Button>
  );
}
