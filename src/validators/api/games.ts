import { body, param } from "express-validator";

import User from "../../models/user";
import Game from "../../models/game";
import requestValidator from "../request_validator";

const getGame = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Game.exists({ id }))
                throw new Error("Игры с указанным id не существует.");
        }),
    requestValidator
];

const addGame = [
    body("name")
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage("Имя должно содержать от 1 до 30 символов.")
        .matches("[0-9A-Za-z]+")
        .withMessage("Название игры не соответсвует шаблону: [0-9A-Za-z]+"),
    body("competencies")
        .isArray(),
    body("description")
        .optional()
        .isString()
        .isLength({ min: 0, max: 500 }),
    body("participants")
        .optional()
        .isArray()
        .custom(async (ids: Array<string>, { req }) => {
            for (const id of ids) {
                if (!await User.exists({ id }))
                    throw new Error("Пользователь с указанным id не существует.");
                else if (id === req.body.author)
                    throw new Error("Пользователь не может быть автором и участником одновременно.");
            }
        }),
    requestValidator 
];

const uploadGame = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Game.exists({ id }))
                throw new Error("Игры с указанным id не существует.");
        }),
    requestValidator
];

const deleteGame = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Game.exists({ id }))
                throw new Error("Игры с указанным id не существует.");
        }),
    requestValidator
];

const updateGame = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Game.exists({ id }))
                throw new Error("Игры с указанным id не существует.");
        }),
    body("name")
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage("Имя должно содержать от 1 до 30 символов.")
        .matches("[0-9A-Za-z]+")
        .withMessage("Название игры не соответсвует шаблону: [0-9A-Za-z]+"),
    body("competencies")
        .optional()
        .isArray(),
    body("image")
        .optional()
        .isString(),
    body("description")
        .optional()
        .isString()
        .isLength({ min: 0, max: 500 }),
    body("participants")
        .optional()
        .isArray()
        .custom(async (ids: Array<string>, { req }) => {
            for (const id of ids) {
                if (!await User.exists({ id }))
                    throw new Error("Пользователь с указанным id не существует.");
                else if (id === req.body.author)
                    throw new Error("Пользователь не может быть автором и участником одновременно.");
            }
        }),
    requestValidator      
]

const gamesValidator = {
    getGame,
    addGame,
    uploadGame,
    deleteGame,
    updateGame
};

export default gamesValidator;
