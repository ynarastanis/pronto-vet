import type { Servicos } from "../tipos";
import { criarServicoProcedimentos } from "./procedimentos";
import { criarServicoProfissionais } from "./profissionais";

export function servicosPrisma(): Servicos {
  return {
    profissionais: criarServicoProfissionais(),
    procedimentos: criarServicoProcedimentos(),
  };
}
