"use client";

import { useActionState } from "react";
import { entrar } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormularioEntrar() {
  const [estado, acao, pendente] = useActionState(entrar, null);
  const erro = estado && !estado.ok ? estado.erros.senha : undefined;

  return (
    <form action={acao} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          name="senha"
          type="password"
          autoFocus
          autoComplete="current-password"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? "erro-senha" : undefined}
        />
        {erro && (
          <p id="erro-senha" role="alert" className="text-sm text-destructive">
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
