import { Router } from "express";
import { handleCheckNickname, handleJoinChallenge, handleGetMyChallenges, handleGetCreatedChallenges, handleLeaveChallenge } from "../controllers/user.controller.js";

const router = Router();

router.get("/check", handleCheckNickname);
router.post("/challenge", handleJoinChallenge);
router.get("/:userId/participate", handleGetMyChallenges);
router.get("/:userId/created", handleGetCreatedChallenges);
router.delete("/:userId/challenge/:challengeId", handleLeaveChallenge);

export default router;