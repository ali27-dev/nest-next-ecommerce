-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SUMMER', 'WINTER', 'ALL_SEASON');

-- CreateEnum
CREATE TYPE "PieceCount" AS ENUM ('ONE_PIECE', 'TWO_PIECE', 'THREE_PIECE');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "fabricId" TEXT,
ADD COLUMN     "pieceCount" "PieceCount",
ADD COLUMN     "season" "Season";

-- CreateTable
CREATE TABLE "fabrics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fabrics_slug_key" ON "fabrics"("slug");

-- CreateIndex
CREATE INDEX "fabrics_slug_idx" ON "fabrics"("slug");

-- CreateIndex
CREATE INDEX "products_fabricId_idx" ON "products"("fabricId");

-- CreateIndex
CREATE INDEX "products_season_idx" ON "products"("season");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fabricId_fkey" FOREIGN KEY ("fabricId") REFERENCES "fabrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
