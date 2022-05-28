import strings from "../config/strings.json";

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, param, query } from "express-validator";

import CompetenceDTO from "../domain/dto/competence-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import Game from "../domain/models/game";
import { AccessError, LogicError } from "../utils/errors";
import Competence from "../domain/models/competence";
import User, { Role } from "../domain/models/user";
import sequelize from "../sequelize";

const competenciesRouter = express.Router();

// Получить информацию о привязанных к игре компетенциях 
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

                res.json(await CompetenceDTO.create(competence));
            });
        }
    )
);

competenciesRouter.get("/competencies/:competenceId",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const competence = await Competence.findByPk(
                    req.params.competenceId,
                    { transaction, rejectOnEmpty: true }
                );

                res.json(await CompetenceDTO.create(competence));
            });
        }
    )
);

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

