import { describe, expect, it } from "vitest";
import { rotuloAmbiente } from "./ambiente";

describe("rotuloAmbiente", () => {
  it("não exibe nada em produção", () => {
    expect(rotuloAmbiente("production")).toBeNull();
  });
  it("rotula o Preview da Vercel", () => {
    expect(rotuloAmbiente("preview")).toBe("Preview");
  });
  it("rotula desenvolvimento como Local", () => {
    expect(rotuloAmbiente("development")).toBe("Local");
  });
  it("trata indefinido e vazio como Local", () => {
    expect(rotuloAmbiente(undefined)).toBe("Local");
    expect(rotuloAmbiente("")).toBe("Local");
  });
  it("devolve valores desconhecidos como estão", () => {
    expect(rotuloAmbiente("staging")).toBe("staging");
  });
});
