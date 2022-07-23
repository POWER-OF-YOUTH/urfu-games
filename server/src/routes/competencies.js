/**
 * @file Содержит маршруты для работы с компетенциями.
 */

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import CompetenceDTO from "../domain/dto/competence-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import Game from "../domain/models/game";
import { AccessError } from "../utils/errors";
import Competence from "../domain/models/competence";
import User, { Role } from "../domain/models/user";
import sequelize from "../sequelize";
import * as globals from "../globals";

const competenciesRouter = express.Router();

/** Возвращает информацию о привязанных к игре `gameId` компетенциях. */
competenciesRouter.get("/games/:gameId/competencies/",
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
                const competencies = await game.getCompetencies({
                    transaction,
                    offset: req.query.start,
                    limit: req.query.count
                });

                res.json(await Promise.all(
                    competencies.map(c => CompetenceDTO.create(c))
                ));
            });
        }
    )
);

/** Создаёт компетенцию. */
competenciesRouter.post("/competencies/",
    verifyToken,
    validateRequest(
        body("name")
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов."),
        body("description")
            .isString()
            .isLength({ min: 1, max: 5000 })
            .withMessage("Описание должно содержать от 1 до 5000 символов.")
    ),
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.user.id,
                    { transaction, rejectOnEmpty: true }
                );
                if (user.role !== Role.Admin)
                    throw new AccessError();

                const competence = await Competence.create({
                    name: req.body.name,
                    description: req.body.description
                }, { transaction });

                res.setHeader("Location", `${globals.API_URI}/competencies/${competence.id}`);
                res.json(await CompetenceDTO.create(competence));
            });
        }
    )
);

/** Возвращает информацию о компетенции `competenceId`. */
competenciesRouter.get("/competencies/:competenceId",
    asyncMiddleware(
        async (req, res) => {
            const competence = await Competence.findByPk(
                req.params.competenceId,
                { transaction, rejectOnEmpty: true }
            );

            res.json(await CompetenceDTO.create(competence));
        }
    )
);

/** Возвращает информацию о множестве компетенций. */
competenciesRouter.get("/competencies/",
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
                const competencies = await Competence.findAll({
                    transaction,
                    offset: req.query.start,
                    limit: req.query.count
                });

                res.json(await Promise.all(
                    competencies.map(c => CompetenceDTO.create(c))
                ));
            });
        }
    )
);

/** Обновляет компетенцию `competenceId` */
competenciesRouter.put("/competencies/:competenceId",
    verifyToken,
    validateRequest(
        body("name")
            .optional()
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов."),
        body("description")
            .optional()
            .isString()
            .isLength({ min: 1, max: 5000 })
            .withMessage("Описание должно содержать от 1 до 5000 символов.")
    ),
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.user.id,
                    { transaction, rejectOnEmpty: true }
                );
                if (user.role !== Role.Admin)
                    throw new AccessError();

                const competence = await Competence.findByPk(
                    req.params.competenceId,
                    { transaction, rejectOnEmpty: true }
                );

                competence.set(req.body);
                await competence.save({ transaction });

                res.json(await CompetenceDTO.create(competence));
            });
        }
    )
);

/** Удаляет компетенцию `competenceId`. */
competenciesRouter.delete("/competencies/:competenceId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.user.id,
                    { transaction, rejectOnEmpty: true }
                );
                if (user.role !== Role.Admin)
                    throw new AccessError();

                const competence = await Competence.findByPk(
                    req.params.competenceId,
                    { transaction, rejectOnEmpty: true }
                );

                await competence.destroy({ transaction });

                res.json(await CompetenceDTO.create(competence));
            });
        }
    )
);

export default competenciesRouter;

