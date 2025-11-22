import { Router } from "express";
import {
  getChallenges,
  getChallengeList,
  getChallengeById,
  createChallenge,
  deleteChallenge,
  getChallengeParticipants,
} from '../controllers/challenge.controller.js';

const router = Router();

// 기본 리스트
router.get('/', getChallenges);

// 옵션 리스트
router.get('/list', getChallengeList);

// 생성
router.post('/create', createChallenge);

// 참가자 목록
router.get('/:challengeId/participants', getChallengeParticipants);

// 단건 조회 / 삭제
router.get('/:challengeId', getChallengeById);
router.delete('/:challengeId', deleteChallenge);

export default router;
