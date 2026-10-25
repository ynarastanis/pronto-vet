/**
 * Lâmina de histologia: células orgânicas à deriva. Funções puras; o tempo `t` (ms)
 * é sempre parâmetro.
 */

const DOIS_PI = Math.PI * 2;
/** Soma das amplitudes dos harmônicos da membrana (fração do raio). */
const AMPLITUDE_MEMBRANA = 0.12;
/** Soma das amplitudes dos harmônicos do núcleo (fração do raio do núcleo). */
const AMPLITUDE_NUCLEO = 0.08;
const ORDENS = [2, 3, 4, 5];

/** Cor da célula: 0 = primária do app, 1 = cirúrgica (terracota), 2 = anestésica (violeta). */
export type CorCelula = 0 | 1 | 2;

export interface Harmonico {
  ordem: number;
  /** Amplitude relativa ao raio. */
  amp: number;
  fase: number;
  /** Velocidade angular da fase, rad/ms. */
  vel: number;
}

export interface Celula {
  x: number;
  y: number;
  raio: number;
  ampX: number;
  ampY: number;
  /** Frequências angulares da deriva, rad/ms. */
  velX: number;
  velY: number;
  faseX: number;
  faseY: number;
  rot0: number;
  /** Rotação, rad/ms. */
  velRot: number;
  membrana: Harmonico[];
  nucleo: {
    raio: number;
    harmonicos: Harmonico[];
    /** Deslocamento máximo do centro do núcleo, em px, por eixo. */
    desloc: number;
    velX: number;
    velY: number;
    faseX: number;
    faseY: number;
  };
  cor: CorCelula;
}

export interface Retangulo {
  x: number;
  y: number;
  largura: number;
  altura: number;
  /** Raio dos cantos. */
  raio: number;
}

/** mulberry32: gerador pseudoaleatório determinístico em [0, 1). */
export function criarGerador(semente: number): () => number {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function periodoParaVel(periodoMs: number): number {
  return DOIS_PI / periodoMs;
}

function criarHarmonicos(
  rng: () => number,
  total: number,
  periodoMin: number,
  periodoMax: number,
): Harmonico[] {
  const pesos = ORDENS.map(() => 0.5 + rng());
  const soma = pesos.reduce((a, b) => a + b, 0);
  return ORDENS.map((ordem, i) => ({
    ordem,
    amp: (pesos[i] / soma) * total,
    fase: rng() * DOIS_PI,
    vel: periodoParaVel(periodoMin + rng() * (periodoMax - periodoMin)) * (rng() < 0.5 ? -1 : 1),
  }));
}

export function gerarCelulas(opcoes: {
  largura: number;
  altura: number;
  semente: number;
}): Celula[] {
  const { largura, altura, semente } = opcoes;
  const rng = criarGerador(semente);
  const area = largura * altura;
  const quantidade = Math.max(8, Math.min(20, Math.round(6 + (11 * area) / 1_024_000)));
  const escala = Math.max(0.7, Math.min(1, Math.min(largura, altura) / 700));
  const celulas: Celula[] = [];

  for (let i = 0; i < quantidade; i++) {
    const raio = (40 + 100 * Math.pow(rng(), 1.6)) * escala;
    const sorteioCor = rng();
    const cor: CorCelula = sorteioCor < 0.2 ? 1 : sorteioCor < 0.4 ? 2 : 0;
    const raioNucleo = raio * (0.25 + rng() * 0.1);
    celulas.push({
      x: (-0.05 + rng() * 1.1) * largura,
      y: (-0.05 + rng() * 1.1) * altura,
      raio,
      ampX: 20 + rng() * 40,
      ampY: 20 + rng() * 40,
      velX: periodoParaVel(30_000 + rng() * 60_000),
      velY: periodoParaVel(30_000 + rng() * 60_000),
      faseX: rng() * DOIS_PI,
      faseY: rng() * DOIS_PI,
      rot0: rng() * DOIS_PI,
      velRot: periodoParaVel(120_000 + rng() * 180_000) * (rng() < 0.5 ? -1 : 1),
      membrana: criarHarmonicos(rng, AMPLITUDE_MEMBRANA, 14_000, 40_000),
      nucleo: {
        raio: raioNucleo,
        harmonicos: criarHarmonicos(rng, AMPLITUDE_NUCLEO, 12_000, 30_000),
        desloc: raio * 0.2,
        velX: periodoParaVel(25_000 + rng() * 35_000),
        velY: periodoParaVel(25_000 + rng() * 35_000),
        faseX: rng() * DOIS_PI,
        faseY: rng() * DOIS_PI,
      },
      cor,
    });
  }
  return celulas;
}

function somaHarmonicos(hs: Harmonico[], angulo: number, t: number): number {
  let s = 0;
  for (const h of hs) s += h.amp * Math.sin(h.ordem * angulo + h.fase + h.vel * t);
  return s;
}

/** Raio da membrana no ângulo dado (a forma já inclui a rotação lenta). */
export function raioMembrana(celula: Celula, angulo: number, t: number): number {
  const local = angulo - (celula.rot0 + celula.velRot * t);
  return celula.raio * (1 + somaHarmonicos(celula.membrana, local, t));
}

export function posicaoCelula(celula: Celula, t: number): { x: number; y: number } {
  return {
    x: celula.x + celula.ampX * Math.sin(celula.velX * t + celula.faseX),
    y: celula.y + celula.ampY * Math.sin(celula.velY * t + celula.faseY),
  };
}

/** Pontos (x, y intercalados) da membrana em coordenadas de tela. Reaproveita `saida`. */
export function pontosMembrana(
  celula: Celula,
  t: number,
  n: number,
  saida: Float64Array = new Float64Array(2 * n),
): Float64Array {
  const { x, y } = posicaoCelula(celula, t);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * DOIS_PI;
    const r = raioMembrana(celula, a, t);
    saida[2 * i] = x + r * Math.cos(a);
    saida[2 * i + 1] = y + r * Math.sin(a);
  }
  return saida;
}

/** Pontos do núcleo, deslocado do centro e oscilando dentro da célula. */
export function pontosNucleo(
  celula: Celula,
  t: number,
  n: number,
  saida: Float64Array = new Float64Array(2 * n),
): Float64Array {
  const { x, y } = posicaoCelula(celula, t);
  const nu = celula.nucleo;
  const cx = x + nu.desloc * Math.cos(nu.velX * t + nu.faseX);
  const cy = y + nu.desloc * Math.sin(nu.velY * t + nu.faseY);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * DOIS_PI;
    const r = nu.raio * (1 + somaHarmonicos(nu.harmonicos, a, t));
    saida[2 * i] = cx + r * Math.cos(a);
    saida[2 * i + 1] = cy + r * Math.sin(a);
  }
  return saida;
}

/**
 * Distância com sinal de um ponto a um retângulo de cantos arredondados:
 * negativa/zero dentro, crescente fora.
 */
export function distanciaRetanguloArredondado(x: number, y: number, ret: Retangulo): number {
  const r = Math.min(ret.raio, ret.largura / 2, ret.altura / 2);
  const qx = Math.abs(x - (ret.x + ret.largura / 2)) - (ret.largura / 2 - r);
  const qy = Math.abs(y - (ret.y + ret.altura / 2)) - (ret.altura / 2 - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/**
 * Multiplicador de alfa ao redor do bloco de login: `minimo` até a margem e sobe
 * suavemente até 1 em `margem + queda` px de distância.
 */
export function fatorAlfaRespiro(
  distancia: number,
  margem = 40,
  queda = 160,
  minimo = 0.4,
): number {
  const d = Math.min(1, Math.max(0, (distancia - margem) / queda));
  return minimo + (1 - minimo) * d * d * (3 - 2 * d);
}
