// Campo fenestrado que respira: funções puras e determinísticas do fundo da tela de login.
// O tempo `t` (ms) é sempre recebido como parâmetro.

export const PERIODO_RESPIRACAO_MS = 6000;
export const PERIODO_ONDA_MS = 25000;
export const AMPLITUDE_RESPIRACAO = 0.07;
export const AMPLITUDE_ONDA_PX = 6;
/** Comprimento de onda da ondulação, em larguras de tela. */
export const COMPRIMENTO_ONDA = 1.25;

export type Ponto = { x: number; y: number };
export type Raios = { x: number; y: number };

const DOIS_PI = Math.PI * 2;

function suavizar(a: number, b: number, v: number): number {
  const k = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return k * k * (3 - 2 * k);
}

/** Fator de escala da abertura: 1 ± 7% no ciclo de respiração (~10 por minuto). */
export function fatorRespiracao(t: number): number {
  return 1 + AMPLITUDE_RESPIRACAO * Math.sin((DOIS_PI * t) / PERIODO_RESPIRACAO_MS);
}

type EntradaFenestra = { x: number; yBase: number; centro: Ponto; raios: Raios };

/**
 * Deslocamento vertical que afasta a linha da abertura elíptica (raios já escalados).
 * O empurrão é a meia-altura da elipse na coluna x, com falloff gaussiano na distância
 * vertical da linha ao centro: preserva a ordem das linhas e as tira de dentro da elipse.
 */
export function afastamentoFenestra({ x, yBase, centro, raios }: EntradaFenestra): number {
  const u = (x - centro.x) / raios.x;
  if (Math.abs(u) >= 1) return 0;
  const meiaAltura = raios.y * (1 - u * u);
  const dy = yBase - centro.y;
  const escala = raios.y;
  const falloff = Math.exp(-((dy / escala) ** 2));
  return (dy < 0 ? -1 : 1) * meiaAltura * falloff;
}

type EntradaOnda = EntradaFenestra & { t: number; largura: number };

/** Ondulação longa e lenta na horizontal, atenuada perto da abertura. */
export function ondulacao({ x, yBase, t, centro, raios, largura }: EntradaOnda): number {
  const lambda = COMPRIMENTO_ONDA * largura;
  const fase = DOIS_PI * (x / lambda - t / PERIODO_ONDA_MS);
  const d = Math.hypot((x - centro.x) / raios.x, (yBase - centro.y) / raios.y);
  return AMPLITUDE_ONDA_PX * Math.sin(fase) * suavizar(1, 2.4, d);
}

type EntradaLinha = {
  x: number;
  yBase: number;
  t: number;
  centro: Ponto;
  /** Raios base da abertura (sem respiração). */
  raios: Raios;
  largura: number;
};

/** Deslocamento vertical total de um ponto da linha no instante t. */
export function deslocamentoLinha({ x, yBase, t, centro, raios, largura }: EntradaLinha): number {
  const f = fatorRespiracao(t);
  const r = { x: raios.x * f, y: raios.y * f };
  return afastamentoFenestra({ x, yBase, centro, raios: r }) + ondulacao({ x, yBase, t, centro, raios: r, largura });
}

/** Opacidade (0,10–0,28) da linha: mais visível perto da abertura, esmaece para as bordas. */
export function alfaLinha({
  x,
  y,
  centro,
  largura,
  altura,
}: {
  x: number;
  y: number;
  centro: Ponto;
  largura: number;
  altura: number;
}): number {
  const alcance = Math.hypot(largura / 2, altura / 2);
  const d = Math.min(1, Math.hypot(x - centro.x, y - centro.y) / alcance);
  return 0.1 + 0.18 * (1 - suavizar(0, 1, d));
}
