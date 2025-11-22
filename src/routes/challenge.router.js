import express from 'express';
import {
  getChallenges,
  getChallengeList,
  getChallengeById,
  createChallenge,
  deleteChallenge,
  getChallengeParticipants,
} from '../controllers/challenge.controller.js';

const router = express.Router();

// 기본 리스트
router.get('/challenge', getChallenges);

// 옵션 리스트
router.get('/challenge/list', getChallengeList);

// 생성
router.post('/challenge/create', createChallenge);

// 참가자 목록
router.get('/challenge/:challengeId/participants', getChallengeParticipants);

// 단건 조회 / 삭제
router.get('/challenge/:challengeId', getChallengeById);
router.delete('/challenge/:challengeId', deleteChallenge);

export default router;
