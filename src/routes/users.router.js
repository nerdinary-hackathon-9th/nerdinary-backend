import { Router } from "express";
import { handleCheckNickname, handleJoinChallenge, handleGetMyChallenges } from "../controllers/user.controller.js";

const router = Router();

router.get("/:nickname", handleCheckNickname);
router.post("/challenge", handleJoinChallenge);
router.get("/:userId/participate",handleGetMyChallenges);

export default router;