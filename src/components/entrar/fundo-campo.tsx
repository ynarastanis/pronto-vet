"use client";

import { useEffect, useRef } from "react";
import { alfaLinha, deslocamentoLinha } from "@/lib/animacao/campo";

const ESPACAMENTO = 26;
const PASSO_X = 10;
const T_ESTATICO_MS = 1500;
/** Índice (a partir do centro) das linhas de destaque: terracota acima, violeta abaixo. */
const INDICE_DESTAQUE = 2;

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

export function FundoCampo() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const movimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    let largura = 0;
    let altura = 0;
    let dpr = 1;
    let cores: { base: Rgb; cirurgico: Rgb; anestesico: Rgb } = {
      base: [0, 0, 0],
      cirurgico: [0, 0, 0],
      anestesico: [0, 0, 0],
    };
    let quadro = 0;
    let inicio = 0;
    const rgba = ([r, g, b]: Rgb, a: number) =>
      `rgba(${r},${g},${b},${a.toFixed(3)})`;

    function lerCores() {
      if (!ctx) return;
      cores = {
        base: lerCor(ctx, null),
        cirurgico: lerCor(ctx, "tema-cirurgico"),
        anestesico: lerCor(ctx, "tema-anestesico"),
      };
    }

    function medir() {
      if (!canvas || !ctx) return;
      largura = window.innerWidth;
      altura = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
    }

    function desenhar(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, largura, altura);
      const centro = { x: largura / 2, y: altura / 2 };
      const raios = {
        x: Math.min(384, largura - 32) / 2 + 28,
        y: Math.min(190, altura * 0.3),
      };
      const metade = Math.ceil(altura / 2 / ESPACAMENTO) + 1;
      const colunas = Math.ceil(largura / PASSO_X) + 1;

      for (let lado = -1; lado <= 1; lado += 2) {
        for (let i = 0; i < metade; i++) {
          const yBase = centro.y + lado * (i + 0.5) * ESPACAMENTO;
          const destaque = i === INDICE_DESTAQUE;
          const cor = destaque
            ? lado < 0
              ? cores.cirurgico
              : cores.anestesico
            : cores.base;
          // Um único traço por linha; o degradê horizontal dá o esmaecimento (maior perto do centro).
          const grad = ctx.createLinearGradient(0, 0, largura, 0);
          for (let g = 0; g <= 4; g++) {
            const gx = (g / 4) * largura;
            const a = destaque
              ? 0.45 *
                (alfaLinha({ x: gx, y: yBase, centro, largura, altura }) / 0.28)
              : alfaLinha({ x: gx, y: yBase, centro, largura, altura });
            grad.addColorStop(
              g / 4,
              rgba(cor, Math.min(a, destaque ? 0.45 : 0.28)),
            );
          }
          ctx.strokeStyle = grad;
          ctx.beginPath();
          let px = 0;
          let py = 0;
          for (let c = 0; c < colunas; c++) {
            const x = Math.min(c * PASSO_X, largura);
            const y =
              yBase +
              deslocamentoLinha({ x, yBase, t, centro, raios, largura });
            if (c === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
            }
            px = x;
            py = y;
          }
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }
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
      medir();
      if (movimento.matches) desenhar(T_ESTATICO_MS);
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
    window.addEventListener("resize", aoRedimensionar);
    document.addEventListener("visibilitychange", aoVisibilidade);
    movimento.addEventListener("change", aoMudarMovimento);

    return () => {
      parar();
      observador.disconnect();
      window.removeEventListener("resize", aoRedimensionar);
      document.removeEventListener("visibilitychange", aoVisibilidade);
      movimento.removeEventListener("change", aoMudarMovimento);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fundo-campo pointer-events-none fixed inset-0 z-0 size-full"
    />
  );
}
