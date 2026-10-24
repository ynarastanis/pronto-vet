import { describe, expect, it } from "vitest";
import { linhasAlteradas } from "./linhas-alteradas";

describe("linhasAlteradas", () => {
  it("sem texto anterior, nada é realçado", () => {
    expect(linhasAlteradas(null, "a\nb")).toEqual([]);
  });
  it("textos iguais não alteram nada", () => {
    expect(linhasAlteradas("a\nb", "a\nb")).toEqual([]);
  });
  it("realça só a linha que mudou", () => {
    expect(linhasAlteradas("a\nPeso: -- kg\nc", "a\nPeso: 4 kg\nc")).toEqual([1]);
  });
  it("realça linha inserida sem marcar as seguintes", () => {
    expect(linhasAlteradas("a\nc", "a\nb\nc")).toEqual([1]);
  });
  it("linha removida não realça nada", () => {
    expect(linhasAlteradas("a\nb\nc", "a\nc")).toEqual([]);
  });
  it("não realça linhas em branco", () => {
    expect(linhasAlteradas("a", "a\n\nb")).toEqual([2]);
  });
  it("realça várias linhas alteradas", () => {
    expect(linhasAlteradas("x\nb\ny", "x1\nb\ny1")).toEqual([0, 2]);
  });
});
