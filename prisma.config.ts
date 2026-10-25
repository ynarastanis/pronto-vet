import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Local: lê .env.local (padrão do Next) e depois .env. Na Vercel as variáveis já vêm do ambiente.
config({ path: ".env.local", quiet: true });
config({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --conditions=react-server prisma/seed.ts",
  },
  datasource: {
    // Conexão direta (sem pooler), exigida pelas migrations — ADR-014.
    url: process.env.DATABASE_URL_UNPOOLED ?? "",
  },
});
