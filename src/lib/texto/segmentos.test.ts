import { describe, expect, it } from "vitest";
import { gerarTextoAnestesico } from "./anestesico";
import { gerarTextoCirurgico } from "./cirurgico";
import {
  dividirEmLinhas,
  segmentosAnestesico,
  segmentosCirurgico,
  type Segmento,
} from "./segmentos";
import type { DadosProcedimento, EntradaGeracao } from "./tipos";

const procedimento: DadosProcedimento = {
  nome: "OHE ELETIVA FELINA",
  descricaoTecnica: "Incisão retro umbilical.\nSem intercorrências.",
  prescricao: "Prescrito: dipirona.\nRetorno em 15 dias.",
  descricaoAnestesica: {
    asa: "I",
    mpa: "Cetamina IM",
    inducao: "Propofol IV",
    manutencao: "Isoflurano",
    bloqueioLocal: "Lidocaína",
    analgesiaTrans: "Fentanil",
    antibioticoPre: "Cefalotina",
    posImediato: "Dipirona",
    observacoes: "Sem intercorrências.",
  },
};
const entrada: EntradaGeracao = {
  procedimento,
  cirurgiao: "Dra. Ana Souza",
  anestesista: "Dr. Bruno Lima",
  peso: "4,2",
};
const vazios = {
  mpa: null,
  inducao: "  ",
  manutencao: null,
  bloqueioLocal: null,
  analgesiaTrans: null,
  antibioticoPre: null,
  posImediato: null,
  observacoes: "",
};

const casos: Array<[string, EntradaGeracao]> = [
  ["completo", entrada],
  ["profissionais ausentes", { ...entrada, cirurgiao: null, anestesista: "  " }],
  ["peso com kg", { ...entrada, peso: "4,2 kg" }],
  ["peso vazio", { ...entrada, peso: "" }],
  [
    "opcionais vazios",
    {
      ...entrada,
      procedimento: {
        ...procedimento,
        descricaoAnestesica: { ...procedimento.descricaoAnestesica, ...vazios },
      },
    },
  ],
  [
    "quebras CRLF",
    {
      ...entrada,
      procedimento: {
        ...procedimento,
        nome: " Nome\r\nem duas linhas ",
        descricaoTecnica: "a\r\nb\rc",
        prescricao: "d\r\ne",
      },
    },
  ],
];

const unir = (s: Segmento[]) => s.map((x) => x.texto).join("");

describe("segmentos: invariante com o texto gerado", () => {
  for (const [nome, e] of casos) {
    it(`cirúrgico, ${nome}`, () => {
      expect(unir(segmentosCirurgico(e))).toBe(gerarTextoCirurgico(e));
    });
    it(`anestésico, ${nome}`, () => {
      expect(unir(segmentosAnestesico(e))).toBe(gerarTextoAnestesico(e));
    });
  }
});

describe("segmentos: destaques", () => {
  it("cirúrgico destaca procedimento, cirurgião e anestesista", () => {
    const d = segmentosCirurgico(entrada).filter((s) => s.destaque);
    expect(d).toEqual([
      { texto: "OHE ELETIVA FELINA", destaque: "procedimento" },
      { texto: "Dra. Ana Souza", destaque: "cirurgiao" },
      { texto: "Dr. Bruno Lima", destaque: "anestesista" },
    ]);
  });

  it("anestésico destaca o peso sem o kg", () => {
    const d = segmentosAnestesico({ ...entrada, peso: "4,2 kg" }).filter(
      (s) => s.destaque,
    );
    expect(d).toEqual([
      { texto: "Dra. Ana Souza", destaque: "cirurgiao" },
      { texto: "Dr. Bruno Lima", destaque: "anestesista" },
      { texto: "4,2", destaque: "peso" },
      { texto: "OHE ELETIVA FELINA", destaque: "procedimento" },
    ]);
  });

  it("marca ausente quando o valor é --", () => {
    const d = segmentosAnestesico({
      ...entrada,
      cirurgiao: null,
      peso: "",
    }).filter((s) => s.destaque);
    expect(d[0]).toEqual({ texto: "--", destaque: "cirurgiao", ausente: true });
    expect(d[2]).toEqual({ texto: "--", destaque: "peso", ausente: true });
    expect(d[1].ausente).toBeUndefined();
  });
});

describe("dividirEmLinhas", () => {
  it("separa por quebra de linha mantendo o texto idêntico", () => {
    for (const [, e] of casos) {
      for (const segs of [segmentosCirurgico(e), segmentosAnestesico(e)]) {
        const linhas = dividirEmLinhas(segs).map(unir);
        expect(linhas.join("")).toBe(unir(segs));
        expect(linhas).toEqual(
          unir(segs)
            .split("\n")
            .map((l, i, a) => (i < a.length - 1 ? l + "\n" : l)),
        );
      }
    }
  });

  it("mantém o destaque nas linhas", () => {
    const linhas = dividirEmLinhas(segmentosCirurgico(entrada));
    expect(linhas[0].some((s) => s.destaque === "procedimento")).toBe(true);
    expect(linhas[2].some((s) => s.destaque === "cirurgiao")).toBe(true);
  });
});
