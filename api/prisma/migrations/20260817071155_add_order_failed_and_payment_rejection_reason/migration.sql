-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "rejectionReason" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'pkr';
