import { Router } from "express";
import challengeRouter from './challenge.router.js';

const router = Router();

router.use("/", challengeRouter);

export default router;