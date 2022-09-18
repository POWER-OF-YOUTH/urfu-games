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
import { ParticipantRole } from "../domain/models/game-participants";
import { AccessError } from "../utils/errors";

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

/**
 * Удалаяет чекпоинт `checkpoint`.
 * @param {User} initiator Инициатор удаления.
 * @param {Checkpoint} checkpoint Удаляемый чекпоинт.
 */
async function deleteCheckpoint(initiator, checkpoint) {
    const game = await checkpoint.getGame();
    const author = await game.getParticipant({ where: { role: ParticipantRole.Author }});
    if (initiator.role === Role.Admin || initiator.id === author.id) {
        await checkpoint.destroy();
    }

    throw new AccessError("Только администратор может удалить чекпоинт для чужой игры.");
}

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

                await deleteCheckpoint(checkpoint);

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

/**
 * Активирует чекпоинт для пользователя `user`.
 * @param {User} initiator Инициатор активации чекпоинта.
 * @param {User} user Пользователь, для которого необходимо активировать чекпоинт.
 * @param {Checkpoint} checkpoint Чекпоинт.
 */
async function activateCheckpoint(initiator, user, checkpoint)
{
    if (initiator.role === Role.Admin || initiator.id === user.id)
    {
        await user.addCheckpoint(checkpoint);
    }
}

/** Активирует чекпоинт `checkpointId` для пользователя `userId`. */
checkpointsRouter.put("/users/:userId/checkpoints/:checkpointId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            const initiator = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            const user = await User.findByPk(
                req.params.userId,
                { transaction, rejectOnEmpty: true }
            );
            const checkpoint = await Checkpoint.findByPk(
                req.params.checkpointId,
                { transaction, rejectOnEmpty: true }
            );

            await activateCheckpoint(initiator, user, checkpoint);

            res.json(await CheckpointDTO.create(checkpoint));
        }
    )
);

export default checkpointsRouter;
export { checkpointsRouter, deleteCheckpoint, activateCheckpoint };

