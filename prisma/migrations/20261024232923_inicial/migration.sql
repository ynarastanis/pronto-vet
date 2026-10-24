-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('CIRURGIAO', 'ANESTESISTA');

-- CreateTable
CREATE TABLE "Profissional" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "papel" "Papel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedimentoCirurgico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricaoTecnica" TEXT NOT NULL,
    "prescricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedimentoCirurgico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescricaoAnestesica" (
    "id" TEXT NOT NULL,
    "procedimentoId" TEXT NOT NULL,
    "asa" TEXT NOT NULL,
    "mpa" TEXT,
    "inducao" TEXT,
    "manutencao" TEXT,
    "bloqueioLocal" TEXT,
    "analgesiaTrans" TEXT,
    "antibioticoPre" TEXT,
    "posImediato" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DescricaoAnestesica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcedimentoCirurgico_nome_key" ON "ProcedimentoCirurgico"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "DescricaoAnestesica_procedimentoId_key" ON "DescricaoAnestesica"("procedimentoId");

-- AddForeignKey
ALTER TABLE "DescricaoAnestesica" ADD CONSTRAINT "DescricaoAnestesica_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "ProcedimentoCirurgico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
