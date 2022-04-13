import express from "express";

import authRouter from "./auth";
import competenciesRouter from "./competencies";
import gamesRouter from "./games";
import usersRouter from "./users";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);

mainRouter.use("/games", gamesRouter);

mainRouter.use("/users", usersRouter);

mainRouter.use("/competencies", competenciesRouter);

export default mainRouter;
