import express from "express";

import authRouter from "./auth";
import gamesRouter from "./games";
import usersRouter from "./users";
import competenciesRouter from "./competencies";

const apiRouter = express.Router();

// Порядок обработки запроса
/*
    1. access handler
    2. validation errors handler
    3. logic errors handler
    *4. data handling
    5. business logic and response
*/

apiRouter.use("/auth", authRouter);

apiRouter.use("/games", gamesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/competencies", competenciesRouter);

export default apiRouter;
