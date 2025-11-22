import { prisma } from "../configs/db.config.js";

export const createUser = async (data) => {
    console.log("repository:", data);
    const user = await prisma.user.create({
        data: {
           nickname : data.nickname,
           password : data.password,
        },
    });
    return user.id;
};

export const getUser = async (nickname)=> {
    const user = await prisma.user.findUnique({
        where: { nickname: nickname },
    })
    return user;
}

export const getUserById = async (userId)=> {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    })
    return user;
}

export const getPassword = async (nickname) => {
    const user = await prisma.user.findFirst({
        where: { nickname: nickname }
    })
    return user.password;
}

// 챌린지 참가
export const getChallenge = async(challengeId) => {
    const challenge = await prisma.challenge.findFirst({
        where: { id: challengeId},
    })
    return challenge;
}

export const createUserChallenge = async(userId, challengeId) => {
    const userChallenge = await prisma.challengeParticipant.create({
        data: {
            user: {
                connect: { id: userId }
            },
            challenge: {
                connect: { id: challengeId }
            },
        },
    });
    return userChallenge;
}

export const isAlreadyJoin = async (userId, challengeId) => {
    const existingParticipant = await prisma.challengeParticipant.findFirst({
        where: {
            userId: userId,
            challengeId: challengeId
        }
    });
    return existingParticipant;
}


// 특정 사용자 챌린지 조회
export const getMyChallenges = async (userId) => {
    const myChallenges = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            participants: {
            select: {
                challenge: {
                select: {
                    id: true,
                    title: true,
                    context: true,
                    createdAt: true,
                    endAt: true,
                    thumbnailUrl: true,
                    _count: {
                    select: { participants: true } // 참여자 수
                    },
                },
                },
            },
            },
        },
    });
    return myChallenges
}