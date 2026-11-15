-- AlterTable
ALTER TABLE "challenge" ADD COLUMN     "creatorId" INTEGER;

-- AddForeignKey
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
