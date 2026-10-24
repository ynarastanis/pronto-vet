"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useActionState, useState } from "react";
import { entrar } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormularioEntrar() {
  const [estado, acao, pendente] = useActionState(entrar, null);
  const erro = estado && !estado.ok ? estado.erros.senha : undefined;
  const [visivel, setVisivel] = useState(false);

  return (
    <form action={acao} onSubmit={() => setVisivel(false)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="senha">
          <KeyRound aria-hidden className="size-4 text-muted-foreground" />
          Senha
        </Label>
        <div className="relative">
          <Input
            id="senha"
            name="senha"
            type={visivel ? "text" : "password"}
            autoFocus
            autoComplete="current-password"
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? "erro-senha" : undefined}
            className="pr-12 md:pr-10"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setVisivel((v) => !v)}
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={visivel}
            aria-controls="senha"
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-[180ms] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {visivel ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          </button>
        </div>
        {erro && (
          <p id="erro-senha" role="alert" className="text-[0.8125rem] text-destructive">
            {erro}
          </p>
        )}
      </div>
      <Button type="submit" disabled={pendente}>
        {pendente ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
