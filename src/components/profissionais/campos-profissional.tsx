"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Papel } from "@/servicos/tipos";

const PAPEIS = [
  { value: "CIRURGIAO", label: "Cirurgião" },
  { value: "ANESTESISTA", label: "Anestesista" },
];

export function MensagemErro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <div className="erro-campo">
      <p id={id} role="alert" className="text-[13px] text-destructive">
        {texto}
      </p>
    </div>
  );
}

export function CamposProfissional({
  prefixo,
  nome,
  aoMudarNome,
  papel,
  aoMudarPapel,
  erros,
}: {
  prefixo: string;
  nome: string;
  aoMudarNome: (valor: string) => void;
  papel: Papel;
  aoMudarPapel: (valor: Papel) => void;
  erros: Record<string, string>;
}) {
  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Label htmlFor={`${prefixo}-nome`}>Nome</Label>
        <Input
          id={`${prefixo}-nome`}
          name="nome"
          value={nome}
          onChange={(e) => aoMudarNome(e.target.value)}
          autoComplete="off"
          aria-invalid={erros.nome ? true : undefined}
          aria-describedby={erros.nome ? `${prefixo}-erro-nome` : undefined}
        />
        <MensagemErro id={`${prefixo}-erro-nome`} texto={erros.nome} />
      </div>
      <div className="flex flex-col gap-2 sm:w-48">
        <Label htmlFor={`${prefixo}-papel`}>Papel</Label>
        <Select
          name="papel"
          items={PAPEIS}
          value={papel}
          onValueChange={(v) => aoMudarPapel(v as Papel)}
        >
          <SelectTrigger id={`${prefixo}-papel`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAPEIS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <MensagemErro id={`${prefixo}-erro-papel`} texto={erros.papel} />
      </div>
    </>
  );
}
