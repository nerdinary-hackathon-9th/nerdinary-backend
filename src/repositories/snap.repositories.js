import { prisma } from '../configs/db.config.js';

class SnapRepository {
  // 챌린지 아이디 존재 확인
  async findChallengeById(challengeId) {
    return await prisma.challenge.findFirst({ where: { id: challengeId } });
  }

  // 유저 아이디 존재 확인
  async findUserById(userId) {
    return await prisma.user.findFirst({ where: { id: userId } });
  }

  // 챌린지-유저 관계 찾기
  async findParticipation(challengeId, userId) {
    return await prisma.challengeParticipant.findFirst({
        where: { challengeId, userId }
    });
  }

  // 인증샷 생성
  async createSnap(snapData) {
    return await prisma.snap.create({
        data: snapData
    });
  }

  // 인증샷 아이디 존재 확인
  async findSnapById(snapId) {
    return await prisma.snap.findFirst({
        where: { id: snapId },
        include: {
            user: { select: { id: true, nickname: true } },
            challenge: { select: { id: true, title: true } }
        }
    });
  }

  // 챌린지 아이디로 인증샷 찾기
  async findSnapsByChallenge(challengeId) {
    return await prisma.snap.findMany({
        where: { challengeId },
        select: {
            id: true,
            imageUrl: true,
        }
    });
  }

  // 유저 아이디로 인증샷 찾기
  async findSnapsByUser(userId) {
    return await prisma.snap.findMany({
        where: { userId },
    });
  }

  // 인증샷 삭제
  async deleteSnap(snapId) {
    return await prisma.snap.delete({ where: { id: snapId } });
  }

  // 스냅샷 아이디로 찾기
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