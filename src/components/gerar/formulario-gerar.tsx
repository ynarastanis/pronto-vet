"use client";

import { useEffect, useMemo, useState } from "react";
import { CartaoTexto } from "@/components/gerar/cartao-texto";
import { ComboboxProcedimento } from "@/components/gerar/combobox-procedimento";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CHAVE_ANESTESISTA,
  CHAVE_CIRURGIAO,
  gravarPreferencia,
  lerPreferencia,
  resolverIdSalvo,
} from "@/lib/preferencias";
import { gerarTextoAnestesico } from "@/lib/texto/anestesico";
import { gerarTextoCirurgico } from "@/lib/texto/cirurgico";
import type { EntradaGeracao } from "@/lib/texto/tipos";
import type { ProcedimentoCompleto, Profissional } from "@/servicos/tipos";

const NENHUM = "nenhum";

function SelectProfissional({
  id,
  rotulo,
  profissionais,
  valor,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  profissionais: Profissional[];
  valor: string | null;
  aoMudar: (id: string | null) => void;
}) {
  const itens = [
    { value: NENHUM, label: "Nenhum" },
    ...profissionais.map((p) => ({ value: p.id, label: p.nome })),
  ];
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{rotulo}</Label>
      <Select
        items={itens}
        value={valor ?? NENHUM}
        onValueChange={(v) => aoMudar(v === NENHUM || v === null ? null : v)}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {itens.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

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

  // Preferências vivem só no navegador: lidas depois da hidratação.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage só existe no cliente */
    setCirurgiaoId(
      resolverIdSalvo(
        lerPreferencia(CHAVE_CIRURGIAO),
        cirurgioes.map((p) => p.id),
      ),
    );
    setAnestesistaId(
      resolverIdSalvo(
        lerPreferencia(CHAVE_ANESTESISTA),
        anestesistas.map((p) => p.id),
      ),
    );
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cirurgioes, anestesistas]);

  const procedimento = procedimentos.find((p) => p.id === procedimentoId) ?? null;
  const cirurgiao = cirurgioes.find((p) => p.id === cirurgiaoId)?.nome ?? null;
  const anestesista = anestesistas.find((p) => p.id === anestesistaId)?.nome ?? null;

  const textos = useMemo(() => {
    if (!procedimento) return null;
    const entrada: EntradaGeracao = { procedimento, cirurgiao, anestesista, peso };
    return {
      cirurgico: gerarTextoCirurgico(entrada),
      anestesico: gerarTextoAnestesico(entrada),
    };
  }, [procedimento, cirurgiao, anestesista, peso]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <form
        aria-label="Escolhas"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2 lg:sticky lg:top-20 lg:grid-cols-1"
      >
        <div className="flex min-w-0 flex-col gap-2 md:col-span-2 lg:col-span-1">
          <Label htmlFor="procedimento">Procedimento</Label>
          <ComboboxProcedimento
            id="procedimento"
            opcoes={procedimentos}
            valor={procedimentoId}
            aoEscolher={setProcedimentoId}
          />
        </div>
        <SelectProfissional
          id="cirurgiao"
          rotulo="Cirurgião"
          profissionais={cirurgioes}
          valor={cirurgiaoId}
          aoMudar={(id) => {
            setCirurgiaoId(id);
            gravarPreferencia(CHAVE_CIRURGIAO, id);
          }}
        />
        <SelectProfissional
          id="anestesista"
          rotulo="Anestesista"
          profissionais={anestesistas}
          valor={anestesistaId}
          aoMudar={(id) => {
            setAnestesistaId(id);
            gravarPreferencia(CHAVE_ANESTESISTA, id);
          }}
        />
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor="peso">Peso (kg)</Label>
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

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <CartaoTexto
          titulo="Descrição Cirúrgica"
          texto={textos?.cirurgico ?? null}
          procedimentoId={procedimentoId}
        />
        <CartaoTexto
          titulo="Descrição Anestésica"
          texto={textos?.anestesico ?? null}
          procedimentoId={procedimentoId}
        />
      </div>
    </div>
  );
}
