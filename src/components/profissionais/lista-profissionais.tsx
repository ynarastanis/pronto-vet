"use client";

import { Users } from "lucide-react";
import { useState } from "react";
import { EstadoVazio } from "@/components/estado-vazio";
import type { Papel, Profissional } from "@/servicos/tipos";
import { ItemProfissional } from "./item-profissional";

function Coluna({
  titulo,
  vazio,
  itens,
  iniciais,
}: {
  titulo: string;
  vazio: { titulo: string; descricao: string };
  itens: Profissional[];
  iniciais: Set<string>;
}) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold">{titulo}</h2>
      {itens.length === 0 ? (
        <EstadoVazio icone={<Users />} titulo={vazio.titulo} descricao={vazio.descricao} />
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {itens.map((p) => (
            <ItemProfissional key={p.id} profissional={p} novo={!iniciais.has(p.id)} />
          ))}
        </ul>
      )}
    </section>
  );
}

export function ListaProfissionais({ profissionais }: { profissionais: Profissional[] }) {
  // Só itens adicionados depois da carga entram com animação.
  const [iniciais] = useState(() => new Set(profissionais.map((p) => p.id)));
  const por = (papel: Papel) => profissionais.filter((p) => p.papel === papel);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Coluna
        titulo="Cirurgiões"
        vazio={{
          titulo: "Nenhum cirurgião cadastrado.",
          descricao: "Adicione um no formulário acima, com o papel Cirurgião.",
        }}
        itens={por("CIRURGIAO")}
        iniciais={iniciais}
      />
      <Coluna
        titulo="Anestesistas"
        vazio={{
          titulo: "Nenhum anestesista cadastrado.",
          descricao: "Adicione um no formulário acima, com o papel Anestesista.",
        }}
        itens={por("ANESTESISTA")}
        iniciais={iniciais}
      />
    </div>
  );
}
