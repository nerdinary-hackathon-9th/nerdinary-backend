import { prisma } from '../configs/db.config.js';

class SnapRepository {
  async findChallengeById(challengeId) {
    return await prisma.challenge.findFirst({ where: { id: challengeId } });
  }

  async findUserById(userId) {
    return await prisma.user.findFirst({ where: { id: userId } });
  }

  async findParticipation(challengeId, userId) {
    return await prisma.challengeParticipant.findFirst({
        where: { challengeId, userId }
    });
  }

  async createSnap(snapData) {
    return await prisma.snap.create({
        data: snapData
    });
  }

  async findSnapById(snapId) {
    return await prisma.snap.findFirst({
        where: { id: snapId },
        include: {
            user: { select: { id: true, nickname: true } },
            challenge: { select: { id: true, title: true } }
        }
    });
  }

  async findSnapsByChallenge(challengeId) {
    return await prisma.snap.findMany({
        where: { challengeId },
        select: {
            id: true,
            imageUrl: true,
        }
    });
  }

  async findSnapsByUser(userId) {
    return await prisma.snap.findMany({
        where: { userId },
    });
  }

  async deleteSnap(snapId) {
    return await prisma.snap({ where: { id: snapId } });
  }

  async findSnapsBySnap(snapId) {
    return await prisma.snap.findFirst({
        where: { id: snapId },
        include: {
            user: {
              select: { nickname: true }
            }
        }
    }); 
  }
}

export default new SnapRepository();