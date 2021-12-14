import express from "express";
import { checkSchema } from "express-validator";

import requestValidator from "../../../validators/request_validator";
import * as gamesValidator from "../../../validators/api/games";
import * as gamesController from "../../../controllers/api/games";
import commentsRouter from "./comments";
import validateToken from "../../../validators/validateToken";

const gamesRouter = express.Router();

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

export default gamesRouter;
