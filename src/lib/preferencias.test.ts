import { describe, expect, it } from "vitest";
import {
  gravarPreferencia,
  lerPreferencia,
  resolverIdSalvo,
} from "./preferencias";

describe("resolverIdSalvo", () => {
  it("mantém id salvo que ainda existe", () => {
    expect(resolverIdSalvo("a", ["a", "b"])).toBe("a");
  });
  it("ignora id de profissional excluído", () => {
    expect(resolverIdSalvo("x", ["a"])).toBeNull();
  });
  it("retorna null sem id salvo", () => {
    expect(resolverIdSalvo(null, ["a"])).toBeNull();
  });
});

describe("localStorage indisponível", () => {
  it("lerPreferencia retorna null sem localStorage", () => {
    expect(lerPreferencia("prontovet:x")).toBeNull();
  });
  it("gravarPreferencia não lança sem localStorage", () => {
    expect(() => gravarPreferencia("prontovet:x", "a")).not.toThrow();
    expect(() => gravarPreferencia("prontovet:x", null)).not.toThrow();
  });
});
