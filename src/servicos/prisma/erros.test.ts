import { describe, expect, it } from "vitest";
import { ErroNaoEncontrado, ErroNomeDuplicado } from "../erros";
import { traduzirErroPrisma } from "./erros";

describe("traduzirErroPrisma", () => {
  it("P2002 no campo nome vira ErroNomeDuplicado", () => {
    expect(traduzirErroPrisma({ code: "P2002", meta: { target: ["nome"] } })).toBeInstanceOf(
      ErroNomeDuplicado,
    );
  });

  it("P2002 com target em formato de texto (adapter) também vira ErroNomeDuplicado", () => {
    expect(
      traduzirErroPrisma({ code: "P2002", meta: { target: "ProcedimentoCirurgico_nome_key" } }),
    ).toBeInstanceOf(ErroNomeDuplicado);
  });

  it("P2002 com campos do adapter (driverAdapterError) vira ErroNomeDuplicado", () => {
    const erro = {
      code: "P2002",
      meta: {
        modelName: "ProcedimentoCirurgico",
        driverAdapterError: {
          cause: { kind: "UniqueConstraintViolation", constraint: { fields: ["nome"] } },
        },
      },
    };
    expect(traduzirErroPrisma(erro)).toBeInstanceOf(ErroNomeDuplicado);
  });

  it("23505 cru do driver HTTP do Neon, na restrição do nome, vira ErroNomeDuplicado", () => {
    const erro = {
      code: "23505",
      meta: { modelName: "ProcedimentoCirurgico" },
      message: "duplicate key value violates unique constraint \"ProcedimentoCirurgico_nome_key\"",
    };
    expect(traduzirErroPrisma(erro)).toBeInstanceOf(ErroNomeDuplicado);
  });

  it("23505 cru em outra restrição não vira ErroNomeDuplicado", () => {
    const erro = {
      code: "23505",
      message: "duplicate key value violates unique constraint \"DescricaoAnestesica_procedimentoId_key\"",
    };
    expect(traduzirErroPrisma(erro)).toBe(erro);
  });

  it("P2002 em outro campo não vira ErroNomeDuplicado", () => {
    const erro = { code: "P2002", meta: { target: ["procedimentoId"] } };
    expect(traduzirErroPrisma(erro)).toBe(erro);
  });

  it("P2025 vira ErroNaoEncontrado", () => {
    expect(traduzirErroPrisma({ code: "P2025" })).toBeInstanceOf(ErroNaoEncontrado);
  });

  it("P2003 vira ErroNaoEncontrado", () => {
    expect(traduzirErroPrisma({ code: "P2003" })).toBeInstanceOf(ErroNaoEncontrado);
  });

  it("outros erros voltam intactos", () => {
    const erro = new Error("x");
    expect(traduzirErroPrisma(erro)).toBe(erro);
    expect(traduzirErroPrisma(null)).toBeNull();
    expect(traduzirErroPrisma("texto")).toBe("texto");
  });

  it("não troca um erro de domínio já traduzido", () => {
    const erro = new ErroNaoEncontrado();
    expect(traduzirErroPrisma(erro)).toBe(erro);
  });
});
