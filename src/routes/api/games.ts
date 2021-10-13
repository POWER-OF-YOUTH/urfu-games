import express from "express";

import gamesValidator from "../../validators/api/games";
import gamesController from "../../controllers/api/games";
import validateToken from "../../validators/validateToken";

const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/:id", gamesValidator.getGame, gamesController.getGame);
gamesRouter.post("/", validateToken, gamesValidator.addGame, gamesController.addGame);
gamesRouter.post("/:id/upload", validateToken, gamesValidator.uploadGame, gamesController.uploadGame);
gamesRouter.delete("/:id",
    validateToken, 
    gamesValidator.deleteGame, 
    gamesController.deleteGame
);

export default gamesRouter;
