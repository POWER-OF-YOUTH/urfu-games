/**
 * @file Содержит маршруты для работы с комментариями к играм.
 */

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import * as globals from "../globals";
import Comment from "../domain/models/comment";
import CommentDetailDTO from "../domain/dto/comment-detail-dto";
import Game from "../domain/models/game";
import sequelize from "../sequelize";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";

const commentsRouter = express.Router();

/** Создаёт комментарий для игры `gameId`. */
commentsRouter.post("/games/:gameId/comments/",
    verifyToken,
    validateRequest(
        body("text")
            .isString()
            .withMessage("Поле text должно быть строкой.")
            .isLength({ min: 1, max: 500 })
            .withMessage("Комментарий должен содержать от 1 до 500 символов.")
    ),
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId,
                    { transaction, rejectOnEmpty: true }
                );
                const comment = await game.createComment({
                    authorId: req.user.id,
                    text: req.body.text
                }, { transaction });

                res.setHeader("Location", `${globals.API_URI}/comments/${comment.id}`);
                res.json(await CommentDetailDTO.create(comment));
            });
        }
    )
);

/** Возвращает информацию о комментарии `commentId`. */
commentsRouter.get("/games/:gameId/comments/:commentId",
    asyncMiddleware(
        async (req, res) => {
            const game = await Game.findByPk(req.params.gameId, { rejectOnEmpty: true });
            const comment = await game.getComment({
                where: { id: req.params.commentId },
                rejectOnEmpty: true
            });

            res.json(await CommentDetailDTO.create(comment));
        }
    )
);

/** Возвращает информацию о комментариях игры `gameId` */
commentsRouter.get("/games/:gameId/comments/",
    validateRequest(
        query("start")
            .default(0)
            .isInt({ gt: -1 })
            .toInt(),
        query("count")
            .default(10)
            .isInt({ gt: 0, lt: 100 })
            .toInt()
    ),
    asyncMiddleware(
        async (req, res) => {
            const game = await Game.findByPk(
                req.params.gameId,
                { rejectOnEmpty: true }
            );
            const comments = await game.getComments({
                offset: req.query.start,
                limit: req.query.count
            });

            res.json(await Promise.all(
                comments.map((c) => CommentDetailDTO.create(c))
            ));
        }
    )
);

/** Обновляет комментарий `commentId`. */
commentsRouter.put("/comments/:commentId",
    verifyToken,
    validateRequest(
        body("text")
            .isString()
            .withMessage("Поле text должно быть строкой.")
            .isLength({ min: 1, max: 500 })
            .withMessage("Комментарий должен содержать от 1 до 500 символов.")
    ),
    asyncMiddleware(
        async (req, res) => {
            const comment = await Comment.findOne({
                where: {
                    id: req.params.commentId
                },
                rejectOnEmpty: true
            });

            if (comment.authorId !== req.user.id)
                throw new AccessError();

            comment.text = req.body.text;
            await comment.save();

            res.json(await CommentDetailDTO.create(comment));
        }
    )
);

/** Удаляет комментарий `commentId`. */
commentsRouter.delete("/comments/:commentId",
    verifyToken,
    asyncMiddleware(async (req, res) => {
        const comment = await Comment.findOne({
            where: {
                id: req.params.commentId
            },
            rejectOnEmpty: true
        });

        if (comment.authorId !== req.user.id && req.user.role !== Role.Admin)
            throw new AccessError();

        await comment.destroy();

        res.json(await CommentDetailDTO.create(comment));
    })
);

export default commentsRouter;
