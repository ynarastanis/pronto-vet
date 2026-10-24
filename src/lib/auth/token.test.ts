import { describe, expect, it } from "vitest";
import { assinarToken, senhaConfere, verificarToken } from "./token";

const SEGREDO = "segredo-de-teste";

describe("token de sessão", () => {
  it("verifica token válido antes da expiração", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    expect(await verificarToken(token, SEGREDO, 1000)).toBe(true);
  });

  it("recusa token expirado", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    expect(await verificarToken(token, SEGREDO, 2000)).toBe(false);
    expect(await verificarToken(token, SEGREDO, 3000)).toBe(false);
  });

  it("recusa assinatura adulterada", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    const meio = 2 + 1 + 20; // dentro da assinatura (depois de "2000.")
    const original = token[meio];
    const adulterado = token.slice(0, meio) + (original === "A" ? "B" : "A") + token.slice(meio + 1);
    expect(await verificarToken(adulterado, SEGREDO, 1000)).toBe(false);
  });

  it("recusa base64url não canônico (último caractere com bits ignorados)", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let aceitos = 0;
    for (const c of alfabeto) {
      if (await verificarToken(token.slice(0, -1) + c, SEGREDO, 1000)) aceitos++;
    }
    expect(aceitos).toBe(1);
  });

  it("recusa token assinado com outro segredo", async () => {
    const token = await assinarToken("outro-segredo", 2000);
    expect(await verificarToken(token, SEGREDO, 1000)).toBe(false);
  });

  it("recusa token malformado sem lançar", async () => {
    for (const token of [undefined, "", "abc", "x.y", "123.", ".abc", "1.2.3", "12.@@@"]) {
      expect(await verificarToken(token, SEGREDO, 0)).toBe(false);
    }
  });

  it("recusa expiração adulterada", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    const assinatura = token.split(".")[1];
    expect(await verificarToken(`9999.${assinatura}`, SEGREDO, 1000)).toBe(false);
  });

  it("assinarToken recusa expiraEm que não seja inteiro positivo", async () => {
    for (const valor of [NaN, 1.5, 0, -1, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      await expect(assinarToken(SEGREDO, valor)).rejects.toThrow("expiraEm inválido");
    }
  });

  it("falha fechado sem segredo", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    expect(await verificarToken(token, undefined, 0)).toBe(false);
    expect(await verificarToken(token, "", 0)).toBe(false);
    await expect(assinarToken("", 1)).rejects.toThrow("APP_SECRET não configurado");
    await expect(assinarToken(undefined, 1)).rejects.toThrow("APP_SECRET não configurado");
  });

  it("trata segredo só com espaços como não configurado", async () => {
    const token = await assinarToken(SEGREDO, 2000);
    expect(await verificarToken(token, "   ", 0)).toBe(false);
    await expect(assinarToken("   ", 1)).rejects.toThrow("APP_SECRET não configurado");
  });
});

describe("senhaConfere", () => {
  it("aceita igual e recusa diferente", async () => {
    expect(await senhaConfere("clinica123", "clinica123")).toBe(true);
    expect(await senhaConfere("clinica124", "clinica123")).toBe(false);
    expect(await senhaConfere("", "clinica123")).toBe(false);
  });

  it("recusa quando APP_PASSWORD não está definida", async () => {
    expect(await senhaConfere("", undefined)).toBe(false);
    expect(await senhaConfere("", "")).toBe(false);
    expect(await senhaConfere("qualquer", undefined)).toBe(false);
  });

  it("trata APP_PASSWORD só com espaços como não configurada", async () => {
    expect(await senhaConfere(" ", " ")).toBe(false);
    expect(await senhaConfere("   ", "   ")).toBe(false);
  });
});
