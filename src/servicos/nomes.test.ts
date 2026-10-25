import { describe, expect, it } from "vitest";
import { compararNomes, nomeContemTermo } from "./nomes";

describe("compararNomes", () => {
  it("ordena em pt-BR, ignorando acento e caixa na primeira letra", () => {
    const nomes = ["Bruno", "andré", "Ágata", "Zeca", "ÇÃO"];
    expect([...nomes].sort(compararNomes)).toEqual(["Ágata", "andré", "Bruno", "ÇÃO", "Zeca"]);
  });
});

describe("nomeContemTermo", () => {
  it("termo vazio ou só com espaços casa com tudo", () => {
    expect(nomeContemTermo("CASTRAÇÃO", "")).toBe(true);
    expect(nomeContemTermo("CASTRAÇÃO", "   ")).toBe(true);
  });

  it("ignora maiúsculas, inclusive fora do ASCII", () => {
    expect(nomeContemTermo("OHE ELETIVA", "ohe")).toBe(true);
    expect(nomeContemTermo("CASTRAÇÃO", "ção")).toBe(true);
    expect(nomeContemTermo("Castração", "ÇÃO")).toBe(true);
  });

  it("remove espaços das pontas do termo", () => {
    expect(nomeContemTermo("OHE ELETIVA", "  ohe ")).toBe(true);
  });

  it("trata % e _ literalmente", () => {
    expect(nomeContemTermo("CASTRAÇÃO", "%")).toBe(false);
    expect(nomeContemTermo("CASTRAÇÃO", "_")).toBe(false);
    expect(nomeContemTermo("100% FELINO", "%")).toBe(true);
    expect(nomeContemTermo("A_B", "_")).toBe(true);
  });

  it("não casa quando o termo não aparece", () => {
    expect(nomeContemTermo("CASTRAÇÃO", "ohe")).toBe(false);
  });
});
