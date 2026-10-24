import { describe, expect, it } from "vitest";
import {
  filtrarPorTexto,
  lerListaRecentes,
  registrarRecente,
  resolverRecentes,
} from "./recentes";

describe("registrarRecente", () => {
  it("coloca o novo no início", () => {
    expect(registrarRecente(["a", "b"], "c")).toEqual(["c", "a", "b"]);
  });
  it("move um repetido para o início sem duplicar", () => {
    expect(registrarRecente(["a", "b", "c"], "c")).toEqual(["c", "a", "b"]);
  });
  it("mantém no máximo 4", () => {
    expect(registrarRecente(["a", "b", "c", "d"], "e")).toEqual(["e", "a", "b", "c"]);
  });
  it("respeita um máximo informado", () => {
    expect(registrarRecente(["a", "b"], "c", 2)).toEqual(["c", "a"]);
  });
  it("não altera a lista original", () => {
    const original = ["a"];
    registrarRecente(original, "b");
    expect(original).toEqual(["a"]);
  });
});

describe("resolverRecentes", () => {
  it("ignora ids que não existem mais, mantendo a ordem", () => {
    expect(resolverRecentes(["a", "x", "b"], ["a", "b", "c"])).toEqual(["a", "b"]);
  });
  it("remove repetidos e limita a 4", () => {
    expect(
      resolverRecentes(["a", "a", "b", "c", "d", "e"], ["a", "b", "c", "d", "e"]),
    ).toEqual(["a", "b", "c", "d"]);
  });
});

describe("lerListaRecentes", () => {
  it("lê uma lista JSON de textos", () => {
    expect(lerListaRecentes('["a","b"]')).toEqual(["a", "b"]);
  });
  it("devolve lista vazia para null, lixo ou formato errado", () => {
    expect(lerListaRecentes(null)).toEqual([]);
    expect(lerListaRecentes("{")).toEqual([]);
    expect(lerListaRecentes('{"a":1}')).toEqual([]);
  });
  it("descarta itens que não são texto", () => {
    expect(lerListaRecentes('["a",1,null]')).toEqual(["a"]);
  });
});

describe("filtrarPorTexto", () => {
  const itens = [
    { id: "1", nome: "João Álvares" },
    { id: "2", nome: "Ana Souza" },
    { id: "3", nome: "Joana Dias" },
  ];
  it("ignora maiúsculas e acentos", () => {
    expect(filtrarPorTexto(itens, "joao").map((i) => i.id)).toEqual(["1"]);
    expect(filtrarPorTexto(itens, "ÁLV").map((i) => i.id)).toEqual(["1"]);
  });
  it("texto vazio devolve todos", () => {
    expect(filtrarPorTexto(itens, "  ")).toHaveLength(3);
  });
  it("sem correspondência devolve vazio", () => {
    expect(filtrarPorTexto(itens, "zzz")).toEqual([]);
  });
});
