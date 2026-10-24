/** Mensagem exibida quando nenhuma forma automática de copiar funcionou. */
export function mensagemFalhaCopia(ehToque: boolean): string {
  return ehToque
    ? "Toque e segure o texto para copiar."
    : "Use Ctrl+C para copiar.";
}
