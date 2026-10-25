"use client";

import { ClipboardPlus, Slice, Syringe, UserRound, Weight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CampoProfissional } from "@/components/gerar/campo-profissional";
import { CartaoTexto } from "@/components/gerar/cartao-texto";
import { ComboboxProcedimento } from "@/components/gerar/combobox-procedimento";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CHAVE_ANESTESISTA,
  CHAVE_CIRURGIAO,
  gravarPreferencia,
  lerPreferencia,
} from "@/lib/preferencias";
import {
  CHAVE_ANESTESISTAS_RECENTES,
  CHAVE_CIRURGIOES_RECENTES,
  lerListaRecentes,
  registrarRecente,
  resolverRecentes,
} from "@/lib/recentes";
import { gerarTextoAnestesico } from "@/lib/texto/anestesico";
import { gerarTextoCirurgico } from "@/lib/texto/cirurgico";
import {
  segmentosAnestesico,
  segmentosCirurgico,
} from "@/lib/texto/segmentos";
import type { EntradaGeracao } from "@/lib/texto/tipos";
import type { ProcedimentoCompleto, Profissional } from "@/servicos/tipos";

export function FormularioGerar({
  procedimentos,
  cirurgioes,
  anestesistas,
}: {
  procedimentos: ProcedimentoCompleto[];
  cirurgioes: Profissional[];
  anestesistas: Profissional[];
}) {
  const [procedimentoId, setProcedimentoId] = useState<string | null>(null);
  const [cirurgiaoId, setCirurgiaoId] = useState<string | null>(null);
  const [anestesistaId, setAnestesistaId] = useState<string | null>(null);
  const [peso, setPeso] = useState("");

  const [recentesCirurgioes, setRecentesCirurgioes] = useState<string[]>([]);
  const [recentesAnestesistas, setRecentesAnestesistas] = useState<string[]>([]);

  // Recentes vivem só no navegador: lidos depois da hidratação. O mais recente
  // vem pré-selecionado; sem lista, usa o id único salvo por versões anteriores.
  useEffect(() => {
    function carregar(
      chaveLista: string,
      chaveAntiga: string,
      profissionais: Profissional[],
    ) {
      const ids = profissionais.map((p) => p.id);
      const antigo = lerPreferencia(chaveAntiga);
      const lista = lerListaRecentes(lerPreferencia(chaveLista));
      return resolverRecentes(lista.length > 0 || !antigo ? lista : [antigo], ids);
    }
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage só existe no cliente */
    const cir = carregar(CHAVE_CIRURGIOES_RECENTES, CHAVE_CIRURGIAO, cirurgioes);
    const ane = carregar(CHAVE_ANESTESISTAS_RECENTES, CHAVE_ANESTESISTA, anestesistas);
    setRecentesCirurgioes(cir);
    setRecentesAnestesistas(ane);
    setCirurgiaoId(cir[0] ?? null);
    setAnestesistaId(ane[0] ?? null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cirurgioes, anestesistas]);

  function escolherProfissional(
    id: string | null,
    recentes: string[],
    chaveLista: string,
    definirId: (id: string | null) => void,
    definirRecentes: (ids: string[]) => void,
  ) {
    definirId(id);
    if (id === null) return;
    const novos = registrarRecente(recentes, id);
    definirRecentes(novos);
    gravarPreferencia(chaveLista, JSON.stringify(novos));
  }

  const procedimento = procedimentos.find((p) => p.id === procedimentoId) ?? null;
  const cirurgiao = cirurgioes.find((p) => p.id === cirurgiaoId)?.nome ?? null;
  const anestesista = anestesistas.find((p) => p.id === anestesistaId)?.nome ?? null;

  const textos = useMemo(() => {
    if (!procedimento) return null;
    const entrada: EntradaGeracao = { procedimento, cirurgiao, anestesista, peso };
    return {
      cirurgico: gerarTextoCirurgico(entrada),
      anestesico: gerarTextoAnestesico(entrada),
      segmentosCirurgico: segmentosCirurgico(entrada),
      segmentosAnestesico: segmentosAnestesico(entrada),
    };
  }, [procedimento, cirurgiao, anestesista, peso]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <form
        aria-label="Escolhas"
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 items-start gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)]"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor="procedimento">
            <ClipboardPlus aria-hidden className="size-4 text-muted-foreground" />
            Procedimento
          </Label>
          <ComboboxProcedimento
            id="procedimento"
            opcoes={procedimentos}
            valor={procedimentoId}
            aoEscolher={setProcedimentoId}
          />
        </div>
        <CampoProfissional
          id="cirurgiao"
          rotulo="Cirurgião"
          icone={<UserRound aria-hidden className="size-4 text-muted-foreground" />}
          profissionais={cirurgioes}
          recentes={recentesCirurgioes}
          valor={cirurgiaoId}
          aoEscolher={(id) =>
            escolherProfissional(
              id,
              recentesCirurgioes,
              CHAVE_CIRURGIOES_RECENTES,
              setCirurgiaoId,
              setRecentesCirurgioes,
            )
          }
        />
        <CampoProfissional
          id="anestesista"
          rotulo="Anestesista"
          icone={<Syringe aria-hidden className="size-4 text-muted-foreground" />}
          profissionais={anestesistas}
          recentes={recentesAnestesistas}
          valor={anestesistaId}
          aoEscolher={(id) =>
            escolherProfissional(
              id,
              recentesAnestesistas,
              CHAVE_ANESTESISTAS_RECENTES,
              setAnestesistaId,
              setRecentesAnestesistas,
            )
          }
        />
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor="peso">
            <Weight aria-hidden className="size-4 text-muted-foreground" />
            Peso (kg)
          </Label>
          <Input
            id="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
            placeholder="ex.: 4,5"
          />
        </div>
      </form>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <CartaoTexto
          titulo="Descrição Cirúrgica"
          tema="cirurgico"
          icone={<Slice aria-hidden className="size-[1.125rem]" />}
          texto={textos?.cirurgico ?? null}
          segmentos={textos?.segmentosCirurgico ?? null}
          procedimentoId={procedimentoId}
        />
        <CartaoTexto
          titulo="Descrição Anestésica"
          tema="anestesico"
          icone={<Syringe aria-hidden className="size-[1.125rem]" />}
          texto={textos?.anestesico ?? null}
          segmentos={textos?.segmentosAnestesico ?? null}
          procedimentoId={procedimentoId}
        />
      </div>
    </div>
  );
}
