import { body, param } from "express-validator";
import { containsGame } from "../../utils/checkers";
import requestValidator from "../request_validator";

export const submitRate = [
    body('gameId')
        .isUUID()
        .custom(containsGame),
    body('value')
        .isNumeric(),
    requestValidator
]

export const getRates = [
    body('gameId')
        .optional()
        .isUUID(),
    body('authorId')
        .optional()
        .isUUID(),
    requestValidator
]
