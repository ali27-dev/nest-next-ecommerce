-- AlterTable
ALTER TABLE "categories" ADD COLUMN "tagline" TEXT;
ALTER TABLE "categories" ADD COLUMN "showOnHome" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "categories" ADD COLUMN "homeOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "categories_showOnHome_homeOrder_idx" ON "categories"("showOnHome", "homeOrder");
