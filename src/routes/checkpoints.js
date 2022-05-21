import express from "express";
import { Op } from "sequelize";
import asyncMiddleware from "middleware-async";

import CompetenceDTO from "../domain/dto/competence-dto";
import Competence from "../domain/models/competence";
import Checkpoint from "../domain/models/checkpoint.js";
import { LogicError } from "../utils/errors";
import User from "../domain/models/user";

const checkpointsRouter = express.Router();

checkpointsRouter.param("checkpointId",
    async (req, res, next) => {
        const checkpoint = await Checkpoint.findOne({
            where: { id: req.params.checkpointId }
        });

        if (checkpoint === null)
            return next(new LogicError("Чекпоинт с указанным id не существует."));
        next();
    }
);

// Получить список чекпоинтов для игры `gameId`.
checkpointsRouter.get("/games/:gameId/checkpoints",
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string }
         * }} req
         */
        async (req, res, next) => {
            const checkpoints = await Checkpoint.findAll({
                where: { game: req.params.gameId }
            });

            res.json(await Promise.all(
                checkpoints.map(async (c) => {
                    const competence = await Competence.findOne({ id: c.competence });

                    return {
                        id: c.id,
                        name: c.name,
                        ...({ competence: competence === null ? null : await CompetenceDTO.create(competence) }),
                        description: c.description,
                        createdAt: c.createdAt
                    }
                })
            ));
        }
    )
);

// Получение информации о чекпоинте `checkpointId`.
checkpointsRouter.get("/checkpoints/:checkpointId",
    asyncMiddleware(
        /**
         * @param {{
         *     params: { checkpointId: string }
         * }} req
         */
        async (req, res, next) => {
            const checkpoint = await Checkpoint.findOne({
                where: { id: req.params.checkpointId }
            });
            let competence = null;
            if (checkpoint !== null)
                competence = await Competence.findOne({ id: checkpoint.competence });

            res.json({
                id: checkpoint.id,
                name: checkpoint.name,
                ...({ competence: competence === null ? null : await CompetenceDTO.create(competence) }),
                description: checkpoint.description,
                createdAt: checkpoint.createdAt
            })
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
    asyncMiddleware(
        /**
         * @param {{
         *     params: { checkpointId: string }
         * }} req
         */
        async (req, res, next) => {
            // const users = await User.find({ checkpoints: [ req.params.checkpointId ]});
            const checkpoint = await Checkpoint.findOne({
                where: { id: req.params.checkpointId }
            });

            let competence = null;
            if (checkpoint !== null)
                competence = await Competence.findOne({ id: checkpoint.competence });

            await checkpoint.destroy();

            // users = users.map((u) => u.checkpoints = ) // TODO

            res.json({
                id: checkpoint.id,
                name: checkpoint.name,
                ...({ competence: competence === null ? null : await CompetenceDTO.create(competence) }),
                description: checkpoint.description,
                createdAt: checkpoint.createdAt
            });
        }
    )
);

// Получить список чекпоинтов активированных пользователем `userId`.
checkpointsRouter.get("/users/:userId/checkpoints",
    asyncMiddleware(
        async (req, res, next) => {
            const user = await User.findOne({ id: req.params.userId });
            const checkpoints = await Checkpoint.findAll({
                where: {
                    id: {
                        [Op.in]: user.checkpoints
                    }
                }
            });

            res.json(await Promise.all(
                checkpoints.map(async (c) => {
                    const competence = await Competence.findOne({ id: c.competence });

                    return {
                        id: c.id,
                        name: c.name,
                        ...({ competence: competence === null ? null : await CompetenceDTO.create(competence) }),
                        description: c.description,
                        createdAt: c.createdAt
                    }
                })
            ));
        }
    )
);

// Активировать чекпоинт `checkpointId` для пользователя `userId`.
checkpointsRouter.put("/users/:userId/checkpoints/:checkpointId",
    asyncMiddleware(
        async (req, res, next) => {
            const user = await User.findOne({ id: req.params.userId });
            const checkpoint = await Checkpoint.findOne({
                where: { id: req.params.checkpointId }
            });
            user.checkpoints.push(checkpoint.id);
            await user.save();

            let competence = null;
            if (checkpoint !== null)
                competence = await Competence.findOne({ id: checkpoint.competence });

            res.json({
                id: checkpoint.id,
                name: checkpoint.name,
                ...({ competence: competence === null ? null : await CompetenceDTO.create(competence) }),
                description: checkpoint.description,
                createdAt: checkpoint.createdAt
            });
        }
    )
);

export default checkpointsRouter;
