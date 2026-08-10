-- CreateEnum
CREATE TYPE "StitchType" AS ENUM ('STITCHED', 'UNSTITCHED');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "color" TEXT,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "secondaryImageUrl" TEXT,
ADD COLUMN     "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stitchType" "StitchType";
