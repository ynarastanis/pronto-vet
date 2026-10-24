import "server-only";
import { escolherFonte } from "./fonte";
import { servicosMemoria } from "./memoria";
import type { Servicos } from "./tipos";

export function servicos(): Servicos {
  if (escolherFonte(process.env.FONTE_DADOS) === "memoria") {
    return servicosMemoria();
  }
  // T010 troca por servicosPrisma()
  throw new Error(
    "Fonte de dados não configurada. Defina FONTE_DADOS=memoria para usar dados de demonstração.",
  );
}
