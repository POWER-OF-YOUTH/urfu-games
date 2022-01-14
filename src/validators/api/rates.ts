import { body, param } from "express-validator";
import { containsGame } from "../../utils/checkers";
import requestValidator from "../request_validator";

export const submitRate = [
    body('gameId')
        .isUUID()
        .custom(containsGame),
    body('value')
        .isNumeric()
        .custom(x => x >= 0 && x <= 5)
        .withMessage("Оценка должна быть в диапазоне [0, 5]"),
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
