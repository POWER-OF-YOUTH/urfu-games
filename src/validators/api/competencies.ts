import { body, param, query } from "express-validator";

import requestValidator from "../request_validator";


export const addCompetence = [
    body("name")
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage("Имя должно содержать от 1 до 30 символов."),
    body("description")
        .isString()
        .isLength({ min: 1, max: 5000 })
        .withMessage("Описание должно содержать от 1 до 5000 символов."),
    requestValidator
];

export const getCompetence = [
    param("competenceId")
        .isUUID(),
    requestValidator
];

export const getCompetencies = [
    query("start")
        .default(0)
        .isInt({ gt: -1 })
        .toInt(),
    query("count")
        .default(10)
        .isInt({ gt: 0 })
        .toInt(),
    requestValidator
];

export const updateCompetence = [
    param("competenceId")
        .isUUID(),
    body("name")
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage("Имя должно содержать от 1 до 30 символов."),
    body("description")
        .optional()
        .isString()
        .isLength({ min: 1, max: 5000 })
        .withMessage("Описание должно содержать от 1 до 5000 символов."),
    requestValidator
];

export const deleteCompetence = [
    param("competenceId")
        .isUUID(),
    requestValidator
];
