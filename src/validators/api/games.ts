import { body, param } from "express-validator";

import requestValidator from "../request_validator";

const getGame = [
    param("id")
        .isUUID(),
    requestValidator
];

const addGame = [
    body("competencies")
        .isArray(),
    body("image")
        .isString()
        .optional(),
    body("name")
        .isString(),
    body("description")
        .isString()
        .optional(),
    body("author")
        .isUUID(),
    body("participants")
        .isArray()
        .optional(),
    requestValidator
];

const gamesValidator = {
    getGame, 
    addGame
};

export default gamesValidator;