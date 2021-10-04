import express from "express";

import gamesValidator from "../../validators/api/games";
import gamesController from "../../controllers/api/games";

const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/:id", gamesValidator.getGame, gamesController.getGame);
gamesRouter.post("/", gamesValidator.addGame, gamesController.addGame);
gamesRouter.post("/:id/upload", gamesValidator.uploadGame, gamesController.uploadGame);
gamesRouter.delete("/:id", gamesValidator.deleteGame, gamesController.deleteGame);

export default gamesRouter;
