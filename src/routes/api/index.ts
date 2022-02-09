import express from "express";

import authRouter from "./auth";
import competenciesRouter from "./competencies";
import gamesRouter from "./games";
import usersRouter from "./users";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/games", gamesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/competencies", competenciesRouter);

export default apiRouter;
