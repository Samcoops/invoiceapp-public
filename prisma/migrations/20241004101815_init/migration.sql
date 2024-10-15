-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_userId_fkey";

-- DropForeignKey
ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_userId_fkey";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "userId" SET DATA TYPE TEXT;
