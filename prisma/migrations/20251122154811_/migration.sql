/*
  Warnings:

  - The primary key for the `challenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `challenge` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `challenge_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `challenge_participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `challenge_participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `challengeId` on the `challenge_participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Made the column `title` on table `challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `context` on table `challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endAt` on table `challenge` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `challenge_participant` DROP FOREIGN KEY `challenge_participant_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `challenge_participant` DROP FOREIGN KEY `challenge_participant_userId_fkey`;

-- AlterTable
ALTER TABLE `challenge` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `context` VARCHAR(191) NOT NULL,
    MODIFY `endAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `challenge_participant` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `challengeId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `challenge_participant` ADD CONSTRAINT `challenge_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenge_participant` ADD CONSTRAINT `challenge_participant_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `challenge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
