import { describe, expect, it } from "vitest";
import { escolherFonte } from "./fonte";

describe("escolherFonte", () => {
  it("usa memória só quando FONTE_DADOS é 'memoria'", () => {
    expect(escolherFonte("memoria")).toBe("memoria");
    expect(escolherFonte(" MEMORIA ")).toBe("memoria");
  });

  it("usa prisma quando ausente, vazio ou outro valor", () => {
    for (const valor of [undefined, "", "prisma", "mock", "memória"]) {
      expect(escolherFonte(valor)).toBe("prisma");
    }
  });
});
