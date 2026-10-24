import { describe, expect, it } from "vitest";
import { gerarTextoAnestesico } from "./anestesico";
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

function comAnestesia(
  parcial: Partial<DadosProcedimento["descricaoAnestesica"]>,
): EntradaGeracao {
  return {
    ...entrada,
    procedimento: {
      ...procedimento,
      descricaoAnestesica: { ...procedimento.descricaoAnestesica, ...parcial },
    },
  };
}

describe("gerarTextoAnestesico", () => {
  it("gera o texto anestésico completo", () => {
    expect(gerarTextoAnestesico(entrada)).toBe(
      [
        "CIRURGIÃO: Dra. Ana Souza",
        "ANESTESISTA: Dr. Bruno Lima",
        "Peso do paciente: 4,2 kg",
        "ASA: I",
        "Procedimento: OHE ELETIVA FELINA",
        "Medicação Pré Anestésica: Cetamina (2mg/kg) + Xilazina (0,5mg/kg) + Morfina (0,2mg/kg) + Midazolam (0,2mg/kg) Administrados IM",
        "INDUÇÃO: Propofol (4mg/kg) dose efeito IV",
        "MANUTENÇÃO: Isoflurano",
        "BLOQUEIO LOCAL: Lidocaína (4mg/kg)",
        "ANALGESIA TRANS: Fentanil (4mcg/kg) IV",
        "ANTIBIOTICO PRÉ: Cefalotina (30mg/kg) IV",
        "PÓS IMEDIATO: Dipirona (25mg/kg) + Meloxicam (0,05mg/kg) SC + Tramadol (3mg/kg) SC",
        "Sem intercorrências. Parâmetros fisiológicos se mantiveram dentro da normalidade para a espécie.",
      ].join("\n"),
    );
  });

  it("omite linhas de campos opcionais nulos, vazios ou só com espaços", () => {
    const texto = gerarTextoAnestesico(
      comAnestesia({ bloqueioLocal: null, analgesiaTrans: "", observacoes: "   " }),
    );
    expect(texto).not.toContain("BLOQUEIO LOCAL");
    expect(texto).not.toContain("ANALGESIA TRANS");
    const linhas = texto.split("\n");
    expect(linhas[linhas.length - 1]).toMatch(/^PÓS IMEDIATO: /);
  });

  it("usa -- quando o peso está em branco", () => {
    expect(gerarTextoAnestesico({ ...entrada, peso: "" })).toContain("Peso do paciente: -- kg");
    expect(gerarTextoAnestesico({ ...entrada, peso: "   " })).toContain("Peso do paciente: -- kg");
  });

  it("não duplica a unidade quando o peso já tem kg", () => {
    for (const peso of ["5 kg", "5kg", "5 KG"]) {
      const texto = gerarTextoAnestesico({ ...entrada, peso });
      expect(texto).toContain("Peso do paciente: 5 kg\n");
    }
  });

  it("usa -- para profissionais ausentes", () => {
    const texto = gerarTextoAnestesico({ ...entrada, cirurgiao: null, anestesista: null });
    expect(texto.startsWith("CIRURGIÃO: --\nANESTESISTA: --\n")).toBe(true);
  });

  it("normaliza \r\n em campos com várias linhas", () => {
    const texto = gerarTextoAnestesico(comAnestesia({ posImediato: "a\r\nb" }));
    expect(texto).toContain("PÓS IMEDIATO: a\nb");
    expect(texto).not.toContain("\r");
  });
});
