import { normalizarTexto } from "./normalizar";
import type { EntradaGeracao } from "./tipos";

export type Destaque = "procedimento" | "cirurgiao" | "anestesista" | "peso";

/** Trecho do texto gerado; `destaque` marca o que vem das escolhas da tela. */
export type Segmento = {
  texto: string;
  destaque?: Destaque;
  ausente?: boolean;
};

function nomeOuTraco(nome: string | null): string {
  return normalizarTexto(nome) || "--";
}

function formatarPeso(peso: string): string {
  const valor = normalizarTexto(peso).replace(/\s*kg$/i, "").trim();
  return valor || "--";
}

function destacado(destaque: Destaque, texto: string): Segmento {
  return texto === "--"
    ? { texto, destaque, ausente: true }
    : { texto, destaque };
}

/** Descarta segmentos vazios e junta os vizinhos sem destaque. */
function compactar(segmentos: Segmento[]): Segmento[] {
  const saida: Segmento[] = [];
  for (const s of segmentos) {
    if (s.texto === "") continue;
    const ultimo = saida[saida.length - 1];
    if (ultimo && !ultimo.destaque && !s.destaque) {
      ultimo.texto += s.texto;
    } else {
      saida.push({ ...s });
    }
  }
  return saida;
}

export function segmentosCirurgico(entrada: EntradaGeracao): Segmento[] {
  const { procedimento, cirurgiao, anestesista } = entrada;
  return compactar([
    { texto: "PROCEDIMENTO CIRÚRGICO: " },
    destacado("procedimento", normalizarTexto(procedimento.nome)),
    { texto: "\n\nCIRURGIÃO: " },
    destacado("cirurgiao", nomeOuTraco(cirurgiao)),
    { texto: "\nANESTESISTA: " },
    destacado("anestesista", nomeOuTraco(anestesista)),
    {
      texto: `\n\n${normalizarTexto(procedimento.descricaoTecnica)}\n\n${normalizarTexto(procedimento.prescricao)}`,
    },
  ]);
}

export function segmentosAnestesico(entrada: EntradaGeracao): Segmento[] {
  const { procedimento, cirurgiao, anestesista, peso } = entrada;
  const d = procedimento.descricaoAnestesica;

  const segmentos: Segmento[] = [
    { texto: "CIRURGIÃO: " },
    destacado("cirurgiao", nomeOuTraco(cirurgiao)),
    { texto: "\nANESTESISTA: " },
    destacado("anestesista", nomeOuTraco(anestesista)),
    { texto: "\nPeso do paciente: " },
    destacado("peso", formatarPeso(peso)),
    { texto: ` kg\nASA: ${normalizarTexto(d.asa)}\nProcedimento: ` },
    destacado("procedimento", normalizarTexto(procedimento.nome)),
  ];

  const opcionais: Array<[string, string | null]> = [
    ["Medicação Pré Anestésica: ", d.mpa],
    ["INDUÇÃO: ", d.inducao],
    ["MANUTENÇÃO: ", d.manutencao],
    ["BLOQUEIO LOCAL: ", d.bloqueioLocal],
    ["ANALGESIA TRANS: ", d.analgesiaTrans],
    ["ANTIBIOTICO PRÉ: ", d.antibioticoPre],
    ["PÓS IMEDIATO: ", d.posImediato],
    ["", d.observacoes],
  ];
  for (const [rotulo, valor] of opcionais) {
    const texto = normalizarTexto(valor);
    if (texto) segmentos.push({ texto: `\n${rotulo}${texto}` });
  }

  return compactar(segmentos);
}

/**
 * Divide os segmentos por linha. A quebra "\n" fica no fim da própria linha,
 * então concatenar tudo devolve exatamente o texto original.
 */
export function dividirEmLinhas(segmentos: Segmento[]): Segmento[][] {
  const linhas: Segmento[][] = [[]];
  for (const s of segmentos) {
    const partes = s.texto.split("\n");
    partes.forEach((parte, i) => {
      const ultima = i === partes.length - 1;
      const texto = ultima ? parte : parte + "\n";
      if (texto !== "") linhas[linhas.length - 1].push({ ...s, texto });
      if (!ultima) linhas.push([]);
    });
  }
  return linhas;
}
