import express from "express";

import authRouter from "./auth";
import gamesRouter from "./games";
import usersRouter from "./users";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/games", gamesRouter);
apiRouter.use("/users", usersRouter);

export default apiRouter;
