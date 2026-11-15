import express from "express";
import SnapController from '../controllers/snap.controller.js';
import { upload } from '../configs/multer.config.js';

const router = express.Router();

// 특정 인증샷 조회
router.get("/:snap_id", SnapController.getSnapBySnapId);

const uploadReviewImages = upload.array("images");

// 인증샷 생성
router.post("/:challenge_id/:user_id", uploadReviewImages, SnapController.createSnap);

// 인증샷 수정
router.put("/:snap_id/:user_id", uploadReviewImages, SnapController.updateSnap);

// 특정 인증샷 삭제
router.delete("/:snap_id/:user_id", SnapController.deleteSnap);

// 특정 챌린지 모든 인증샷 조회
router.get("/challenge/:challenge_id", SnapController.getSnapsByChallenge);

// 특정 유저 인증샷 조회
router.get("/user/:user_id", SnapController.getSnapByUserId);

export default router;