"use client";

import { Pencil, Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { atualizarProfissional, excluirProfissional } from "@/actions/profissionais";
import { ConfirmarExclusao } from "@/components/confirmar-exclusao";
import { Button } from "@/components/ui/button";
import type { Papel, Profissional } from "@/servicos/tipos";
import { CamposProfissional, RotuloFantasma } from "./campos-profissional";

export function ItemProfissional({
  profissional,
  novo,
}: {
  profissional: Profissional;
  novo: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [nome, setNome] = useState(profissional.nome);
  const [papel, setPapel] = useState<Papel>(profissional.papel);
  const [estado, acao, pendente] = useActionState(
    atualizarProfissional.bind(null, profissional.id),
    null,
  );
  const [visto, setVisto] = useState(estado);
  if (estado !== visto) {
    setVisto(estado);
    if (estado?.ok) setEditando(false);
  }
  useEffect(() => {
    if (estado?.ok) toast.success("Profissional salvo.");
  }, [estado]);
  const erros = estado && !estado.ok ? estado.erros : {};

  function cancelar() {
    setNome(profissional.nome);
    setPapel(profissional.papel);
    setEditando(false);
  }

  async function excluir() {
    setSaindo(true);
    await new Promise((resolver) => setTimeout(resolver, 180));
    await excluirProfissional(profissional.id);
  }

  return (
    <li className={saindo ? "item-lista-saida" : novo ? "item-lista" : undefined}>
      <div className="px-3 py-2 hover:bg-accent/60">
        {editando ? (
          <form action={acao} className="flex flex-col gap-3 py-1 sm:flex-row sm:items-start">
            <CamposProfissional
              prefixo={`ed-${profissional.id}`}
              nome={nome}
              aoMudarNome={setNome}
              papel={papel}
              aoMudarPapel={setPapel}
              erros={erros}
            />
            <div className="flex flex-col gap-2">
              <RotuloFantasma />
              <div className="flex gap-2">
                <Button type="submit" disabled={pendente}>
                  <Save aria-hidden />
                  {pendente ? "Salvando…" : "Salvar"}
                </Button>
                <Button type="button" variant="ghost" onClick={cancelar}>
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate">{profissional.nome}</span>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditando(true)}>
                <Pencil aria-hidden />
                Editar
              </Button>
              <ConfirmarExclusao
                titulo="Excluir profissional?"
                descricao="Esta ação não pode ser desfeita."
                acao={excluir}
              />
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
