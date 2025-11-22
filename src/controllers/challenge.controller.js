import {
  BadRequestError,
  NotFoundError,
} from '../errors.js';

import {
  findAllChallenges,
  findChallengeListWithOptions,
  findChallengeById,
  createChallenge as createChallengeRepo,
  deleteChallenge as deleteChallengeRepo,
  findParticipantsByChallengeId,
} from '../repositories/challenge.repository.js';

import { successHandler } from '../middleware/responseHandler.js';

// GET /challenge  - 기본 챌린지 리스트
export async function getChallenges(req, res, next) {
  try {
    const challenges = await findAllChallenges();
    return successHandler(res, '챌린지 리스트 조회 성공', challenges);
  } catch (err) {
    return next(err);
  }
}

// GET /challenge/list?popular=true&latest=new
export async function getChallengeList(req, res, next) {
  try {
    const { popular, latest } = req.query;  // popular: 'true' | 'false' | undefined
    const challenges = await findChallengeListWithOptions({ popular, latest });
    return successHandler(res, '챌린지 리스트 정렬 성공', challenges);
  } catch (err) {
    return next(err);
  }
}

// GET /challenge/:challengeId
export async function getChallengeById(req, res, next) {
  try {
    const  challengeId  = Number(req.params.challengeId);

    const challenge = await findChallengeById(challengeId);

    if (!challenge) {
      throw new NotFoundError('챌린지를 찾을 수 없습니다.');
    }

    const { _count, ...challengeData } = challenge;

    return successHandler(res, '챌린지 조회 성공', {
      ...challengeData,
      participantsCount: _count?.participants ?? 0,
    });
  } catch (err) {
    return next(err);
  }
}

// POST /challenge/create
export async function createChallenge(req, res, next) {
  try {
    const { title, context, endAt, thumbnailUrl } = req.body;

    if (!title || typeof title !== 'string') {
      throw new BadRequestError('title은 필수입니다.');
    }

    const created = await createChallengeRepo({
      title,
      context,
      endAt,
      thumbnailUrl,
    });

    return successHandler(res, '챌린지 생성 성공', created);
  } catch (err) {
    return next(err);
  }
}

// GET /challenge/:challengeId/participants
export async function getChallengeParticipants(req, res, next) {
  try {
    console.log(req.params);
    const  challengeId  = Number(req.params.challengeId);
    console.log("controller: ",challengeId);

    const participants = await findParticipantsByChallengeId(challengeId);

    return successHandler(res, '챌린지 참가자 목록 조회 성공', participants);
  } catch (err) {
    return next(err);
  }
}
