import strings from "../config/strings.json";

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import RatingDetailDTO from "../domain/dto/rating-detail-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
// import { Comment, CommentDocument } from "../domain/models/comment";
import Game from "../domain/models/game";
import { LogicError, AccessError } from "../utils/errors";
import Rating from "../domain/models/rating";

const ratingsRouter = express.Router();

// Выставить оценку
ratingsRouter.put("/games/:gameId/ratings/",
    verifyToken,
    validateRequest(
        body("value")
            .isNumeric() // TODO: Range check
    ),
    asyncMiddleware(async (req, res, next) => {
        const game = await Game.findOne({
            where: {
                id: req.params.gameId
            }
        });

        const rating = await game.createRate({
            authorId: req.user.id,
            value: req.body.value
        });

        res.json(await RatingDetailDTO.create(rating));
    })
);

// Получить информацию о всех оценках игры
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
    asyncMiddleware(async (
        req,
        res,
        next
    ) => {
        const game = await Game.findOne({
            where: {
                id: req.params.gameId
            }
        });

        const ratings = await game.getRatings({
            offset: req.body.start,
            limit: req.body.count
        });

        res.json(await Promise.all(
            ratings.map(r => RatingDetailDTO.create(r))
        ));
    })
);

// Удалить оценку
ratingsRouter.delete("/games/:gameId/ratings/",
    verifyToken,
    asyncMiddleware(async (
        req,
        res,
        next
    ) => {
        const rating = await Rating.findOne({
            where: {
                authorId: req.user.id,
                gameId: req.params.gameId
            }
        });
        if (rating === null)
            return next(new LogicError("Пользователь не оценивал игру."));

        await rating.destroy();

        res.json(await RatingDetailDTO.create(rating));
    })
);

export default ratingsRouter;
