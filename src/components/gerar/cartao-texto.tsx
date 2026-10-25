"use client";

import { ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BotaoCopiar } from "@/components/botao-copiar";
import { Ficha } from "@/components/ficha";
import { ConfirmarDescarte } from "@/components/gerar/confirmar-descarte";
import { IconeCadeado } from "@/components/icone-cadeado";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  abrir,
  editar,
  estadoInicial,
  fechar,
  precisaConfirmarFechar,
  textoExibido,
} from "@/lib/edicao-livre";
import { linhasAlteradas } from "@/lib/linhas-alteradas";
import { dividirEmLinhas, type Segmento } from "@/lib/texto/segmentos";

const SAIDA_MS = 120;

/** Linhas com os destaques de escolha/ausente (sem realce nem animação). */
function LinhasDestacadas({ segmentos }: { segmentos: Segmento[] }) {
  return dividirEmLinhas(segmentos).map((linha, i) => (
    <span key={i}>
      {linha.map((s, j) =>
        s.destaque ? (
          <span
            key={j}
            className={s.ausente ? "destaque-ausente" : "destaque-escolha"}
          >
            {s.texto}
          </span>
        ) : (
          s.texto
        ),
      )}
    </span>
  ));
}

/** Botão do cadeado de edição livre (cartão e modal). */
function BotaoCadeado({
  aberto,
  desabilitado,
  aoClicar,
}: {
  aberto: boolean;
  desabilitado: boolean;
  aoClicar: () => void;
}) {
  const rotulo = aberto
    ? "Bloquear e voltar ao texto gerado"
    : "Editar texto livremente";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-10 text-foreground md:size-9"
      aria-pressed={aberto}
      aria-label={rotulo}
      title={rotulo}
      disabled={desabilitado}
      onClick={aoClicar}
    >
      <IconeCadeado aberto={aberto} />
    </Button>
  );
}

type Exibido = {
  procedimentoId: string | null;
  texto: string | null;
  segmentos: Segmento[] | null;
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
  segmentos,
  procedimentoId,
  tema,
}: {
  titulo: string;
  icone: React.ReactNode;
  texto: string | null;
  /** Mesmo texto, em trechos; só para o destaque visual. */
  segmentos: Segmento[] | null;
  procedimentoId: string | null;
  /** Paleta de destaque do cartão; sem valor, o verde padrão. */
  tema?: "cirurgico" | "anestesico";
}) {
  const classeTema = tema ? `tema-${tema}` : undefined;
  const alvoRef = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = useState(false);
  const [edicao, setEdicao] = useState(estadoInicial);
  const [confirmando, setConfirmando] = useState(false);
  const [ampliado, setAmpliado] = useState(false);
  const alvoModalRef = useRef<HTMLDivElement>(null);
  const [exibido, setExibido] = useState<Exibido>({
    procedimentoId,
    texto,
    segmentos,
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
        segmentos,
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
          segmentos,
          realce: [],
          versao: atual.versao + 1,
        })),
      SAIDA_MS,
    );
    return () => clearTimeout(t);
  }, [saindo, procedimentoId, texto, segmentos]);

  function alternarCadeado() {
    if (!edicao.aberta) {
      setEdicao(abrir(edicao, texto ?? ""));
    } else if (precisaConfirmarFechar(edicao)) {
      setConfirmando(true);
    } else {
      setEdicao(fechar());
    }
  }

  const confirmacao = (
    <ConfirmarDescarte
      aberto={confirmando}
      aoMudar={setConfirmando}
      aoConfirmar={() => {
        setEdicao(fechar());
        setConfirmando(false);
      }}
    />
  );

  const realcadas = new Set(exibido.realce);
  const linhas = dividirEmLinhas(
    exibido.segmentos ?? [{ texto: exibido.texto ?? "" }],
  );

  return (
    <Ficha
      titulo={titulo}
      icone={icone}
      copiado={copiado}
      emEdicao={edicao.aberta}
      className={classeTema}
      notaEdicao="Edição livre. Feche o cadeado para voltar ao texto gerado."
      acao={
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 text-foreground md:size-9"
            aria-label="Ampliar descrição"
            title="Ampliar descrição"
            disabled={texto === null}
            onClick={() => setAmpliado(true)}
          >
            <ZoomIn aria-hidden="true" />
          </Button>
          <BotaoCadeado
            aberto={edicao.aberta}
            desabilitado={texto === null}
            aoClicar={alternarCadeado}
          />
          <BotaoCopiar
            texto={textoExibido(edicao, texto ?? "")}
            alvoRef={alvoRef}
            aoMudarCopiado={setCopiado}
          />
        </div>
      }
    >
      <Dialog open={ampliado} onOpenChange={setAmpliado}>
        <DialogContent
          className={`h-[min(85dvh,48rem)] w-[calc(100%-2rem)] max-w-3xl grid-rows-[auto_minmax(0,1fr)] sm:max-w-3xl${classeTema ? ` ${classeTema}` : ""}`}
        >
          <DialogHeader className="min-w-0 pr-9">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle>{titulo}</DialogTitle>
              <div className="flex shrink-0 items-center gap-2">
                <BotaoCadeado
                  aberto={edicao.aberta}
                  desabilitado={texto === null}
                  aoClicar={alternarCadeado}
                />
                <BotaoCopiar
                  texto={textoExibido(edicao, texto ?? "")}
                  alvoRef={alvoModalRef}
                  aoMudarCopiado={() => {}}
                />
              </div>
            </div>
          </DialogHeader>
          <div ref={alvoModalRef} className="h-full min-h-0 min-w-0 text-base">
            {edicao.aberta ? (
              <textarea
                aria-label={`${titulo}, texto em edição livre`}
                value={edicao.texto}
                onChange={(e) => setEdicao(editar(edicao, e.target.value))}
                className="texto-documento block h-full w-full min-w-0 resize-none overflow-y-auto rounded-lg border border-edicao-fio bg-campo-edicao p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
              />
            ) : (
              <div className="h-full min-w-0 overflow-y-auto pr-1">
                <div className="texto-documento [overflow-wrap:anywhere]">
                  <LinhasDestacadas
                    segmentos={segmentos ?? [{ texto: texto ?? "" }]}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Dentro do Dialog, para o alerta empilhar acima do modal. */}
          {confirmacao}
        </DialogContent>
      </Dialog>
      {!ampliado && confirmacao}
      {edicao.aberta ? (
        <div key="edicao" className="trocar-modo">
          <div ref={alvoRef}>
            <textarea
              aria-label={`${titulo}, texto em edição livre`}
              value={edicao.texto}
              onChange={(e) => setEdicao(editar(edicao, e.target.value))}
              className="texto-documento block min-h-64 w-full resize-y rounded-lg border border-edicao-fio bg-campo-edicao p-3 outline-none [field-sizing:content] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            />
          </div>
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
                {linha.map((s, j) =>
                  s.destaque ? (
                    <span
                      key={j}
                      className={
                        s.ausente ? "destaque-ausente" : "destaque-escolha"
                      }
                    >
                      {s.texto}
                    </span>
                  ) : (
                    s.texto
                  ),
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </Ficha>
  );
}
