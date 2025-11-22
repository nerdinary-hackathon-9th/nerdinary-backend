const { PrismaClient} = require('@prisma/client');

let prisma;

// 개발 환경 핫리로드 대비
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.__prisma) {
        global.__prisma = new PrismaClient();
    }
    prisma = global.__prisma;
}

module.exports = prisma;

//const prisma = require('../lib/prisma');로 사용하세요