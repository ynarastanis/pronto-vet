"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function ComboboxProcedimento({
  id,
  opcoes,
  valor,
  aoEscolher,
}: {
  id: string;
  opcoes: { id: string; nome: string }[];
  valor: string | null;
  aoEscolher: (id: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const escolhido = opcoes.find((o) => o.id === valor);

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger
        id={id}
        role="combobox"
        aria-expanded={aberto}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-left text-sm transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-9 dark:bg-input/30 dark:hover:bg-input/50",
          !escolhido && "text-muted-foreground",
        )}
      >
        <span className="line-clamp-1">
          {escolhido ? escolhido.nome : "Escolher procedimento"}
        </span>
        <ChevronDownIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--anchor-width) min-w-64 gap-0 p-0"
      >
        <Command
          filter={(nome, busca) =>
            semAcento(nome).includes(semAcento(busca)) ? 1 : 0
          }
        >
          <CommandInput placeholder="Buscar procedimento" />
          <CommandList>
            <CommandEmpty>Nenhum procedimento encontrado.</CommandEmpty>
            {opcoes.map((o) => (
              <CommandItem
                key={o.id}
                value={o.nome}
                data-checked={o.id === valor}
                onSelect={() => {
                  aoEscolher(o.id);
                  setAberto(false);
                }}
              >
                <span className="min-w-0 flex-1">{o.nome}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
