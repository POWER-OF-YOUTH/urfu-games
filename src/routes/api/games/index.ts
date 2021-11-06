import express from "express";

import * as gamesValidator from "../../../validators/api/games";
import * as gamesController from "../../../controllers/api/games";
import commentsRouter from "./comments";
import validateToken from "../../../validators/validateToken";

const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/:gameId", gamesValidator.getGame, gamesController.getGame);
gamesRouter.post("/", validateToken, gamesValidator.addGame, gamesController.addGame);
gamesRouter.post("/:gameId/upload", validateToken, gamesValidator.uploadGame, gamesController.uploadGame);
gamesRouter.delete("/:gameId",
    validateToken, 
    gamesValidator.deleteGame, 
    gamesController.deleteGame
);
gamesRouter.put("/:gameId", validateToken, gamesValidator.updateGame, gamesController.updateGame);

gamesRouter.use("/:gameId/comments", 
    gamesValidator.getGame,
    commentsRouter
);

export default gamesRouter;
