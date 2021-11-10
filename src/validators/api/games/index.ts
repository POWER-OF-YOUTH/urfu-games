import { body, param } from "express-validator";

import requestValidator from "../../request_validator";

export const addGame = [
    body("name")
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage("Имя должно содержать от 1 до 30 символов.")
        .matches("[0-9A-Za-z]+")
        .withMessage("Название игры не соответсвует шаблону: [0-9A-Za-z]+"),
    body("competencies")
        .default([])
        .isArray(),
    body("competencies.*")
        .isUUID(),
    body("description")
        .optional()
        .isString()
        .isLength({ min: 0, max: 500 }),
    body("participants")
        .default([])
        .isArray(),
    body("participants.*")
        .isUUID()
        .custom((id: string, { req }) => {
            if (id === req.user.id) {
                return Promise.reject(
                    new Error("Пользователь не может быть автором и участником одновременно.")
                );
            }
            return Promise.resolve();
        }),
    requestValidator 
];

export const getGame = [
    param("gameId")
        .isUUID(),
    requestValidator
];

export const updateGame = [
    param("gameId")
        .isUUID(),
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
        .isArray(),
    body("participants.*")
        .isUUID()
        .custom((id: string, { req }) => {
            if (id === req.user.id) {
                return Promise.reject(
                    new Error("Пользователь не может быть автором и участником одновременно.")
                );
            }
            return Promise.resolve();
        }),
    requestValidator      
];

export const uploadGame = [
    param("gameId")
        .isUUID(),
    requestValidator
];

export const deleteGame = [
    param("gameId")
        .isUUID(),
    requestValidator
];
