import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import CommentDetailDTO from "../domain/dto/comment-detail-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import Comment from "../domain/models/comment";
import Game from "../domain/models/game";
import sequelize from "../sequelize";

const commentsRouter = express.Router();

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

                res.json(await CommentDetailDTO.create(comment));
            });
        }
    )
);

commentsRouter.get("/games/:gameId/comments/:commentId",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId,
                    { transaction, rejectOnEmpty: true }
                );
                const comment = await Comment.findOne({
                    transaction,
                    where: {
                        id: req.params.commentId,
                        gameId: game.id
                    },
                    rejectOnEmpty: true,
                });

                res.json(await CommentDetailDTO.create(comment));
            });
        }
    )
);

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
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId,
                    { transaction, rejectOnEmpty: true }
                );
                const comments = await game.getComments({
                    offset: req.query.start,
                    limit: req.query.count
                }, { transaction });

                res.json(await Promise.all(
                    comments.map((c) => CommentDetailDTO.create(c))
                ));
            });
        }
    )
);

commentsRouter.put("/games/:gameId/comments/:commentId",
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
                const comment = await Comment.findOne({
                    transaction,
                    where: {
                        id: req.params.commentId,
                        gameId: game.id
                    },
                    rejectOnEmpty: true
                });

                if (comment.authorId !== req.user.id)
                    throw new AccessError();

                comment.text = req.body.text;
                await comment.save({ transaction });

                res.json(await CommentDetailDTO.create(comment));
            });
        }
    )
);

commentsRouter.delete("/games/:gameId/comments/:commentId",
    verifyToken,
    asyncMiddleware(async (req, res) => {
        await sequelize.transaction(async (transaction) => {
            const game = await Game.findByPk(
                req.params.gameId,
                { transaction, rejectOnEmpty: true }
            );
            const comment = await Comment.findOne({
                transaction,
                where: {
                    id: req.params.commentId,
                    gameId: game.id
                },
                rejectOnEmpty: true
            });

            if (comment.authorId !== req.user.id && req.user.role !== Role.Admin)
                throw new AccessError();

            await comment.destroy({ transaction });

            res.json(await CommentDetailDTO.create(comment));
        });
    })
);

export default commentsRouter;
