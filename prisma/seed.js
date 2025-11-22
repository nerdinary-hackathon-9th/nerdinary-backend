import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ 유저 120명 생성
  const users = [];
  for (let i = 1; i <= 120; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        nickname: `user${i}`,
        password: hashedPassword,
      },
    });
    users.push(user);
  }

  // 2️⃣ 챌린지 10개 생성
  const challenges = [];
  for (let i = 1; i <= 10; i++) {
    const isBigChallenge = i <= 6; // 6개는 100명 이상
    const challenge = await prisma.challenge.create({
      data: {
        title: `챌린지 ${i}`,
        context: `챌린지 ${i} 설명`,
        createdAt: new Date(),
        endAt: isBigChallenge
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일 후
          : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 일반 챌린지
        thumbnailUrl: `https://picsum.photos/seed/challenge${i}/200/200`,
      },
    });
    challenges.push(challenge);

    // 3️⃣ 참여자 추가
    let participantCount = isBigChallenge ? 100 : Math.floor(Math.random() * 50) + 1;

    const shuffledUsers = users.sort(() => 0.5 - Math.random()).slice(0, participantCount);

    for (const user of shuffledUsers) {
      await prisma.challengeParticipant.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
        },
      });
    }
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });