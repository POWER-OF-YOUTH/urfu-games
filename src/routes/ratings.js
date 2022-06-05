/**
 * @file Содержит маршруты для работы с оценками игр.
 */

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import RatingDetailDTO from "../domain/dto/rating-detail-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import Game from "../domain/models/game";
import { LogicError } from "../utils/errors";
import Rating from "../domain/models/rating";
import sequelize from "../sequelize";

const ratingsRouter = express.Router();

/** Добавляет оценку со значением `value` для игры `gameId`. */
ratingsRouter.put("/games/:gameId/ratings/",
    verifyToken,
    validateRequest(
        body("value")
            .isNumeric() // TODO: Range check
    ),
    asyncMiddleware(
        async (req, res) => {
            const transaction = await sequelize.transaction();

            try {
                const game = await Game.findOne({
                    transaction,
                    where: {
                        id: req.params.gameId
                    },
                    rejectOnEmpty: true
                });

                const rating = await game.createRate({
                    authorId: req.user.id,
                    value: req.body.value
                }, { transaction });

                await transaction.commit();

                res.json(await RatingDetailDTO.create(rating));
            }
            catch (err) {
                await transaction.rollback();

                throw err;
            }
        }
    )
);

/** Возвращает информацию о всех оценках игры. */
ratingsRouter.get("/games/:gameId/ratings/",
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
                const game = await Game.findOne({
                    transaction,
                    where: {
                        id: req.params.gameId
                    },
                    rejectOnEmpty: true
                });

                const ratings = await game.getRatings({
                    offset: req.body.start,
                    limit: req.body.count
                }, { transaction });

                res.json(await Promise.all(
                    ratings.map(r => RatingDetailDTO.create(r))
                ));
            });
        }
    )
);

/** Удаляет оценку пользователя для игры `gameId`. */
ratingsRouter.delete("/games/:gameId/ratings/",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const rating = await Rating.findOne({
                    transaction,
                    where: {
                        authorId: req.user.id,
                        gameId: req.params.gameId
                    },
                    rejectOnEmpty: new LogicError("Пользователь не оценивал игру.")
                });

                await rating.destroy({ transaction });

                res.json(await RatingDetailDTO.create(rating));
            });
        }
    )
);

export default ratingsRouter;
