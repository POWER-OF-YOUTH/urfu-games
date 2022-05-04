import express from "express";
import expressJWT, { UnauthorizedError } from "express-jwt";
import { Op } from "sequelize";
import { asyncMiddleware } from "middleware-async";

import ajv from "../ajv.js";
import GameProgressSettings from "../domain/models/game-progress-settings.js";
import Progress from "../domain/models/progress.js";
import sequelize from "../sequelize.js";

const mainRouter = express.Router();

/**
 * Возвращает две промежуточные функции:
 * первая для проверки подписи JWT, 
 * вторая — специальный обработчик, который 
 * реагирует на ошибку в JWT.
 */
function verifyToken() {
    return [
        expressJWT({ 
            secret: process.env.JWT_SECRET, 
            algorithms: ["HS256"] 
        }),
        (err, req, res, next) => {
            if (err instanceof UnauthorizedError) 
                return next(new Error("Not authorized."));
            return next(err);
        }
    ];
}

/** 
 * `validateRequest` принимает на вход скомпилированную ajv схему 
 * и возвращает промежуточную функцию, которая использует эту схему
 * для валидации запроса.
 *
 * @param validate - скомпилированная ajv схема.
 *
 * @example
 * router.get(
 *     validateRequest(ajv.getSchema("schemaName")),
 *     (req, res) => { ... }
 * )
 */
function validateRequest(validate) {
    return (req, res, next) => {
        if (validate === undefined)
            return next(new Error("validate is undefined"));
        else if (!validate(req)) {
            // TODO
            res.json(validate.errors);
            return;
        }
        next();
    }
}

// Проверяем токен для всех запросов, которые могут
// вызвать изменения в базе данных.
mainRouter.post("/*", verifyToken());
mainRouter.put("/*", verifyToken());
mainRouter.delete("/*", verifyToken());

// Создать настройки для игры
mainRouter.post("/games",
    validateRequest(ajv.getSchema("/routes/createGameProgressSettings")),
    asyncMiddleware(
        /**
         * @param {{
         *     body: { game: string, checkpointsCount: number },
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res, next) => {
            let gameProgressSettings = await GameProgressSettings
                .findOne({ where: { game: req.body.game }});
            if (gameProgressSettings !== null)
                return next(new Error("Game progress settings for this game already exist."));
            gameProgressSettings = await GameProgressSettings.create({
                game: req.body.game,
                checkpointsCount: req.body.checkpointsCount
            });

            res.json({
                id: gameProgressSettings.id,
                game: gameProgressSettings.game,
                checkpointsCount: gameProgressSettings.checkpointsCount
            });
        }
    )
);

mainRouter.get("/games",
    validateRequest(ajv.getSchema("/routes/getGameProgressSettingsList")),
    asyncMiddleware(
        /**
         * @param {{
         *     query: { start: number, count: number }
         * }} req
         */
        async (req, res, next) => {
            const gameProgressSettingsList = await GameProgressSettings.findAll({
                offset: req.query.start,
                limit: req.query.count
            });

            res.json(gameProgressSettingsList.map((gps) => ({
                id: gps.id,
                game: gps.game,
                checkpointsCount: gps.checkpointsCount
            })));
        }
    )
);

mainRouter.get("/games/:gameId",
    validateRequest(ajv.getSchema("/routes/getGameProgressSettings")),
    asyncMiddleware(
        /**
         * @param {{ 
         *     params: {
         *         gameId: string
         *     }
         * }} req
         */
        async (req, res, next) => {
            const gameProgressSettings = await GameProgressSettings.findOne({ 
                where: { game: req.params.gameId }
            });
            if (gameProgressSettings === null)
                return next(new Error("Game progress settings for this game does not exist."));

            res.json({
                id: gameProgressSettings.id,
                game: gameProgressSettings.game,
                checkpointsCount: gameProgressSettings.checkpointsCount
            });
        }
    )
);

mainRouter.put("/games/:gameId",
    validateRequest(ajv.getSchema("/routes/updateGameProgressSettings")),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string },
         *     query: { keepProgress: boolean },
         *     body: { checkpointsCount: number },
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res, next) => {
            const gameProgressSettings = await GameProgressSettings
                .findOne({ where: { game: req.params.gameId }});
            if (gameProgressSettings === null)
                return next(new Error("Game progress settings for this game does not exist."));

            await sequelize.transaction(async (transaction) => {
                // Если установлен флаг `keepProgress`, для пользователей,
                // у которых число собраных токенов превышает общее их количество,
                // устанавливаем `checkpointsCollected` равным `checkpointsCount`.
                if (req.query.keepProgress) {
                    await Progress.update(
                        { checkpointsCollected: req.body.checkpointsCount },
                        { 
                            where: {  
                                game: req.params.gameId,
                                checkpointsCollected: { 
                                    [Op.gt]: req.body.checkpointsCount 
                                }
                            }
                        },
                        { transaction }
                    );
                }
                else {
                    await Progress.destroy({ 
                        where: { game: req.params.gameId }
                    }, { transaction });
                }

                gameProgressSettings.checkpointsCount = req.body.checkpointsCount;
                await gameProgressSettings.save({ transaction });

            });

            res.json({
                id: gameProgressSettings.id,
                game: gameProgressSettings.game,
                checkpointsCount: gameProgressSettings.checkpointsCount
            });
        }
    )
);

mainRouter.delete("/games/:gameId",
    validateRequest(ajv.getSchema("/routes/deleteGameProgressSettings")),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string }
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res, next) => {
            const gameProgressSettings = await GameProgressSettings
                .findOne({ where: { game: req.params.gameId }});
            if (gameProgressSettings === null)
                return next(new Error("Game progress settings for this game does not exist."));

            await gameProgressSettings.destroy();

            res.json({
                id: gameProgressSettings.id,
                game: gameProgressSettings.game,
                checkpointsCount: gameProgressSettings.checkpointsCount
            });
        }
    )
);

// Сохранить прогресс пользователя в игре `gameId`.
mainRouter.post("/games/:gameId/progress", 
    validateRequest(ajv.getSchema("/routes/saveProgress")),
    asyncMiddleware(
        /**
         * @param {{ 
         *     params: { gameId: string },
         *     body: { checkpointsCollected: number, data: string },
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res, next) => {
            const gameProgressSettings = await GameProgressSettings.findOne({
                where: { game: req.params.gameId }
            });
            if (gameProgressSettings === null)
                return next(new Error("Game progress settings for this game does not exist."));

            if (req.body.checkpointsCollected > gameProgressSettings.checkpointsCount)
                return next(new Error(`checkpointsCollected should be less than checkpointsCount`));

            let progress = await Progress.findOne({ 
                where: { game: req.params.gameId, user: req.user.id }
            });
            if (progress === null) {
                progress = await Progress.create({ 
                    user: req.user.id,
                    game: req.params.gameId,
                    checkpointsCollected: req.body.checkpointsCollected,
                    data: req.body.data
                });
            }
            else {
                progress.checkpointsCollected = req.body.checkpointsCollected;
                progress.data = req.body.data;
                
                await progress.save();
            }

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

// Получить прогресс.
mainRouter.get("/progress/:gameId/:userId",
    validateRequest(ajv.getSchema("/routes/getProgress")),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string, userId: string }
         * }} req
         */
        async (req, res, next) => {
            const progress = await Progress.findOne({
                where: { game: req.params.gameId, user: req.params.userId }
            });
            if (progress === null)
               return next(new Error("Progress does not exist."));

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

// Получить информацию о прогрессе пользователя во всех играх,
// в которые он играл.
mainRouter.get("/users/:userId/progress",
    validateRequest(ajv.getSchema("/routes/getUserProgressList")),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { userId: string },
         *     query: { start: number, count: number }
         * }} req
         */
        async (req, res, next) => {
            const progress = await Progress.findAll({
                where: { user: req.params.userId }
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

// Получить информацию о прогрессе пользователей в конкретной игре.
mainRouter.get("/games/:gameId/progress",
    validateRequest(ajv.getSchema("/routes/getGameProgressList")),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string }
         *     query: { start: number, count: number }
         * }} req
         */
        async (req, res, next) => {
            const progress = await Progress.findAll({
                where: { game: req.params.gameId }
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

// Удалить прогресс пользователя.
mainRouter.delete("/progress/:gameId/:userId",
    validateRequest(ajv.getSchema("/routes/deleteProgress")),
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string, userId: string }
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res, next) => {
            const progress = await Progress.findOne({
                where: { game: req.params.gameId, user: req.params.userId }
            });
            if (progress === null)
               return next(new Error("Progress does not exist."));

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

export default mainRouter;
