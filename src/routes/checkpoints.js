import asyncMiddleware from "middleware-async";
import express from "express";

import Checkpoint from "../domain/models/checkpoint.ts";
import CheckpointDTO from "../domain/dto/checkpoint-dto.js";
import Game from "../domain/models/game";
import User from "../domain/models/user";
import sequelize from "../sequelize.js";
import verifyToken from "../validators/verify-token";

const checkpointsRouter = express.Router();

// Получить список чекпоинтов для игры `gameId`.
checkpointsRouter.get("/games/:gameId/checkpoints",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId, 
                    { transaction, rejectOnEmpty: true }
                );
                const checkpoints = await game.getCheckpoints();

                res.json(await Promise.all(
                    checkpoints.map((c) => CheckpointDTO.create(c))
                ));
            });
        }
    )
);

// Получение информации о чекпоинте `checkpointId`.
checkpointsRouter.get("/checkpoints/:checkpointId",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const checkpoint = await Checkpoint.findByPk(
                    req.params.checkpointId,
                    { transaction, rejectOnEmpty: true }
                );

                res.json(await CheckpointDTO.create(checkpoint));
            });       
        }
    )
);

// Обновить чекпоинт `checkpointId`.
checkpointsRouter.put("/checkpoints/:checkpointId",
    asyncMiddleware(
        (req, res, next) => {
            // TODO
        }
    )
);

// Удалить чекпоинт `checkpointId`.
checkpointsRouter.delete("/checkpoints/:checkpointId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const checkpoint = await Checkpoint.findByPk(
                    req.params.checkpointId,
                    { transaction, rejectOnEmpty: true }
                );

                await checkpoint.destroy();

                res.json(await CheckpointDTO.create(checkpoint));
            });
        }
    )
);

// Получить список чекпоинтов активированных пользователем `userId`.
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

// Активировать чекпоинт `checkpointId` для пользователя `userId`.
checkpointsRouter.put("/users/:userId/checkpoints/:checkpointId",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.params.userId,
                    { transaction, rejectOnEmpty: true }
                );
                const checkpoint = await Checkpoint.findByPk(
                    req.params.checkpointId,
                    { transaction, rejectOnEmpty: true }
                );

                await user.addCheckpoint(checkpoint, { transaction });

                res.json(await CheckpointDTO.create(checkpoint));
            });
        }
    )
);

export default checkpointsRouter;
