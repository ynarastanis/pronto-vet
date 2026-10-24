"use client";

import { Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { salvarDescricaoAnestesica } from "@/actions/procedimentos";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OPCOES_ASA } from "@/lib/validacao/descricao-anestesica";
import type { ResultadoAcao } from "@/lib/validacao/validar";
import type { DadosDescricaoAnestesica } from "@/lib/texto/tipos";
import { Campo } from "./campo";

type CampoTexto = Exclude<keyof DadosDescricaoAnestesica, "asa">;

const CAMPOS: { nome: CampoTexto; rotulo: string; placeholder?: string }[] = [
  { nome: "mpa", rotulo: "Medicação pré-anestésica" },
  { nome: "inducao", rotulo: "Indução" },
  { nome: "manutencao", rotulo: "Manutenção" },
  { nome: "bloqueioLocal", rotulo: "Bloqueio local" },
  { nome: "analgesiaTrans", rotulo: "Analgesia trans" },
  { nome: "antibioticoPre", rotulo: "Antibiótico pré" },
  { nome: "posImediato", rotulo: "Pós imediato" },
  { nome: "observacoes", rotulo: "Observações", placeholder: "Sem intercorrências…" },
];

export function FormularioDescricaoAnestesica({
  procedimentoId,
  inicial,
}: {
  procedimentoId: string;
  inicial: DadosDescricaoAnestesica | null;
}) {
  const [estado, acao, pendente] = useActionState<ResultadoAcao, FormData>(
    salvarDescricaoAnestesica.bind(null, procedimentoId),
    null,
  );
  const [asa, setAsa] = useState<string | null>(inicial?.asa ?? null);
  const [textos, setTextos] = useState<Record<CampoTexto, string>>(() => {
    const valores = {} as Record<CampoTexto, string>;
    for (const { nome } of CAMPOS) valores[nome] = inicial?.[nome] ?? "";
    return valores;
  });

  useEffect(() => {
    if (estado?.ok) toast.success("Descrição anestésica salva.");
  }, [estado]);

  const erros = estado && !estado.ok ? estado.erros : {};

  return (
    <form action={acao} className="flex flex-col gap-5">
      <Campo id="asa" rotulo="ASA" erro={erros.asa}>
        <Select
          name="asa"
          value={asa}
          onValueChange={(valor) => setAsa(valor as string | null)}
        >
          <SelectTrigger
            id="asa"
            className="w-40"
            aria-invalid={erros.asa ? true : undefined}
            aria-describedby={erros.asa ? "erro-asa" : undefined}
          >
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {OPCOES_ASA.map((opcao) => (
              <SelectItem key={opcao} value={opcao}>
                {opcao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Campo>
      {CAMPOS.map(({ nome, rotulo, placeholder }) => (
        <Campo key={nome} id={nome} rotulo={rotulo} erro={erros[nome]}>
          <Textarea
            id={nome}
            name={nome}
            value={textos[nome]}
            onChange={(e) => setTextos((t) => ({ ...t, [nome]: e.target.value }))}
            placeholder={placeholder}
            className="min-h-20 max-w-none"
            aria-invalid={erros[nome] ? true : undefined}
            aria-describedby={erros[nome] ? `erro-${nome}` : undefined}
          />
        </Campo>
      ))}
      <div>
        <Button type="submit" disabled={pendente}>
          <Save aria-hidden />
          {pendente ? "Salvando…" : "Salvar descrição anestésica"}
        </Button>
      </div>
    </form>
  );
}
