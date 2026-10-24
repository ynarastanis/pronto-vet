import { normalizarTexto } from "./normalizar";
import type { EntradaGeracao } from "./tipos";

function nomeOuTraco(nome: string | null): string {
  return normalizarTexto(nome) || "--";
}

function formatarPeso(peso: string): string {
  const valor = normalizarTexto(peso).replace(/\s*kg$/i, "").trim();
  return valor || "--";
}

export function gerarTextoAnestesico(entrada: EntradaGeracao): string {
  const { procedimento, cirurgiao, anestesista, peso } = entrada;
  const d = procedimento.descricaoAnestesica;

  const linhas = [
    `CIRURGIÃO: ${nomeOuTraco(cirurgiao)}`,
    `ANESTESISTA: ${nomeOuTraco(anestesista)}`,
    `Peso do paciente: ${formatarPeso(peso)} kg`,
    `ASA: ${normalizarTexto(d.asa)}`,
    `Procedimento: ${normalizarTexto(procedimento.nome)}`,
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
    if (texto) linhas.push(rotulo + texto);
  }

  return linhas.join("\n");
}
