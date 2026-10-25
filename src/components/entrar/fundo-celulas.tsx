"use client";

import { useEffect, useRef } from "react";
import {
  type Celula,
  type Retangulo,
  distanciaRetanguloArredondado,
  fatorAlfaRespiro,
  gerarCelulas,
  pontosMembrana,
  pontosNucleo,
  posicaoCelula,
} from "@/lib/animacao/celulas";

const SEMENTE = 20261024;
const PONTOS_MEMBRANA = 56;
const PONTOS_NUCLEO = 32;
const T_ESTATICO_MS = 20_000;
const ALFA_PREENCHIMENTO = 0.06;
const ALFA_TRACO = 0.26;
const ALFA_NUCLEO = 0.13;
const SELETOR_ALVO = "[data-respiro-fundo]";

type Rgb = [number, number, number];

function lerCor(ctx: CanvasRenderingContext2D, classe: string | null): Rgb {
  const el = document.createElement("div");
  if (classe) el.className = classe;
  el.setAttribute("aria-hidden", "true");
  el.style.display = "none";
  document.body.appendChild(el);
  const valor = getComputedStyle(el).getPropertyValue("--primary").trim();
  el.remove();
  ctx.fillStyle = "#000";
  ctx.fillStyle = valor || "#000";
  const s = ctx.fillStyle;
  if (s.startsWith("#") && s.length === 7) {
    return [
      parseInt(s.slice(1, 3), 16),
      parseInt(s.slice(3, 5), 16),
      parseInt(s.slice(5, 7), 16),
    ];
  }
  const m = s.match(/\d+(\.\d+)?/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [0, 0, 0];
}

/** Traça uma curva fechada suave por pontos intercalados (x, y), usando pontos médios. */
function tracarSuave(ctx: CanvasRenderingContext2D, pts: Float64Array, n: number) {
  ctx.beginPath();
  ctx.moveTo((pts[2 * n - 2] + pts[0]) / 2, (pts[2 * n - 1] + pts[1]) / 2);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    ctx.quadraticCurveTo(
      pts[2 * i],
      pts[2 * i + 1],
      (pts[2 * i] + pts[2 * j]) / 2,
      (pts[2 * i + 1] + pts[2 * j + 1]) / 2,
    );
  }
  ctx.closePath();
}

export function FundoCelulas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const movimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const membrana = new Float64Array(2 * PONTOS_MEMBRANA);
    const nucleo = new Float64Array(2 * PONTOS_NUCLEO);
    let celulas: Celula[] = [];
    let respiro: Retangulo | null = null;
    let largura = 0;
    let altura = 0;
    let cores: string[] = ["", "", ""];
    let quadro = 0;
    let inicio = 0;
    let temporizador = 0;

    function lerCores() {
      if (!ctx) return;
      cores = [lerCor(ctx, null), lerCor(ctx, "tema-cirurgico"), lerCor(ctx, "tema-anestesico")].map(
        ([r, g, b]) => `rgb(${r},${g},${b})`,
      );
    }

    function medirAlvo() {
      const alvo = document.querySelector(SELETOR_ALVO);
      if (!alvo) {
        respiro = null;
        return;
      }
      const r = alvo.getBoundingClientRect();
      respiro = { x: r.left, y: r.top, largura: r.width, altura: r.height, raio: 20 };
    }

    function medir() {
      if (!canvas || !ctx) return;
      largura = window.innerWidth;
      altura = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineJoin = "round";
      ctx.lineWidth = 1.15;
      celulas = gerarCelulas({ largura, altura, semente: SEMENTE });
      medirAlvo();
    }

    function desenhar(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, largura, altura);
      for (const c of celulas) {
        const p = posicaoCelula(c, t);
        const fator = respiro
          ? fatorAlfaRespiro(distanciaRetanguloArredondado(p.x, p.y, respiro) - c.raio * 0.6)
          : 1;
        const cor = cores[c.cor];
        ctx.fillStyle = cor;
        ctx.strokeStyle = cor;

        pontosMembrana(c, t, PONTOS_MEMBRANA, membrana);
        tracarSuave(ctx, membrana, PONTOS_MEMBRANA);
        ctx.globalAlpha = ALFA_PREENCHIMENTO * fator;
        ctx.fill();
        ctx.globalAlpha = ALFA_TRACO * fator;
        ctx.stroke();

        pontosNucleo(c, t, PONTOS_NUCLEO, nucleo);
        tracarSuave(ctx, nucleo, PONTOS_NUCLEO);
        ctx.globalAlpha = ALFA_NUCLEO * fator;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function parar() {
      if (quadro) cancelAnimationFrame(quadro);
      quadro = 0;
    }

    function passo(agora: number) {
      desenhar(agora - inicio);
      quadro = requestAnimationFrame(passo);
    }

    function iniciar() {
      parar();
      if (movimento.matches) {
        desenhar(T_ESTATICO_MS);
        return;
      }
      if (document.hidden) return;
      inicio = performance.now();
      quadro = requestAnimationFrame(passo);
    }

    medir();
    lerCores();
    iniciar();

    const aoRedimensionar = () => {
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(() => {
        medir();
        if (movimento.matches) desenhar(T_ESTATICO_MS);
      }, 150);
    };
    const aoVisibilidade = () => (document.hidden ? parar() : iniciar());
    const aoMudarMovimento = () => iniciar();
    const observador = new MutationObserver(() => {
      lerCores();
      if (movimento.matches) desenhar(T_ESTATICO_MS);
    });
    observador.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const alvo = document.querySelector(SELETOR_ALVO);
    const observadorAlvo = new ResizeObserver(() => {
      medirAlvo();
      if (movimento.matches) desenhar(T_ESTATICO_MS);
    });
    if (alvo) observadorAlvo.observe(alvo);
    window.addEventListener("resize", aoRedimensionar);
    document.addEventListener("visibilitychange", aoVisibilidade);
    movimento.addEventListener("change", aoMudarMovimento);

    return () => {
      parar();
      window.clearTimeout(temporizador);
      observador.disconnect();
      observadorAlvo.disconnect();
      window.removeEventListener("resize", aoRedimensionar);
      document.removeEventListener("visibilitychange", aoVisibilidade);
      movimento.removeEventListener("change", aoMudarMovimento);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fundo-celulas pointer-events-none fixed inset-0 z-0 size-full"
    />
  );
}
