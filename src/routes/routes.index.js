import { Router } from "express";

import challengeRouter from "./challenge.router.js";

const routers = Router();

routers.use("/api/challenge", challengeRouter);


export default routers;