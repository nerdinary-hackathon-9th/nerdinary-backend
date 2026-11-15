import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const snapContents = [
  // 길거리 쓰레기 줍기
  [
    { content: '집 앞 골목에서 담배꽁초랑 과자봉지 10개 주웠어요. 장갑 끼고 나갔더니 생각보다 기분이 너무 좋음 ㅋㅋ' },
    { content: '공원 한 바퀴 돌면서 쓰레기 줍기 도전! 지나가던 아저씨가 엄지척 해주셔서 더 뿌듯했습니다' },
    { content: '오늘 퇴근길에 쓰레기 5개 줍기 성공. 작은 실천이 모이면 달라지겠죠?' },
    { content: '산책로 쓰레기 줍다가 동생이랑 같이 하게 됐어요. 의외로 재밌는 챌린지!' },
  ],
  // 5분 멍때리기
  [
    { content: '핸드폰 뒤집어 놓고 5분 버텼습니다... 솔직히 처음 1분은 너무 어색했는데 끝나고 나니까 머리가 맑아진 느낌' },
    { content: '카페에서 창밖 보면서 멍때리기. 옆 사람들 다 핸드폰 보는데 나 혼자 허공 봄 ㅎㅎ 근데 진짜 쉬는 느낌 들었어요' },
    { content: '점심 먹고 잠깐 옥상 올라가서 5분 멍때렸어요. 오후 업무 집중력이 달라진 것 같기도?' },
  ],
  // 즉흥 여행
  [
    { content: '버스 랜덤으로 타고 종점까지 갔다가 왔어요. 처음 와본 동네인데 골목 카페 발견해서 커피 한 잔 하고 왔습니다' },
    { content: '지도 앱 닫고 그냥 걷다가 처음 보는 재래시장 발견! 순대 먹고 왔어요 ㅋㅋ 이런 게 즉흥여행이죠' },
    { content: '친구한테 아무 역이나 말해달라 해서 거기 갔다 왔어요. 생각보다 너무 재밌었고 사진도 엄청 찍었습니다' },
    { content: '무작정 KTX 타고 부산 당일치기. 밥 먹고 바다 보고 바로 올라왔는데 이게 진짜 즉흥여행이더라고요' },
  ],
  // 모르는 사람한테 먼저 말 걸기
  [
    { content: '카페에서 옆에 앉은 분 노트북 뭐 쓰시는지 여쭤봤어요. 개발자분이셨는데 한 30분 얘기했습니다 ㅋㅋ' },
    { content: '편의점에서 계산하면서 알바생 분한테 오늘 힘드셨겠다고 한마디 했더니 완전 환하게 웃어주셨어요' },
    { content: '강아지 산책시키는 아주머니께 먼저 인사 드렸더니 강아지 이름이 뭔지 알려주시고 한참 얘기했어요. 어색함 0.5초면 됩니다' },
  ],
  // 새벽 4시에 일어나서 일출 보기
  [
    { content: '알람 4개 맞춰놓고 드디어 성공... 동네 뒷산 올라가서 일출 봤는데 진짜 눈물 날 뻔 했어요. 왜 이걸 이제 했나 싶음' },
    { content: '한강 나가서 일출 봤습니다. 새벽 공기 마시면서 커피 한 캔 따서 마셨는데 그 순간이 너무 좋았어요' },
    { content: '옥상 올라가서 혼자 일출 봄. 춥긴 한데 해 뜨는 순간만큼은 진짜 살아있다는 느낌' },
    { content: '3번 시도 만에 성공! 처음엔 알람 꺼버렸는데 이번엔 핸드폰 방 밖에 두고 잤어요 ㅋㅋ 해는 진짜 예뻤습니다' },
  ],
  // 24시간 스마트폰 없이 살아보기
  [
    { content: '어제 저녁 10시부터 오늘 저녁 10시까지 핸드폰 서랍에 넣어뒀습니다. 오전이 진짜 길더라고요. 책 두 권 읽었어요' },
    { content: '처음 2시간은 손이 계속 폰 찾았는데 점심 즈음부터 편안해짐. 저녁에 친구한테 전화 못 받았는데 그게 제일 미안했어요 ㅎ' },
    { content: '하루 동안 그림 그리고 산책하고 일기 썼어요. 심심함 속에서 할 게 이렇게 많았는지 몰랐습니다' },
  ],
  // 비 오는 날 우산 없이 걷기
  [
    { content: '오늘 소나기 맞고 왔어요 ㅋㅋㅋ 처음엔 눈치 엄청 봤는데 3분 지나니까 그냥 신나더라고요. 어릴 때 기억 소환됨' },
    { content: '집 앞 편의점까지만 가보려고 했는데 비 맞으면서 한 시간 걸었어요. 옷 다 젖었는데 기분은 최고' },
    { content: '빗소리 들으면서 걸으니까 이어폰 필요 없었어요. 비 맞는 게 이렇게 좋은 건지 몰랐습니다' },
  ],
  // 혼자 영화관 가기
  [
    { content: '드디어 혼영 입문했습니다. 민망할 줄 알았는데 입장하고 나면 아무도 신경 안 쓰더라고요. 팝콘도 내 마음대로 골랐어요' },
    { content: '주중 낮 영화 혼자 봤어요. 사람도 별로 없고 집중도 잘 되고 진짜 좋았습니다. 왜 이걸 이제 도전했나 싶음' },
    { content: '보고 싶었던 영화 혼자 보고 왔어요. 같이 볼 사람 눈치 안 봐도 되니까 더 좋더라고요 ㅋㅋ' },
    { content: '평점 낮은 영화 혼자 보러 갔다가 의외로 재밌어서 당황했습니다. 혼영의 또 다른 장점 발견!' },
  ],
  // 동네 아무 식당 들어가서 뭐든 시켜먹기
  [
    { content: '"아무거나 주세요" 했더니 사장님이 잠깐 당황하시다가 오늘의 메뉴 주셨어요. 된장찌개 + 계란말이였는데 맛있었습니다' },
    { content: '처음 가는 골목 식당 들어가서 뭐가 맛있냐고 여쭤봤어요. 사장님 추천 메뉴 먹었는데 대박이었어요' },
    { content: '간판도 제대로 안 보이는 작은 중국집 들어갔다가 짬뽕 완전 제대로 된 집 발견! 단골 생겼습니다 ㅋㅋ' },
  ],
  // 편지 써서 직접 전달하기
  [
    { content: '엄마한테 편지 써봤어요. 카톡으로 하기 뭐했던 말들 다 썼더니 A4 한 장 넘었고 드리면서 같이 울었습니다' },
    { content: '오래된 친구한테 손편지 써서 줬어요. 받고 나서 한참 읽더니 저 안아줬어요. 카톡으로는 못 했을 것 같아요' },
    { content: '후배한테 졸업 선물로 편지 써줬어요. 별거 아닌데 생각보다 시간이 오래 걸렸고, 그 시간 동안 그 애 생각 많이 했어요' },
    { content: '나한테 편지 써봤습니다. 1년 뒤 열어볼 거예요. 쓰면서 요즘 내가 너무 바빠서 나를 못 챙겼다는 걸 알게 됐어요' },
  ],
];

// 챌린지별 createdAt 오프셋 (일 단위, 음수=과거)
// NEW 배지: 오늘 생성 = 0, 그 외 과거 날짜
const createdAtOffsets = [0, 0, -1, -2, -3, -5, -7, -10, -14, -20];

const challenges = [
  {
    title: '길거리 쓰레기 줍기',
    context: '오늘 집 밖에 나가서 쓰레기 5개만 주워봐. 생각보다 기분이 이상하게 좋아짐. 장갑 없어도 돼, 용기만 있으면 됨.',
    days: 14,
  },
  {
    title: '5분 멍때리기',
    context: '핸드폰 뒤집어 놓고 그냥 5분만 멍때려봐. 아무것도 하지 말고 그냥 존재하기. 처음엔 어색한데 하다 보면 진짜 쉬는 느낌 남.',
    days: 7,
  },
  {
    title: '즉흥 여행',
    context: '지도 랜덤으로 찍어서 거기 가보기. 버스 타고 종점까지 가도 되고, 처음 보는 골목 들어가도 됨. 계획 없이 그냥 움직여봐.',
    days: 30,
  },
  {
    title: '모르는 사람한테 먼저 말 걸기',
    context: '카페에서 옆 사람한테 "뭐 마셔요?" 한 마디만. 어색하면 어색한 대로 괜찮아. 그 어색함이 포인트임.',
    days: 21,
  },
  {
    title: '새벽 4시에 일어나서 일출 보기',
    context: '알람 맞추고 진짜 나가봐. 가까운 공원이나 옥상도 됨. 새벽 공기 마시고 해 뜨는 거 보면 그날 하루가 달라짐.',
    days: 3,
  },
  {
    title: '24시간 스마트폰 없이 살아보기',
    context: '딱 하루만. 카카오톡도 인스타도 없이. 심심함을 버텨봐. 그 심심함 속에서 뭔가 하고 싶은 게 생길 수도 있음.',
    days: 1,
  },
  {
    title: '비 오는 날 우산 없이 걷기',
    context: '눈치 보지 말고 그냥 맞아봐. 옷 젖는 거 감수하고 빗소리 들으면서 걷기. 어릴 때 기억 소환됨 주의.',
    days: 7,
  },
  {
    title: '혼자 영화관 가기',
    context: '혼영 해본 적 없으면 꼭 해봐. 민망한 거 딱 30초고 그 이후엔 그냥 자유로움. 팝콘 내 마음대로 먹을 수 있음.',
    days: 14,
  },
  {
    title: '동네 아무 식당 들어가서 뭐든 시켜먹기',
    context: '메뉴판도 안 보고 사장님한테 "아무거나 주세요" 해보기. 뭐가 나올지 모르는 게 포인트. 의외로 맛있을 수 있음.',
    days: 10,
  },
  {
    title: '편지 써서 직접 전달하기',
    context: '카톡 말고 손으로 써서 직접 줘봐. 친구한테도 되고 부모님한테도 됨. 받는 사람도 주는 사람도 이상하게 울컥함.',
    days: 30,
  },
];

const nicknames = [
  '길고양이집사', '새벽세시', '무계획여행자', '감성충만', '오늘도걷는다',
  '빗속산책자', '멍때리기선수', '혼밥마스터', '일출수집가', '쓰레기줍는사람',
  '즉흥러버', '편지쟁이', '디지털디톡서', '팝콘혼자먹기', '골목탐험가',
  '새벽기상팀', '첫말걸기도전', '우산없는날', '랜덤식당투어', '소소한용기',
  '새벽달빛', '조용한발걸음', '바람따라가는사람', '혼자걷기좋아', '작은용기',
];

// 챌린지별 참여자 수 (10개 챌린지)
const targetCounts = [21, 10, 9, 5, 5, 5, 5, 5, 5, 5];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [];
  for (let i = 0; i < nicknames.length; i++) {
    const user = await prisma.user.create({
      data: {
        nickname: nicknames[i],
        password: hashedPassword,
      },
    });
    users.push(user);
  }

  for (let i = 0; i < challenges.length; i++) {
    const { title, context, days } = challenges[i];
    const offsetMs = (createdAtOffsets[i] ?? 0) * 24 * 60 * 60 * 1000;
    const createdAt = new Date(Date.now() + offsetMs);
    const challenge = await prisma.challenge.create({
      data: {
        title,
        context,
        createdAt,
        endAt: new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000),
        thumbnailUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
      },
    });

    const contents = snapContents[i] ?? [];
    const targetCount = targetCounts[i] ?? contents.length;
    const snapUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, targetCount);

    for (let j = 0; j < snapUsers.length; j++) {
      await prisma.challengeParticipant.create({
        data: { userId: snapUsers[j].id, challengeId: challenge.id },
      });
      await prisma.snap.create({
        data: {
          title: '인증샷',
          content: contents[j % contents.length].content,
          imageUrl: `https://picsum.photos/seed/${i * 20 + j + 100}/400/400`,
          userId: snapUsers[j].id,
          challengeId: challenge.id,
        },
      });
    }
  }

  console.log('시드 완료!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
