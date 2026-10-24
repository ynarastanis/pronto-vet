import { segmentosCirurgico } from "./segmentos";
import type { EntradaGeracao } from "./tipos";

export function gerarTextoCirurgico(entrada: EntradaGeracao): string {
  return segmentosCirurgico(entrada)
    .map((s) => s.texto)
    .join("");
}
