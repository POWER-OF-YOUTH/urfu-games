/**
 * @file Маршруты для работы с прогрессом пользователя.
 */

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import Game from "../domain/models/game";
import User from "../domain/models/user";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { UserProgress, saveProgress }from "../domain/models/user-progress";

const progressRouter = express.Router();

/** Сохраняет прогресс пользователя в игре `gameId`. */
progressRouter.post("/games/:gameId/progress/",
    verifyToken,
    // TODO: validation
    validateRequest(
        body("checkpointsCollected"),
        body("data")
    ),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string },
         *     body: { checkpointsCollected: number, data: string },
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res) => {
            const initiator = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            const user = initiator;
            const game = await Game.findByPk(req.params.gameId, { rejectOnEmpty: true });

            const progress = await saveProgress(
                initiator,
                game,
                user,
                {
                    checkpointsCollected: req.body.checkpointsCollected,
                    data: req.body.data
                }
            );

            res.json({
                id: progress.id,
                user: progress.user,
                game: progress.game,
                checkpointsCollected: progress.checkpointsCollected,
                data: progress.data
            });
        }
    )
);

/** Возвращает прогресс пользователя `userId`. */
progressRouter.get("/progress/:gameId/:userId",
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string, userId: string }
         * }} req
         */
        async (req, res) => {
            const progress = await UserProgress.findOne({
                where: { game: req.params.gameId, user: req.params.userId },
                rejectOnEmpty: true
            });

            res.json({
                id: progress.id,
                user: progress.user,
                game: progress.game,
                checkpointsCollected: progress.checkpointsCollected,
                data: progress.data
            });
        }
    )
);

/**
 * Возвращает информацию о прогрессе пользователя во всех играх,
 * в которые он играл.
 */
progressRouter.get("/users/:userId/progress",
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
        /**
         * @param {{
         *     params: { userId: string },
         *     query: { start: number, count: number }
         * }} req
         */
        async (req, res) => {
            const progress = await UserProgress.findAll({
                where: { user: req.params.userId },
                offset: req.query.start,
                limit: req.query.count
            });

            res.json(progress.map((p) => ({
                id: p.id,
                user: p.user,
                game: p.game,
                checkpointsCollected: p.checkpointsCollected,
                data: p.data
            })));
        }
    )
);

/** Получить информацию о прогрессе пользователей в игре `gameId`. */
progressRouter.get("/games/:gameId/progress",
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
        /**
         * @param {{
         *     params: { gameId: string }
         *     query: { start: number, count: number }
         * }} req
         */
        async (req, res) => {
            const game = await Game.findByPk(req.params.gameId, { rejectOnEmpty: true });
            const progresses = await game.getProgresses({
                offset: req.query.start,
                limit: req.query.count
            });

            res.json(progresses.map((p) => ({
                id: p.id,
                user: p.user,
                game: p.game,
                checkpointsCollected: p.checkpointsCollected,
                data: p.data
            })));
        }
    )
);

/** Удаляет прогресс пользователя `userId` в игре `gameId`. */
progressRouter.delete("/progress/:gameId/:userId",
    verifyToken,
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string, userId: string }
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res) => {
            const progress = await UserProgress.findOne({
                where: { game: req.params.gameId, user: req.params.userId },
                rejectOnEmpty: true
            });

            await deleteProgress(
                await User.findByPk(req.user.id, { rejectOnEmpty: true }),
                progress
            );

            res.json({
                id: progress.id,
                user: progress.user,
                game: progress.game,
                checkpointsCollected: progress.checkpointsCollected,
                data: progress.data
            });
        }
    )
);

export default progressRouter;

