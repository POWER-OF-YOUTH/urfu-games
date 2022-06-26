/**
 * @file Маршруты для работы с оценками игр.
 */

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import RatingDetailDTO from "../domain/dto/rating-detail-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import Game from "../domain/models/game";
import { AccessError, LogicError } from "../utils/errors";
import Rating from "../domain/models/rating";
import sequelize from "../sequelize";

const ratingsRouter = express.Router();

/** Добавляет оценку со значением `value` для игры `gameId`. */
ratingsRouter.post("/games/:gameId/ratings/",
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

                let rating = await Rating.findOne({
                    transaction,
                    where: { authorId: req.user.id }
                });
                if (rating !== null)
                    await rating.destroy({ transaction });
                rating = await game.createRating({
                    authorId: req.user.id,
                    value: req.body.value
                }, { transaction });

                // Update 'rating' game field.
                const ratings = await game.getRatings({ transaction });
                game.rating = ratings.reduce(
                    (previous, current) => previous + (current.value / ratings.length), // count average
                    0
                );
                await game.save({ transaction });

                await transaction.commit();

                res.setHeader("Location", `${API_URI}/ratings/${rating.id}`);
                res.json(await RatingDetailDTO.create(rating));
            }
            catch (err) {
                await transaction.rollback();

                throw err;
            }
        }
    )
);

/** Возвращает информацию об оценке 'ratingId'. */
ratingsRouter.get("/ratings/:ratingId",
    asyncMiddleware(
        async (req, res) => {
            const rating = await Rating.findByPk(
                req.params.ratingId,
                { rejectOnEmpty: new LogicError("Оценка не найдена.") }
            );

            res.json(await RatingDetailDTO.create(rating));
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
                const game = await Game.findByPk(
                    req.params.gameId,
                    { transaction, rejectOnEmpty: true }
                );
                const rating = await Rating.findOne({
                    transaction,
                    where: {
                        authorId: req.user.id,
                        gameId: req.params.gameId
                    },
                    rejectOnEmpty: new LogicError("Вы не оценивали игру.")
                });

                await rating.destroy({ transaction });

                // Update game rating.
                const ratings = await game.getRatings({ transaction });
                game.rating = ratings.reduce(
                    (previous, current) => previous + (current.value / ratings.length), // count average
                    0
                );
                await game.save({ transaction });

                res.json(await RatingDetailDTO.create(rating));
            });
        }
    )
);

/** Удаляет оценку 'ratingId'. */
ratingsRouter.delete("/ratings/:ratingId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const rating = await Rating.findByPk(
                    req.params.ratingId,
                    { 
                        transaction,
                        rejectOnEmpty: new LogicError("Оценка не найдена.")
                    }
                );
                if (rating.authorId !== req.user.id)
                    throw new AccessError("Вы не выставляли эту оценку.");
                const game = await rating.getGame({ transaction });

                await rating.destroy({ transaction });

                // Update game rating.
                const ratings = await game.getRatings({ transaction });
                game.rating = ratings.reduce(
                    (previous, current) => previous + (current.value / ratings.length), // count average
                    0
                );
                await game.save({ transaction });

                res.json(await RatingDetailDTO.create(rating));
            });
        }
    )
);

export default ratingsRouter;
