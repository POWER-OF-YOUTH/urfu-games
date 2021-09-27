import express from "express";

import gamesController from "../../controllers/api/games";
import gamesValidator from "../../validators/api/games";

const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/:id", gamesValidator.getGame, gamesController.getGame);

export default gamesRouter;
