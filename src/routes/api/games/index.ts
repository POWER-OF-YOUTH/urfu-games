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
import commentsRouter from "./comments";
import { Game, IGamePopulated } from "../../../models/game";
import { LogicError, ValidationError } from "../../../utils/errors";
import requestValidator from "../../../validators/request_validator";

const gamesRouter = express.Router();

gamesRouter.use("/:gameId",
    param("gameId")
        .isUUID(),
    requestValidator
);

gamesRouter.use("/:gameId", 
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
    }
));

gamesRouter.post("/", validateToken, gamesValidator.addGame, gamesController.addGame);

gamesRouter.get("/:gameId", gamesValidator.getGame, gamesController.getGame);

gamesRouter.get("/", gamesController.getGames);

gamesRouter.put("/:gameId", validateToken, gamesValidator.updateGame, gamesController.updateGame);

gamesRouter.post("/:gameId/upload", validateToken, gamesValidator.uploadGame, gamesController.uploadGame);

gamesRouter.delete("/:gameId",
    validateToken, 
    gamesValidator.deleteGame, 
    gamesController.deleteGame
);

gamesRouter.use("/:gameId/comments", 
    gamesValidator.getGame,
    commentsRouter
);

gamesRouter.use("/:gameId/competencies",
    gamesValidator.getGame,
    gameCompetenciesRouter
);

export default gamesRouter;
