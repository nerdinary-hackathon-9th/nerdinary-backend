import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 기본 챌린지 리스트
export async function findAllChallenges() {
  return prisma.challenge.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// 옵션 리스트 (popular, latest)
export async function findChallengeListWithOptions({ popular, latest }) {
  const orderBy = [];

  if (popular === 'true' || popular === 'false') {
    const popularityOrder = popular === 'true' ? 'desc' : 'asc';
    
    orderBy.push({
      participants: {
        _count: popularityOrder,
      },
    });
  }

  if (latest === 'new') {
    orderBy.push({ createdAt: 'desc' });
  } else {
    orderBy.push({ createdAt: 'asc' });
  }

  return prisma.challenge.findMany({
    orderBy: orderBy.length > 0 ? orderBy : undefined,
    include: {
      _count: {
        select: { participants: true },
      },
    },
  });
}

// 단일 챌린지 조회
export async function findChallengeById(challengeId) {
  return prisma.challenge.findUnique({
    where: { id: challengeId },
  });
}
 
// 챌린지 생성
export async function createChallenge({ title, context, endAt, thumbnailUrl }) {
  return prisma.challenge.create({
    data: {
      title,
      context,
      endAt: endAt ? new Date(endAt) : null,
      thumbnailUrl: thumbnailUrl ?? null,
    },
  });
}

// 챌린지 삭제
export async function deleteChallenge(challengeId) {
  // 먼저 존재 여부 확인
  const existing = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!existing) return null;

  await prisma.challenge.delete({ where: { id } });
  return true;
}

// 참가자 목록 조회 (지금은 단순 findMany, 나중에 User join 가능)
export async function findParticipantsByChallengeId(challengeId) {
    console.log("repository: ",challengeId)
  return prisma.challengeParticipant.findMany({
    where: { challengeId: challengeId},
    include: {
      user: true,
    },
  });
}

export async function getHotChallenges() {
  const grouped = await prisma.challengeParticipant.groupBy({
    by: ['challengeId'],
    _count: { userId: true },
    having: { userId: { _count: { gte: 100 } } },
    orderBy: {
      _count: {
        userId: 'desc', // 참여자 많은 순
      }
    },
    take: 6 // 상위 6개만
  });

  const challengeIds = grouped.map(g => g.challengeId);

  const challenges = await prisma.challenge.findMany({
    where: { id: { in: challengeIds } },
    include: {
      _count: { select: { participants: true } },
    },
    orderBy: { id: 'asc' } 
  });

  return challenges;
}