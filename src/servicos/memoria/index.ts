import type { Procedimento, Profissional, Servicos } from "../tipos";
import { DADOS_DEMONSTRACAO } from "./dados-demonstracao";
import { criarServicoProcedimentos } from "./procedimentos";
import { criarServicoProfissionais } from "./profissionais";

export type EstadoMemoria = {
  profissionais: Profissional[];
  procedimentos: Procedimento[];
};

/** Cada chamada cria um estado próprio, clonado da entrada (padrão: dados de demonstração). */
export function criarServicosMemoria(estadoInicial: EstadoMemoria = DADOS_DEMONSTRACAO): Servicos {
  const estado = structuredClone(estadoInicial);
  return {
    profissionais: criarServicoProfissionais(estado.profissionais),
    procedimentos: criarServicoProcedimentos(estado.procedimentos),
  };
}

const globalComMemoria = globalThis as typeof globalThis & {
  __prontoVetMemoria?: Servicos;
};

/** Singleton que sobrevive ao hot reload do `next dev`. */
export function servicosMemoria(): Servicos {
  globalComMemoria.__prontoVetMemoria ??= criarServicosMemoria();
  return globalComMemoria.__prontoVetMemoria;
}
