import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const globalComPrisma = globalThis as typeof globalThis & { __prontoVetPrisma?: PrismaClient };

function criarClient(): PrismaClient {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

/** Único PrismaClient do app (singleton em globalThis para sobreviver ao hot reload do dev). */
export const db: PrismaClient = (globalComPrisma.__prontoVetPrisma ??= criarClient());
