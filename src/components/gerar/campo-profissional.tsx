"use client";

import { X } from "lucide-react";
import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { filtrarPorTexto } from "@/lib/recentes";
import { cn } from "@/lib/utils";
import type { Profissional } from "@/servicos/tipos";

/**
 * Campo de texto com sugestões (typeahead) para escolher um profissional,
 * mais pills dos últimos escolhidos. O foco fica sempre no campo; a lista usa
 * `aria-activedescendant`.
 */
export function CampoProfissional({
  id,
  rotulo,
  icone,
  profissionais,
  recentes,
  valor,
  aoEscolher,
}: {
  id: string;
  rotulo: string;
  icone: React.ReactNode;
  profissionais: Profissional[];
  /** Ids dos últimos escolhidos, o mais recente primeiro (já resolvidos). */
  recentes: string[];
  valor: string | null;
  aoEscolher: (id: string | null) => void;
}) {
  const idLista = useId();
  const [texto, setTexto] = useState("");
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);

  const escolhido = profissionais.find((p) => p.id === valor) ?? null;
  const sugestoes = filtrarPorTexto(profissionais, escolhido ? "" : texto);
  const indiceAtivo = Math.min(ativo, Math.max(sugestoes.length - 1, 0));
  const idOpcao = (i: number) => `${idLista}-${i}`;
  const mostrarLista = aberto && !escolhido;

  function escolher(p: Profissional) {
    aoEscolher(p.id);
    setTexto("");
    setAberto(false);
  }

  function limpar() {
    aoEscolher(null);
    setTexto("");
  }

  function aoTeclar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAberto(true);
      setAtivo(Math.min(indiceAtivo + 1, sugestoes.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo(Math.max(indiceAtivo - 1, 0));
    } else if (e.key === "Enter") {
      if (mostrarLista && sugestoes[indiceAtivo]) {
        e.preventDefault();
        escolher(sugestoes[indiceAtivo]);
      }
    } else if (e.key === "Escape") {
      setAberto(false);
    }
  }

  const pills = recentes
    .map((r) => profissionais.find((p) => p.id === r))
    .filter((p): p is Profissional => p !== undefined);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>
        {icone}
        {rotulo}
      </Label>
      <div className="relative min-w-0">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={mostrarLista}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={
            mostrarLista && sugestoes.length > 0 ? idOpcao(indiceAtivo) : undefined
          }
          autoComplete="off"
          placeholder="Digite para buscar"
          value={escolhido ? escolhido.nome : texto}
          onChange={(e) => {
            if (escolhido) aoEscolher(null);
            setTexto(e.target.value);
            setAberto(true);
            setAtivo(0);
          }}
          onFocus={() => setAberto(true)}
          onBlur={() => setAberto(false)}
          onKeyDown={aoTeclar}
          className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent py-2 pr-9 pl-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:h-9 dark:bg-input/30"
        />
        {(escolhido || texto) && (
          <button
            type="button"
            aria-label={`Limpar ${rotulo.toLowerCase()}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={limpar}
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
        <ul
          id={idLista}
          role="listbox"
          aria-label={`Sugestões de ${rotulo.toLowerCase()}`}
          hidden={!mostrarLista}
          className="absolute top-full right-0 left-0 z-40 mt-1 max-h-56 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {sugestoes.length === 0 ? (
            <li className="px-2 py-2 text-muted-foreground">
              Nenhum profissional encontrado.
            </li>
          ) : (
            sugestoes.map((p, i) => (
              <li
                key={p.id}
                id={idOpcao(i)}
                role="option"
                aria-selected={i === indiceAtivo}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => escolher(p)}
                onMouseMove={() => setAtivo(i)}
                className={cn(
                  "cursor-pointer rounded-md px-2 py-2 break-words",
                  i === indiceAtivo && "bg-accent text-accent-foreground",
                )}
              >
                {p.nome}
              </li>
            ))
          )}
        </ul>
      </div>
      {pills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Últimos ${rotulo.toLowerCase()}`}>
          {pills.map((p) => {
            const marcado = p.id === valor;
            return (
              <li key={p.id} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={marcado}
                  onClick={() => aoEscolher(p.id)}
                  className={cn(
                    "inline-flex h-9 max-w-full items-center rounded-full border px-3 text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    marcado
                      ? "border-primary bg-accent font-medium text-accent-foreground"
                      : "border-input text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="truncate">{p.nome}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
