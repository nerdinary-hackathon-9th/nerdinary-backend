import { prisma } from '../configs/db.config.js';

class SnapRepository {
  async findChallengeById(challengeId) {
    return await prisma.challenge.findUnique({ where: { id: challengeId } });
  }

  async findUserById(userId) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  async findParticipation(challengeId, userId) {
    return await prisma.challengeParticipant.findFirst({
        where: { challengeId, userId }
    });
  }

  async createSnap(snapData) {
    return await prisma.challengeParticipant.create({
        data: snapData
    });
  }

  async findSnapById(snapId) {
    return await prisma.challengeParticipant.findUnique({
        where: { id: snapId },
        include: {
            user: { select: { id: true, nickname: true } },
            challenge: { select: { id: true, title: true } }
        }
    });
  }

  async findSnapsByChallenge(challengeId) {
    return await prisma.challengeParticipant.findMany({
        where: { challengeId },
        orderBy: { createdAt: "desc" },
        select: { imageUrl: true }
    });
  }

  async findSnapsByUser(userId) {
    return await prisma.challengeParticipant.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });
  }

  async deleteSnap(snapId) {
    return await prisma.challengeParticipant.delete({ where: { id: snapId } });
  }

  async findSnapsBySnap(snapId) {
    return await prisma.challengeParticipant.findFirst({
        where: { id: snapId },
        orderBy: { createdAt: "desc" }
    }); 
  }
}

export default new SnapRepository();