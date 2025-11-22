import express from "express";
import SnapController from '../controllers/snap.controller.js';
import multer from "multer";

const router = express.Router();

// Multer 설정- 인증샷 이미지 업로드 미들웨어
const upload = multer({ storage: multer.memoryStorage() });
const uploadReviewImages = upload.array("images");

// 인증샷 생성
router.post("/:challenge_id/:user_id", uploadReviewImages, SnapController.createSnap);

// 특정 인증샷 삭제
router.delete("/:snap_id/:user_id", SnapController.deleteSnap);

// 특정 챌린지 모든 인증샷 조회
router.get("/challenge/:challenge_id", SnapController.getSnapsByChallenge);

// 특정 유저 인증샷 조회
router.get("/user/:user_id", SnapController.getSnapByUserId);

// 특정 인증샷 조회
router.get("/:snap_id", SnapController.getSnapBySnapId);

export default router;