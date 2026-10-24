"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { atualizarProcedimento, criarProcedimento } from "@/actions/procedimentos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResultadoAcao } from "@/lib/validacao/validar";
import { Campo } from "./campo";

type Valores = { nome: string; descricaoTecnica: string; prescricao: string };

export function FormularioProcedimento({
  id,
  inicial,
}: {
  id?: string;
  inicial?: Valores;
}) {
  const acaoServidor = id
    ? atualizarProcedimento.bind(null, id)
    : criarProcedimento;
  const [estado, acao, pendente] = useActionState<ResultadoAcao, FormData>(
    acaoServidor,
    null,
  );
  // Controlados: o React zera formulários não controlados após a action,
  // o que apagaria o que a pessoa digitou em caso de erro.
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [tecnica, setTecnica] = useState(inicial?.descricaoTecnica ?? "");
  const [prescricao, setPrescricao] = useState(inicial?.prescricao ?? "");

  useEffect(() => {
    if (estado?.ok) toast.success("Procedimento salvo.");
  }, [estado]);

  const erros = estado && !estado.ok ? estado.erros : {};

  return (
    <form action={acao} className="flex flex-col gap-5">
      <Campo id="nome" rotulo="Nome do procedimento" erro={erros.nome}>
        <Input
          id="nome"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={150}
          autoComplete="off"
          aria-invalid={erros.nome ? true : undefined}
          aria-describedby={erros.nome ? "erro-nome" : undefined}
        />
      </Campo>
      <Campo
        id="descricaoTecnica"
        rotulo="Descrição da técnica"
        erro={erros.descricaoTecnica}
      >
        <Textarea
          id="descricaoTecnica"
          name="descricaoTecnica"
          value={tecnica}
          onChange={(e) => setTecnica(e.target.value)}
          className="texto-documento min-h-56 max-w-none"
          aria-invalid={erros.descricaoTecnica ? true : undefined}
          aria-describedby={erros.descricaoTecnica ? "erro-descricaoTecnica" : undefined}
        />
      </Campo>
      <Campo id="prescricao" rotulo="Prescrição" erro={erros.prescricao}>
        <Textarea
          id="prescricao"
          name="prescricao"
          value={prescricao}
          onChange={(e) => setPrescricao(e.target.value)}
          placeholder="Prescrito: …"
          className="texto-documento min-h-56 max-w-none"
          aria-invalid={erros.prescricao ? true : undefined}
          aria-describedby={erros.prescricao ? "erro-prescricao" : undefined}
        />
      </Campo>
      <div>
        <Button type="submit" disabled={pendente}>
          {pendente ? "Salvando…" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
