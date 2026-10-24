import "server-only";
import { escolherFonte } from "./fonte";
import { servicosMemoria } from "./memoria";
import { servicosPrisma } from "./prisma";
import type { Servicos } from "./tipos";

export function servicos(): Servicos {
  if (escolherFonte(process.env.FONTE_DADOS) === "memoria") {
    return servicosMemoria();
  }
  return servicosPrisma();
}
