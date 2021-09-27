import express from "express";

import authRouter from "./auth";
import gamesRouter from "./games";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/games", gamesRouter);

export default apiRouter;