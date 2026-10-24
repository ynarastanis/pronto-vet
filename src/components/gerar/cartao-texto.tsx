"use client";

import { useEffect, useRef, useState } from "react";
import { BotaoCopiar } from "@/components/botao-copiar";
import { Ficha } from "@/components/ficha";
import { ConfirmarDescarte } from "@/components/gerar/confirmar-descarte";
import { IconeCadeado } from "@/components/icone-cadeado";
import { Button } from "@/components/ui/button";
import {
  abrir,
  editar,
  estadoInicial,
  fechar,
  precisaConfirmarFechar,
  textoExibido,
} from "@/lib/edicao-livre";
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
 * - Cadeado: abre a edição livre (nunca persistida); fechar descarta.
 */
export function CartaoTexto({
  titulo,
  icone,
  texto,
  procedimentoId,
}: {
  titulo: string;
  icone: React.ReactNode;
  texto: string | null;
  procedimentoId: string | null;
}) {
  const alvoRef = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = useState(false);
  const [edicao, setEdicao] = useState(estadoInicial);
  const [confirmando, setConfirmando] = useState(false);
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

  function alternarCadeado() {
    if (!edicao.aberta) {
      setEdicao(abrir(edicao, texto ?? ""));
    } else if (precisaConfirmarFechar(edicao)) {
      setConfirmando(true);
    } else {
      setEdicao(fechar());
    }
  }

  const realcadas = new Set(exibido.realce);
  const linhas = exibido.texto?.split("\n") ?? [];

  return (
    <Ficha
      titulo={titulo}
      icone={icone}
      copiado={copiado}
      emEdicao={edicao.aberta}
      acao={
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 text-foreground md:size-9"
            aria-pressed={edicao.aberta}
            aria-label={
              edicao.aberta
                ? "Bloquear e voltar ao texto gerado"
                : "Editar texto livremente"
            }
            title={
              edicao.aberta
                ? "Bloquear e voltar ao texto gerado"
                : "Editar texto livremente"
            }
            disabled={texto === null}
            onClick={alternarCadeado}
          >
            <IconeCadeado aberto={edicao.aberta} />
          </Button>
          <BotaoCopiar
            texto={textoExibido(edicao, texto ?? "")}
            alvoRef={alvoRef}
            aoMudarCopiado={setCopiado}
          />
        </div>
      }
    >
      <ConfirmarDescarte
        aberto={confirmando}
        aoMudar={setConfirmando}
        aoConfirmar={() => {
          setEdicao(fechar());
          setConfirmando(false);
        }}
      />
      {edicao.aberta ? (
        <div key="edicao" className="trocar-modo">
          <div ref={alvoRef}>
            <textarea
              aria-label={`${titulo}, texto em edição livre`}
              value={edicao.texto}
              onChange={(e) => setEdicao(editar(edicao, e.target.value))}
              className="texto-documento block min-h-64 w-full resize-y rounded-lg border border-edicao-fio bg-transparent p-3 outline-none [field-sizing:content] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            />
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Edição livre. Feche o cadeado para voltar ao texto gerado.
          </p>
        </div>
      ) : exibido.texto === null ? (
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
