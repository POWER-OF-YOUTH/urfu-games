import { body, param } from "express-validator";

import Comment from "../../../models/comment";
import requestValidator from "../../request_validator";

export const addComment = [
    body("text")
        .isString()
        .withMessage("Поле text должно быть строкой.")
        .isLength({ min: 1, max: 500 })
        .withMessage("Комментарий должен содержать от 1 до 500 символов."),
    requestValidator
];

export const getComments = [
    requestValidator
];

export const getComment = [
    param("commentId")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Comment.exists({ id }))
                throw new Error("Комментария с указанным id не существует.");
        }),
    requestValidator
];

export const updateComment = [
    param("commentId")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Comment.exists({ id }))
                throw new Error("Комментария с указанным id не существует.");
        }),
    body("text")
        .isString()
        .withMessage("Поле text должно быть строкой.")
        .isLength({ min: 1, max: 500 })
        .withMessage("Комментарий должен содержать от 1 до 500 символов."),
    requestValidator
];

export const deleteComment = [
    param("commentId")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Comment.exists({ id }))
                throw new Error("Комментария с указанным id не существует.");
        }),
    requestValidator
];

