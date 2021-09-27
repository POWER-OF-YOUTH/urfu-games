import express from "express";
import { body, param } from "express-validator";
import { Request } from "express";

import User from "../../models/user";
import requestValidator from "../../utils/request_validator";
import gamesController from "../../controllers/api/games";

const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getGames);

gamesRouter.post("/", 
    body("name")
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage("Имя должно содержать от 1 до 30 символов."),
    body("author")
        .isUUID()
        .custom(async (id: string) => {
            if (!await User.exists({ id }))
                throw new Error("Пользователь с указанным id не существует.");
        }),
    body("competencies")
        .isArray(),
    body("image")
        .isString()
        .optional(),
    body("description")
        .isString()
        .isLength({ min: 0, max: 500 })
        .optional(),
    body("participants")
        .isArray()
        .optional()
        .custom(async (ids: Array<string>, data) => {
            for (const id of ids) {
                if (!await User.exists({ id }))
                    throw new Error("Пользователь с указанным id не существует.");
                else if (id === data.req.body.author)
                    throw new Error("Пользователь не может быть автором и участником одновременно.");
            }
        }),
    requestValidator, 
    gamesController.addGame
);

gamesRouter.get("/:id", 
    param("id")
        .isUUID(),
    requestValidator,
    gamesController.getGame
);

export default gamesRouter;
