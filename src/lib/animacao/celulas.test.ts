import { describe, expect, it } from "vitest";
import {
  criarGerador,
  distanciaRetanguloArredondado,
  fatorAlfaRespiro,
  gerarCelulas,
  pontosMembrana,
  pontosNucleo,
  posicaoCelula,
  raioMembrana,
} from "./celulas";

const base = { largura: 1280, altura: 800, semente: 7 };
const TEMPOS = [0, 1500, 12_345, 60_000, 250_000];

describe("criarGerador", () => {
  it("é determinístico e fica em [0, 1)", () => {
    const a = criarGerador(42);
    const b = criarGerador(42);
    for (let i = 0; i < 50; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it("sementes diferentes dão sequências diferentes", () => {
    expect(criarGerador(1)()).not.toBe(criarGerador(2)());
  });
});

describe("gerarCelulas", () => {
  it("gera a mesma lâmina para a mesma semente", () => {
    expect(gerarCelulas(base)).toEqual(gerarCelulas(base));
  });
  it("a contagem escala com a área", () => {
    const desktop = gerarCelulas(base).length;
    const mobile = gerarCelulas({ largura: 390, altura: 844, semente: 7 }).length;
    expect(desktop).toBeGreaterThanOrEqual(14);
    expect(desktop).toBeLessThanOrEqual(20);
    expect(mobile).toBeGreaterThanOrEqual(8);
    expect(mobile).toBeLessThanOrEqual(10);
    expect(mobile).toBeLessThan(desktop);
  });
  it("usa raios variados e as três cores", () => {
    const celulas = gerarCelulas(base);
    const raios = celulas.map((c) => c.raio);
    expect(Math.min(...raios)).toBeGreaterThanOrEqual(40 * 0.7);
    expect(Math.max(...raios)).toBeLessThanOrEqual(140);
    expect(new Set(celulas.map((c) => c.cor))).toEqual(new Set([0, 1, 2]));
  });
});

describe("raioMembrana", () => {
  it("fecha a curva: ângulo 0 equivale a 2π", () => {
    for (const c of gerarCelulas(base)) {
      for (const t of TEMPOS) {
        expect(raioMembrana(c, 0, t)).toBeCloseTo(raioMembrana(c, Math.PI * 2, t), 8);
      }
    }
  });
  it("fica sempre entre 0,88 e 1,12 do raio", () => {
    for (const c of gerarCelulas(base)) {
      for (const t of TEMPOS) {
        for (let i = 0; i < 64; i++) {
          const r = raioMembrana(c, (i / 64) * Math.PI * 2, t);
          expect(r).toBeGreaterThanOrEqual(0.88 * c.raio - 1e-9);
          expect(r).toBeLessThanOrEqual(1.12 * c.raio + 1e-9);
        }
      }
    }
  });
});

describe("posicaoCelula", () => {
  it("fica dentro da amplitude de deriva", () => {
    for (const c of gerarCelulas(base)) {
      for (const t of TEMPOS) {
        const p = posicaoCelula(c, t);
        expect(Math.abs(p.x - c.x)).toBeLessThanOrEqual(c.ampX + 1e-9);
        expect(Math.abs(p.y - c.y)).toBeLessThanOrEqual(c.ampY + 1e-9);
      }
    }
  });
  it("é contínua no tempo", () => {
    const c = gerarCelulas(base)[0];
    const a = posicaoCelula(c, 10_000);
    const b = posicaoCelula(c, 10_016);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(0.2);
  });
});

describe("pontosMembrana", () => {
  it("devolve n pontos (x, y) e reaproveita o buffer", () => {
    const c = gerarCelulas(base)[0];
    const buffer = new Float64Array(2 * 56);
    expect(pontosMembrana(c, 1000, 56, buffer)).toBe(buffer);
    expect(pontosMembrana(c, 1000, 56).length).toBe(112);
  });
  it("mantém os pontos a 0,88–1,12 do raio em torno da posição", () => {
    for (const c of gerarCelulas(base)) {
      const p = posicaoCelula(c, 5000);
      const pts = pontosMembrana(c, 5000, 48);
      for (let i = 0; i < 48; i++) {
        const d = Math.hypot(pts[2 * i] - p.x, pts[2 * i + 1] - p.y);
        expect(d).toBeGreaterThanOrEqual(0.88 * c.raio - 1e-6);
        expect(d).toBeLessThanOrEqual(1.12 * c.raio + 1e-6);
      }
    }
  });
});

describe("pontosNucleo", () => {
  it("fica sempre dentro da membrana", () => {
    for (const c of gerarCelulas(base)) {
      for (const t of TEMPOS) {
        const p = posicaoCelula(c, t);
        const pts = pontosNucleo(c, t, 32);
        for (let i = 0; i < 32; i++) {
          const d = Math.hypot(pts[2 * i] - p.x, pts[2 * i + 1] - p.y);
          const ang = Math.atan2(pts[2 * i + 1] - p.y, pts[2 * i] - p.x);
          expect(d).toBeLessThan(raioMembrana(c, ang, t));
        }
      }
    }
  });
});

describe("distanciaRetanguloArredondado", () => {
  const ret = { x: 100, y: 100, largura: 200, altura: 100, raio: 20 };
  it("é negativa dentro e zero na borda reta", () => {
    expect(distanciaRetanguloArredondado(200, 150, ret)).toBeLessThan(0);
    expect(distanciaRetanguloArredondado(300, 150, ret)).toBeCloseTo(0, 10);
    expect(distanciaRetanguloArredondado(200, 100, ret)).toBeCloseTo(0, 10);
  });
  it("cresce fora, pela distância à borda", () => {
    expect(distanciaRetanguloArredondado(340, 150, ret)).toBeCloseTo(40, 10);
    expect(distanciaRetanguloArredondado(200, 40, ret)).toBeCloseTo(60, 10);
  });
  it("respeita o canto arredondado", () => {
    // A quina do retângulo reto fica fora do arredondado.
    expect(distanciaRetanguloArredondado(300, 100, ret)).toBeGreaterThan(0);
    const diag = 20 * (1 - Math.SQRT1_2);
    expect(distanciaRetanguloArredondado(300 - diag, 100 + diag, ret)).toBeCloseTo(0, 10);
  });
  it("é simétrica em relação ao centro", () => {
    for (const [dx, dy] of [[130, 20], [-90, 70], [10, 200]]) {
      const a = distanciaRetanguloArredondado(200 + dx, 150 + dy, ret);
      expect(distanciaRetanguloArredondado(200 - dx, 150 - dy, ret)).toBeCloseTo(a, 10);
      expect(distanciaRetanguloArredondado(200 + dx, 150 - dy, ret)).toBeCloseTo(a, 10);
    }
  });
});

describe("fatorAlfaRespiro", () => {
  it("fica no mínimo até a margem e volta a 1 longe", () => {
    expect(fatorAlfaRespiro(-50)).toBeCloseTo(0.4, 10);
    expect(fatorAlfaRespiro(40)).toBeCloseTo(0.4, 10);
    expect(fatorAlfaRespiro(1000)).toBe(1);
  });
  it("é monotônico", () => {
    let anterior = 0;
    for (let d = 0; d <= 300; d += 10) {
      const f = fatorAlfaRespiro(d);
      expect(f).toBeGreaterThanOrEqual(anterior);
      anterior = f;
    }
  });
});
