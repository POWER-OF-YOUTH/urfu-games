/**
 * @file Содержит маршруты для работы с чекпоинтами.
 */

import asyncMiddleware from "middleware-async";
import express from "express";

import Checkpoint from "../domain/models/checkpoint";
import CheckpointDTO from "../domain/dto/checkpoint-dto";
import Game from "../domain/models/game";
import User from "../domain/models/user";
import sequelize from "../sequelize";
import verifyToken from "../validators/verify-token";

const checkpointsRouter = express.Router();

/** Возвращает список чекпоинтов для игры `gameId`. */
checkpointsRouter.get("/games/:gameId/checkpoints",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId, 
                    { transaction, rejectOnEmpty: true }
                );
                const checkpoints = await game.getCheckpoints({ transaction });

                res.json(await Promise.all(
                    checkpoints.map((c) => CheckpointDTO.create(c))
                ));
            });
        }
    )
);

/** Возвращает информацию о чекпоинте `checkpointId`. */
checkpointsRouter.get("/checkpoints/:checkpointId",
    asyncMiddleware(
        async (req, res) => {
            const checkpoint = await Checkpoint.findByPk(
                req.params.checkpointId,
                { rejectOnEmpty: true }
            );

            res.json(await CheckpointDTO.create(checkpoint));
        }
    )
);

/** Обновляет чекпоинт `checkpointId`. */
checkpointsRouter.put("/checkpoints/:checkpointId",
    asyncMiddleware(
        (req, res, next) => {
            // TODO
        }
    )
);

/** Удаляет чекпоинт `checkpointId`. */
checkpointsRouter.delete("/checkpoints/:checkpointId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const checkpoint = await Checkpoint.findByPk(
                    req.params.checkpointId,
                    { transaction, rejectOnEmpty: true }
                );

                await checkpoint.destroy({ transaction });

                res.json(await CheckpointDTO.create(checkpoint));
            });
        }
    )
);

/** Возвращает список чекпоинтов, активированных пользователем `userId`. */
checkpointsRouter.get("/users/:userId/checkpoints",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.params.userId,
                    { transaction, rejectOnEmpty: true }
                );
                const checkpoints = await user.getCheckpoints({ transaction });

                res.json(await Promise.all(
                    checkpoints.map((c) => CheckpointDTO.create(c))
                ));
            });
        }
    )
);

/** Активирует чекпоинт `checkpointId` для пользователя `userId`. */
checkpointsRouter.put("/users/:userId/checkpoints/:checkpointId",
    asyncMiddleware(
        async (req, res) => {
            const transaction = await sequelize.transaction();

            try {
                const user = await User.findByPk(
                    req.params.userId,
                    { transaction, rejectOnEmpty: true }
                );
                const checkpoint = await Checkpoint.findByPk(
                    req.params.checkpointId,
                    { transaction, rejectOnEmpty: true }
                );

                await user.addCheckpoint(checkpoint, { transaction });

                await transaction.commit();

                res.json(await CheckpointDTO.create(checkpoint));
            }
            catch (err) {
                await transaction.rollback();

                throw err;
            }
        }
    )
);

export default checkpointsRouter;
