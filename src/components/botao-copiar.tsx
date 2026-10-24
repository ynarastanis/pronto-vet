"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mensagemFalhaCopia } from "@/lib/mensagem-copia";
import { Button } from "@/components/ui/button";

const DURACAO_COPIADO_MS = 2000;

/** Seleciona o conteúdo do alvo para o usuário copiar com Ctrl+C. */
function selecionarConteudo(alvo: HTMLElement | null) {
  if (!alvo) return;
  const area = alvo.querySelector("textarea");
  if (area) {
    area.focus();
    area.select();
    return;
  }
  const selecao = window.getSelection();
  if (!selecao) return;
  const intervalo = document.createRange();
  intervalo.selectNodeContents(alvo);
  selecao.removeAllRanges();
  selecao.addRange(intervalo);
}

/**
 * Plano B para http sem HTTPS (ex.: celular na rede local): textarea temporária
 * + execCommand("copy"). Síncrono; no iOS exige focus, select e setSelectionRange.
 */
function copiarComTextareaTemporaria(texto: string, botao: HTMLElement): boolean {
  const area = document.createElement("textarea");
  area.value = texto;
  area.readOnly = true;
  area.setAttribute("aria-hidden", "true");
  area.style.cssText =
    "position:fixed;top:0;left:-9999px;opacity:0;font-size:16px;";
  document.body.appendChild(area);
  let ok = false;
  try {
    area.focus();
    area.select();
    area.setSelectionRange(0, texto.length);
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    area.remove();
    botao.focus();
  }
  return ok;
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

  // Sem "await" antes do execCommand: o navegador exige o gesto do usuário.
  function copiar(evento: React.MouseEvent<HTMLButtonElement>) {
    const botao = evento.currentTarget;
    const aoFalhar = () => {
      if (copiarComTextareaTemporaria(texto, botao)) {
        marcarCopiado();
        return;
      }
      selecionarConteudo(alvoRef.current);
      toast(mensagemFalhaCopia(window.matchMedia("(pointer: coarse)").matches));
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(marcarCopiado, aoFalhar);
    } else {
      aoFalhar();
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={copiar}
      disabled={!texto}
      className="text-foreground sm:min-w-28"
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
