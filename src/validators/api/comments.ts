import { body, param, query } from "express-validator";

import User from "../../models/user";
import Game from "../../models/game";
import Comment from "../../models/comment";
import requestValidator from "../request_validator";

export const addComment = [
    body("gameId")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Game.exists({ id }))
                throw new Error("Игры с указанным id не существует.");
        }),
    body("text")
        .isString()
        .isLength({ min: 1, max: 500 }),
    requestValidator
];

export const getComments = [
    query("gameId")
        .optional()
        .isUUID()
        .custom(async (id: string) => {
            if (!await Game.exists({ id }))
                throw new Error("Игры с указанным id не существует.");
        }),
    query("author")
        .optional()
        .isUUID()
        .custom(async (id: string) => {
            if (!await User.exists({ id }))
                throw new Error("Пользователь с указанным id не существует.");
        }),
    requestValidator
];

export const getComment = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Comment.exists({ id }))
                throw new Error("Комментария с указанным id не существует.")
        }),
    requestValidator
];

export const updateComment = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Comment.exists({ id }))
                throw new Error("Комментария с указанным id не существует.")
        }),
    body("text")
        .isString()
        .isLength({ min: 1, max: 500 }),
];

export const deleteComment = [
    param("id")
        .isUUID()
        .custom(async (id: string) => {
            if (!await Comment.exists({ id }))
                throw new Error("Комментария с указанным id не существует.")
        }),
    requestValidator
];

