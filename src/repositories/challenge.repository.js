const prisma = require('../lib/prisma');

function toBigInt(idStr) {
    try {
        return BigInt(idStr);
    } catch {
        return null;
    }
}

// 기본 챌린지 리스트 (정렬 X)
async function findAllChallenges() {
    return prisma.challenge.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

// 챌린지 리스트 (정렬 O)
async function findChallengeListWithOptions({ popular, latest }) {
    const orderBy = [];

    // 인기순 정렬
    if (popular === 'true') {
        orderBy.push({ participants: { _count: 'desc'} });
    }

    // 최신순 정렬
    if (latest == 'new') {
        orderBy.push({ createdAt: 'desc' });
    }

    if (orderBy.length === 0) {
        orderBy.push({ createdAt: 'desc' });
    }

    return prisma.challenge.findMany({
        orderBy,
        include: {
            _count: {
                select: { participants: true },
            },
        },
    });
}

// 특정 챌린지 조회
async function findChallengeById(challengeId) {
    const id = toBigInt(challengeId);
    if (id === null) return null;

    return prisma.challenge.findUnique({
        where: { id },
        include: {
            _count: { select: { participants: true }},
        },
    });
}

// 챌린지 생성
async function createChallenge({ title, context, endAt, thumnailUrl }) {
    const data = {
        title,
        context: context ?? null,
        thumnailUrl: thumnailUrl ?? null,
    };

    if (endAt) {
        const endAtDate = new Date(endAt);
        if (!Number.isNaN(endAtDate.getTime())) {
            data.endAt = endAtDate;
        }
    }

    return prisma.challenge.create({ data });
}

// 챌린지 삭제
async function deleteChallenge(challengeId) {
    const id = toBigInt(challengeId);
    if (id === null) return null;

    return prisma.challenge.delete({
        where: { id },
    });
}

// 특정 챌린지 참가자 목록
async function findParticipantsByChallengeId(challengeId) {
    const id = toBigInt(challengeId);
    if (id === null) return [];

    return prisma.challengeParticipant.findMany({
        where: { challengeId: id },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });
}

module.exports = {
    findAllChallenges,
    findChallengeListWithOptions,
    findChallengeById,
    createChallenge,
    deleteChallenge,
    findParticipantsByChallengeId,
}
