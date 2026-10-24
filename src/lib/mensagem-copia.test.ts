import { describe, expect, it } from "vitest";
import { mensagemFalhaCopia } from "./mensagem-copia";

describe("mensagemFalhaCopia", () => {
  it("em tela de toque orienta o toque longo", () => {
    expect(mensagemFalhaCopia(true)).toBe("Toque e segure o texto para copiar.");
  });
  it("nos demais aparelhos orienta Ctrl+C", () => {
    expect(mensagemFalhaCopia(false)).toBe("Use Ctrl+C para copiar.");
  });
});
