import { describe, expect, it } from "vitest";
import { validarFormulario } from "./validar";
import { schemaProfissional } from "./profissional";
import { schemaProcedimento } from "./procedimento";
import { schemaDescricaoAnestesica } from "./descricao-anestesica";

function form(campos: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(campos)) fd.append(k, v);
  return fd;
}

describe("validação", () => {
  it("aceita profissional e remove espaços do nome", () => {
    const r = validarFormulario(schemaProfissional, form({ nome: " Ana ", papel: "CIRURGIAO" }));
    expect(r).toEqual({ ok: true, dados: { nome: "Ana", papel: "CIRURGIAO" } });
  });

  it("rejeita profissional sem nome", () => {
    const r = validarFormulario(schemaProfissional, form({ nome: "  ", papel: "CIRURGIAO" }));
    expect(r).toEqual({ ok: false, erros: { nome: "Informe o nome." } });
  });

  it("rejeita nome com 121 caracteres", () => {
    const r = validarFormulario(schemaProfissional, form({ nome: "a".repeat(121), papel: "ANESTESISTA" }));
    expect(r).toEqual({ ok: false, erros: { nome: "Máximo de 120 caracteres." } });
  });

  it("rejeita papel inválido", () => {
    const r = validarFormulario(schemaProfissional, form({ nome: "Ana", papel: "OUTRO" }));
    expect(r).toEqual({ ok: false, erros: { papel: "Selecione o papel." } });
  });

  it("rejeita papel ausente", () => {
    const r = validarFormulario(schemaProfissional, form({ nome: "Ana" }));
    expect(r).toEqual({ ok: false, erros: { papel: "Selecione o papel." } });
  });

  it("rejeita procedimento com técnica só com espaços", () => {
    const r = validarFormulario(
      schemaProcedimento,
      form({ nome: "X", descricaoTecnica: "   \n ", prescricao: "p" }),
    );
    expect(r).toEqual({ ok: false, erros: { descricaoTecnica: "Informe a descrição da técnica." } });
  });

  it("rejeita procedimento sem prescrição", () => {
    const r = validarFormulario(schemaProcedimento, form({ nome: "X", descricaoTecnica: "t" }));
    expect(r).toEqual({ ok: false, erros: { prescricao: "Informe a prescrição." } });
  });

  it("valida limites de procedimento e preserva quebras internas", () => {
    const longo = validarFormulario(
      schemaProcedimento,
      form({ nome: "a".repeat(151), descricaoTecnica: "a".repeat(10001), prescricao: "b".repeat(10001) }),
    );
    expect(longo).toEqual({
      ok: false,
      erros: {
        nome: "Máximo de 150 caracteres.",
        descricaoTecnica: "Máximo de 10000 caracteres.",
        prescricao: "Máximo de 10000 caracteres.",
      },
    });
    const ok = validarFormulario(
      schemaProcedimento,
      form({ nome: "X", descricaoTecnica: " a\r\nb ", prescricao: "p" }),
    );
    expect(ok.ok && ok.dados.descricaoTecnica).toBe("a\r\nb");
  });

  it("aceita ASA emergencial 'II E' e rejeita 'VI'", () => {
    expect(validarFormulario(schemaDescricaoAnestesica, form({ asa: "II E" })).ok).toBe(true);
    const r = validarFormulario(schemaDescricaoAnestesica, form({ asa: "VI" }));
    expect(r).toEqual({ ok: false, erros: { asa: "Selecione a classificação ASA." } });
    const ausente = validarFormulario(schemaDescricaoAnestesica, form({}));
    expect(ausente).toEqual({ ok: false, erros: { asa: "Selecione a classificação ASA." } });
  });

  it("converte opcionais vazios ou só com espaços em null", () => {
    const r = validarFormulario(
      schemaDescricaoAnestesica,
      form({ asa: "I", mpa: "", inducao: "   ", manutencao: " ok " }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.dados.mpa).toBeNull();
      expect(r.dados.inducao).toBeNull();
      expect(r.dados.bloqueioLocal).toBeNull();
      expect(r.dados.manutencao).toBe("ok");
    }
  });

  it("rejeita opcional com 2001 caracteres", () => {
    const r = validarFormulario(schemaDescricaoAnestesica, form({ asa: "I", mpa: "a".repeat(2001) }));
    expect(r).toEqual({ ok: false, erros: { mpa: "Máximo de 2000 caracteres." } });
  });
});
