import { segmentosAnestesico } from "./segmentos";
import type { EntradaGeracao } from "./tipos";

export function gerarTextoAnestesico(entrada: EntradaGeracao): string {
  return segmentosAnestesico(entrada)
    .map((s) => s.texto)
    .join("");
}
