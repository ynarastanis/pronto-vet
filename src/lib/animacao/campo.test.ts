import { describe, expect, it } from "vitest";
import {
  PERIODO_RESPIRACAO_MS,
  PERIODO_ONDA_MS,
  afastamentoFenestra,
  alfaLinha,
  deslocamentoLinha,
  fatorRespiracao,
  ondulacao,
} from "./campo";

const centro = { x: 500, y: 400 };
const raios = { x: 220, y: 190 };
const largura = 1000;

describe("fatorRespiracao", () => {
  it("é periódico no ciclo de respiração", () => {
    for (const t of [0, 1234, 4000]) {
      expect(fatorRespiracao(t + PERIODO_RESPIRACAO_MS)).toBeCloseTo(fatorRespiracao(t), 10);
    }
  });
  it("fica entre 0,93 e 1,07", () => {
    for (let t = 0; t <= PERIODO_RESPIRACAO_MS; t += 100) {
      const f = fatorRespiracao(t);
      expect(f).toBeGreaterThanOrEqual(0.93 - 1e-9);
      expect(f).toBeLessThanOrEqual(1.07 + 1e-9);
    }
  });
});

describe("afastamentoFenestra", () => {
  it("empurra para fora da elipse um ponto no centro", () => {
    for (const dy of [-1, 1]) {
      const yBase = centro.y + dy * 12;
      const novo = yBase + afastamentoFenestra({ x: centro.x, yBase, centro, raios });
      expect(Math.abs(novo - centro.y)).toBeGreaterThanOrEqual(raios.y);
    }
  });
  it("quase não desloca pontos longe da abertura", () => {
    expect(Math.abs(afastamentoFenestra({ x: 50, yBase: 400, centro, raios }))).toBe(0);
    expect(Math.abs(afastamentoFenestra({ x: 500, yBase: 40, centro, raios }))).toBeLessThan(6);
  });
  it("é simétrico acima e abaixo do centro", () => {
    const acima = afastamentoFenestra({ x: 560, yBase: centro.y - 70, centro, raios });
    const abaixo = afastamentoFenestra({ x: 560, yBase: centro.y + 70, centro, raios });
    expect(acima).toBeCloseTo(-abaixo, 10);
    expect(acima).toBeLessThan(0);
  });
  it("não deixa duas linhas se cruzarem (monotônico em yBase)", () => {
    let anterior = -Infinity;
    for (let y = centro.y + 1; y < 900; y += 5) {
      const novo = y + afastamentoFenestra({ x: 520, yBase: y, centro, raios });
      expect(novo).toBeGreaterThan(anterior);
      anterior = novo;
    }
  });
});

describe("ondulacao", () => {
  it("é periódica no período da onda e limitada a 8px", () => {
    const base = { x: 120, yBase: 80, centro, raios, largura };
    for (const t of [0, 3000, 9999]) {
      expect(ondulacao({ ...base, t: t + PERIODO_ONDA_MS })).toBeCloseTo(ondulacao({ ...base, t }), 8);
    }
    for (let t = 0; t < PERIODO_ONDA_MS; t += 500) {
      expect(Math.abs(ondulacao({ ...base, t }))).toBeLessThanOrEqual(8);
    }
  });
  it("se atenua perto da abertura", () => {
    const perto = { x: 500, yBase: 400, centro, raios, largura };
    for (let t = 0; t < PERIODO_ONDA_MS; t += 700) {
      expect(Math.abs(ondulacao({ ...perto, t }))).toBeLessThan(0.5);
    }
  });
});

describe("deslocamentoLinha", () => {
  it("é periódico no mínimo múltiplo comum dos ciclos (150 s)", () => {
    const p = { x: 300, yBase: 330, centro, raios, largura };
    const mmc = 150000;
    expect(deslocamentoLinha({ ...p, t: 4321 + mmc })).toBeCloseTo(deslocamentoLinha({ ...p, t: 4321 }), 6);
  });
  it("mantém o deslocamento dentro de um teto", () => {
    for (let t = 0; t < 30000; t += 1500) {
      for (let yBase = 0; yBase <= 800; yBase += 25) {
        for (let x = 0; x <= 1000; x += 50) {
          const d = deslocamentoLinha({ x, yBase, t, centro, raios, largura });
          expect(Math.abs(d)).toBeLessThanOrEqual(raios.y * 1.07 + 8);
        }
      }
    }
  });
  it("não desloca mais que a onda onde a abertura não alcança", () => {
    const d = deslocamentoLinha({ x: 20, yBase: 20, t: 0, centro, raios, largura });
    expect(Math.abs(d)).toBeLessThanOrEqual(8);
  });
});

describe("alfaLinha", () => {
  it("fica entre 0,10 e 0,28 e esmaece para as bordas", () => {
    const perto = alfaLinha({ x: 500, y: 150, centro, largura, altura: 800 });
    const longe = alfaLinha({ x: 0, y: 0, centro, largura, altura: 800 });
    expect(perto).toBeLessThanOrEqual(0.28);
    expect(longe).toBeGreaterThanOrEqual(0.1 - 1e-9);
    expect(perto).toBeGreaterThan(longe);
  });
});
