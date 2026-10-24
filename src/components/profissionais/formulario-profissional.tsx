"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { criarProfissional } from "@/actions/profissionais";
import { Button } from "@/components/ui/button";
import type { Papel } from "@/servicos/tipos";
import { CamposProfissional } from "./campos-profissional";

export function FormularioProfissional() {
  const [nome, setNome] = useState("");
  const [papel, setPapel] = useState<Papel>("CIRURGIAO");
  const [estado, acao, pendente] = useActionState(criarProfissional, null);
  // Ajuste de estado durante a renderização: limpa o nome quando um novo resultado de sucesso chega.
  const [visto, setVisto] = useState(estado);
  if (estado !== visto) {
    setVisto(estado);
    if (estado?.ok) setNome("");
  }
  useEffect(() => {
    if (estado?.ok) toast.success("Profissional salvo.");
  }, [estado]);
  const erros = estado && !estado.ok ? estado.erros : {};

  return (
    <form
      action={acao}
      className="mb-8 flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-start"
    >
      <CamposProfissional
        prefixo="novo"
        nome={nome}
        aoMudarNome={setNome}
        papel={papel}
        aoMudarPapel={setPapel}
        erros={erros}
      />
      <Button type="submit" disabled={pendente} className="sm:mt-[1.625rem]">
        <Plus aria-hidden />
        {pendente ? "Adicionando…" : "Adicionar"}
      </Button>
    </form>
  );
}
