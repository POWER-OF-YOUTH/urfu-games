import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { param } from "express-validator";
import { HydratedDocument } from "mongoose";
import { asyncMiddleware } from "middleware-async";

import * as gamesValidator from "../../../validators/api/games";
import validateToken from "../../../validators/validateToken";
import * as gamesController from "../../../controllers/api/games";
import gameCompetenciesRouter from "./competencies";
import ratingsRouter from "./ratings";
import commentsRouter from "./comments";
import { Game, IGamePopulated } from "../../../models/game";
import { LogicError } from "../../../utils/errors";
import requestValidator from "../../../validators/request_validator";

const gamesRouter = express.Router();

const commonGameIdMiddlewares = [
    param("gameId")
        .isUUID(),
    requestValidator,
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> =
            await Game.findOne({ id: req.params.gameId });

        if (gameDocument === null)
            next(new LogicError(req.originalUrl, "Игры с указанным id не существует"));
        else {
            res.locals.gameDocument = gameDocument;
            next();
        }
    })
];

gamesRouter.post("/", validateToken, gamesValidator.addGame, gamesController.addGame);

gamesRouter.get("/:gameId", 
    commonGameIdMiddlewares,
    gamesValidator.getGame, 
    gamesController.getGame
);

gamesRouter.get("/", gamesController.getGames);

gamesRouter.put("/:gameId", 
    validateToken, 
    commonGameIdMiddlewares, 
    gamesValidator.updateGame, 
    gamesController.updateGame
);

gamesRouter.post("/:gameId/upload", 
    validateToken, 
    commonGameIdMiddlewares, 
    gamesValidator.uploadGame, 
    gamesController.uploadGame
);

gamesRouter.delete("/:gameId",
    validateToken, 
    commonGameIdMiddlewares,
    gamesValidator.deleteGame, 
    gamesController.deleteGame
);

gamesRouter.use("/:gameId/comments", 
    commonGameIdMiddlewares,
    gamesValidator.getGame,
    commentsRouter
);

gamesRouter.use("/:gameId/competencies",
    commonGameIdMiddlewares,
    gamesValidator.getGame,
    gameCompetenciesRouter
);

gamesRouter.use("/:gameId/ratings", 
    commonGameIdMiddlewares,
    ratingsRouter
);

export default gamesRouter;
