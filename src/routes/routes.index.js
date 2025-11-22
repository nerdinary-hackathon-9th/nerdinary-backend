import { Router } from "express";

import authRouter from "./auth.router.js";
import userRouter from "./users.router.js";
import challengeRouter from "./challenge.router.js";

const routers = Router();

routers.use("/api/challenge", challengeRouter);
routers.use("/api/auth", authRouter);
routers.use("/api/user", userRouter);

export default routers;