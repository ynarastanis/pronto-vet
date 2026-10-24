import { describe, expect, it } from "vitest";
import { gerarTextoCirurgico } from "./cirurgico";
import type { DadosProcedimento, EntradaGeracao } from "./tipos";

const procedimento: DadosProcedimento = {
  nome: "OHE ELETIVA FELINA",
  descricaoTecnica: "Incisão retro umbilical com lâmina n° 23.\nSem intercorrências.",
  prescricao: "Prescrito: dipirona 25 mg/kg bid 5 dias.\nRetorno em 15 dias.",
  descricaoAnestesica: {
    asa: "I",
    mpa: "Cetamina (2mg/kg) + Xilazina (0,5mg/kg) + Morfina (0,2mg/kg) + Midazolam (0,2mg/kg) Administrados IM",
    inducao: "Propofol (4mg/kg) dose efeito IV",
    manutencao: "Isoflurano",
    bloqueioLocal: "Lidocaína (4mg/kg)",
    analgesiaTrans: "Fentanil (4mcg/kg) IV",
    antibioticoPre: "Cefalotina (30mg/kg) IV",
    posImediato: "Dipirona (25mg/kg) + Meloxicam (0,05mg/kg) SC + Tramadol (3mg/kg) SC",
    observacoes:
      "Sem intercorrências. Parâmetros fisiológicos se mantiveram dentro da normalidade para a espécie.",
  },
};
const entrada: EntradaGeracao = {
  procedimento,
  cirurgiao: "Dra. Ana Souza",
  anestesista: "Dr. Bruno Lima",
  peso: "4,2",
};

describe("gerarTextoCirurgico", () => {
  it("gera o texto cirúrgico completo", () => {
    expect(gerarTextoCirurgico(entrada)).toBe(
      "PROCEDIMENTO CIRÚRGICO: OHE ELETIVA FELINA\n\n" +
        "CIRURGIÃO: Dra. Ana Souza\nANESTESISTA: Dr. Bruno Lima\n\n" +
        "Incisão retro umbilical com lâmina n° 23.\nSem intercorrências.\n\n" +
        "Prescrito: dipirona 25 mg/kg bid 5 dias.\nRetorno em 15 dias.",
    );
  });

  it("usa -- para cirurgião e anestesista ausentes", () => {
    const texto = gerarTextoCirurgico({ ...entrada, cirurgiao: null, anestesista: null });
    expect(texto).toContain("CIRURGIÃO: --\nANESTESISTA: --");
  });

  it("remove espaços nas pontas dos campos", () => {
    const texto = gerarTextoCirurgico({
      ...entrada,
      procedimento: { ...procedimento, descricaoTecnica: "  a\nb  " },
    });
    expect(texto).toContain("\n\na\nb\n\n");
  });

  it("normaliza \r\n para \n", () => {
    const texto = gerarTextoCirurgico({
      ...entrada,
      procedimento: { ...procedimento, prescricao: "x\r\ny" },
    });
    expect(texto).not.toContain("\r");
    expect(texto.endsWith("x\ny")).toBe(true);
  });
});
