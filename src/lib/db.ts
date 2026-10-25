import "server-only";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const globalComPrisma = globalThis as typeof globalThis & { __prontoVetPrisma?: PrismaClient };

function criarClient(): PrismaClient {
  // Driver HTTP do Neon (ADR-017): sem conexão persistente, ideal para funções serverless.
  // Não suporta transação interativa; os serviços só usam operações de uma instrução.
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL as string, {});
  return new PrismaClient({ adapter });
}

/** Único PrismaClient do app (singleton em globalThis para sobreviver ao hot reload do dev). */
export const db: PrismaClient = (globalComPrisma.__prontoVetPrisma ??= criarClient());
