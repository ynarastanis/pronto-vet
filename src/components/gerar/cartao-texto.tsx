"use client";

import { useEffect, useRef, useState } from "react";
import { BotaoCopiar } from "@/components/botao-copiar";
import { Ficha } from "@/components/ficha";
import { linhasAlteradas } from "@/lib/linhas-alteradas";

const SAIDA_MS = 120;

type Exibido = {
  procedimentoId: string | null;
  texto: string | null;
  realce: number[];
  versao: number;
};

/**
 * Ficha com a prévia de um texto gerado.
 * - Trocar de procedimento: crossfade (saída 120ms, entrada 200ms).
 * - Mesmo procedimento com texto novo (peso, profissional): só as linhas
 *   alteradas recebem `.realce-linha`.
 */
export function CartaoTexto({
  titulo,
  texto,
  procedimentoId,
}: {
  titulo: string;
  texto: string | null;
  procedimentoId: string | null;
}) {
  const alvoRef = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = useState(false);
  const [exibido, setExibido] = useState<Exibido>({
    procedimentoId,
    texto,
    realce: [],
    versao: 0,
  });

  const saindo =
    exibido.texto !== null && exibido.procedimentoId !== procedimentoId;

  // Ajuste de estado durante a renderização (padrão recomendado pelo React).
  if (!saindo) {
    if (exibido.procedimentoId !== procedimentoId || exibido.texto !== texto) {
      const mesmoProcedimento = exibido.procedimentoId === procedimentoId;
      setExibido({
        procedimentoId,
        texto,
        realce:
          mesmoProcedimento && texto !== null
            ? linhasAlteradas(exibido.texto, texto)
            : [],
        versao: exibido.versao + 1,
      });
    }
  }

  useEffect(() => {
    if (!saindo) return;
    const t = setTimeout(
      () =>
        setExibido((atual) => ({
          procedimentoId,
          texto,
          realce: [],
          versao: atual.versao + 1,
        })),
      SAIDA_MS,
    );
    return () => clearTimeout(t);
  }, [saindo, procedimentoId, texto]);

  const realcadas = new Set(exibido.realce);
  const linhas = exibido.texto?.split("\n") ?? [];

  return (
    <Ficha
      titulo={titulo}
      copiado={copiado}
      acao={
        <BotaoCopiar
          texto={texto ?? ""}
          alvoRef={alvoRef}
          aoMudarCopiado={setCopiado}
        />
      }
    >
      {exibido.texto === null ? (
        <p className="text-muted-foreground">
          Selecione um procedimento para ver as descrições.
        </p>
      ) : (
        <div
          key={exibido.procedimentoId ?? "nenhum"}
          className={saindo ? "trocar-texto-saida" : "trocar-texto"}
        >
          <div ref={alvoRef} className="texto-documento">
            {linhas.map((linha, i) => (
              <span
                key={realcadas.has(i) ? `r${exibido.versao}-${i}` : i}
                className={realcadas.has(i) ? "realce-linha" : undefined}
              >
                {linha}
                {i < linhas.length - 1 ? "\n" : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </Ficha>
  );
}
