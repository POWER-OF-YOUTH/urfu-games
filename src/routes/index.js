import express from "express";

import authRouter from "./auth";
import checkpointsRouter from "./checkpoints";
import commentsRouter from "./comments";
import competenciesRouter from "./competencies";
import gamesRouter from "./games";
import ratingsRouter from "./ratings";
import searchRouter from "./search";
import usersRouter from "./users";

const mainRouter = express.Router();

mainRouter.use(authRouter);
mainRouter.use(checkpointsRouter);
mainRouter.use(commentsRouter);
mainRouter.use(competenciesRouter);
mainRouter.use(gamesRouter);
mainRouter.use(ratingsRouter);
mainRouter.use(searchRouter);
mainRouter.use(usersRouter);

export default mainRouter;
