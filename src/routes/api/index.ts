import express from "express";

import authRouter from "./auth";
import gamesRouter from "./games";
import commentsRouter from "./comments";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/games", gamesRouter);
apiRouter.use("/comments", commentsRouter);

export default apiRouter;
