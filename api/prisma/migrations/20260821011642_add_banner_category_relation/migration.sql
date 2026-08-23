-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "categoryId" TEXT;

-- CreateIndex
CREATE INDEX "banners_categoryId_idx" ON "banners"("categoryId");

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
