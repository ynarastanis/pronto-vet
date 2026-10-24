import { describe, expect, it } from "vitest";
import {
  abrir,
  editar,
  estadoInicial,
  fechar,
  precisaConfirmarFechar,
  textoExibido,
} from "./edicao-livre";

describe("edicao-livre", () => {
  it("fechada, exibe o texto gerado", () => {
    expect(textoExibido(estadoInicial, "gerado")).toBe("gerado");
  });

  it("ao abrir, a edição começa com o texto gerado atual", () => {
    const e = abrir(estadoInicial, "gerado");
    expect(e.aberta).toBe(true);
    expect(textoExibido(e, "gerado")).toBe("gerado");
  });

  it("copiar usa o texto editado enquanto aberta", () => {
    const e = editar(abrir(estadoInicial, "gerado"), "meu texto");
    expect(textoExibido(e, "gerado")).toBe("meu texto");
  });

  it("mudança nas escolhas (texto gerado novo) não afeta a edição aberta", () => {
    const e = editar(abrir(estadoInicial, "gerado"), "meu texto");
    expect(textoExibido(e, "gerado com outro peso")).toBe("meu texto");
  });

  it("editar com a ficha fechada não faz nada", () => {
    expect(editar(estadoInicial, "x")).toEqual(estadoInicial);
  });

  it("abrir de novo com a ficha aberta mantém a edição", () => {
    const e = editar(abrir(estadoInicial, "gerado"), "meu texto");
    expect(abrir(e, "outro")).toEqual(e);
  });

  it("fechar sem alteração não pede confirmação", () => {
    const e = abrir(estadoInicial, "gerado");
    expect(precisaConfirmarFechar(e)).toBe(false);
  });

  it("fechar com texto alterado pede confirmação", () => {
    const e = editar(abrir(estadoInicial, "gerado"), "meu texto");
    expect(precisaConfirmarFechar(e)).toBe(true);
  });

  it("voltar ao texto de abertura dispensa a confirmação", () => {
    const e = editar(editar(abrir(estadoInicial, "gerado"), "x"), "gerado");
    expect(precisaConfirmarFechar(e)).toBe(false);
  });

  it("fechada nunca pede confirmação", () => {
    expect(precisaConfirmarFechar(estadoInicial)).toBe(false);
  });

  it("fechar descarta a edição e volta ao gerado", () => {
    const e = fechar();
    expect(e).toEqual(estadoInicial);
    expect(textoExibido(e, "gerado novo")).toBe("gerado novo");
  });
});
