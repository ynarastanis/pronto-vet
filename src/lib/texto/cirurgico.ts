import { normalizarTexto } from "./normalizar";
import type { EntradaGeracao } from "./tipos";

function nomeOuTraco(nome: string | null): string {
  return normalizarTexto(nome) || "--";
}

export function gerarTextoCirurgico(entrada: EntradaGeracao): string {
  const { procedimento, cirurgiao, anestesista } = entrada;
  return [
    `PROCEDIMENTO CIRÚRGICO: ${normalizarTexto(procedimento.nome)}`,
    `CIRURGIÃO: ${nomeOuTraco(cirurgiao)}\nANESTESISTA: ${nomeOuTraco(anestesista)}`,
    normalizarTexto(procedimento.descricaoTecnica),
    normalizarTexto(procedimento.prescricao),
  ].join("\n\n");
}
