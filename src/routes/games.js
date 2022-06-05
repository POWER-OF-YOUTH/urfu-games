/**
 * @file Содержит маршруты для работы с играми.
 */

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body, query } from "express-validator";

import Game from "../domain/models/game";
import GameDetailDTO from "../domain/dto/game-detail-dto";
import sequelize from "../sequelize";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";

const gamesRouter = express.Router();

/** Добавляет информацию об игре. */
gamesRouter.post("/games/",
    verifyToken,
    validateRequest(
        body("name")
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов.")
            .matches("^[0-9A-Za-z ]+$")
            .withMessage("Название игры не соответсвует шаблону: ^[0-9A-Za-z ]+$"),
        body("description")
            .optional()
            .isString()
            .isLength({ min: 0, max: 500 }),
        body("image")
            .isURL(),
        body("participants")
            .isArray({ min: 1 }),
        body("participants.*.id")
            .isUUID(),
        body("participants.*.role")
            .isIn([0, 1]),
        body("competencies")
            .isArray({ min: 1 }),
        body("competencies.*")
            .isUUID(),
        body("checkpoints")
            .isArray({ min: 1 }),
        body("checkpoints.*.name")
            .isString()
            .notEmpty(),
        body("checkpoints.*.competence")
            .optional()
            .isUUID(),
        body("checkpoints.*.description")
            .default("")
            .isString(),
        body("loaderUrl")
            .isURL(),
        body("dataUrl")
            .isURL(),
        body("frameworkUrl")
            .isURL(),
        body("codeUrl")
            .isURL()
    ),
    asyncMiddleware(
        async (req, res) => {
            const transaction = await sequelize.transaction();

            try {
                const game = await Game.create({
                    name: req.body.name,
                    description: req.body.description,
                    image: req.body.image,
                    loaderUrl: req.body.loaderUrl,
                    dataUrl: req.body.dataUrl,
                    frameworkUrl: req.body.frameworkUrl,
                    codeUrl: req.body.codeUrl
                }, { transaction });
                await game.setCompetencies(
                    req.body.competencies,
                    { transaction }
                );
                await Promise.all(
                    req.body.checkpoints.map((c) =>
                        game.createCheckpoint(c, { transaction })
                    )
                );
                await Promise.all(
                    req.body.participants.map((p) =>
                        game.addParticipant(
                            p.id, 
                            { 
                                transaction, 
                                through: { role: p.role }
                            }
                        )
                    )
                );

                await transaction.commit();

                res.json(await GameDetailDTO.create(game));
            } 
            catch (err) {
                await transaction.rollback();

                throw err;
            }
        }
    )
);

/** Возвращает информацию об игре `gameId`. */
gamesRouter.get("/games/:gameId",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId, 
                    { transaction, rejectOnEmpty: true }
                );

                res.json(await GameDetailDTO.create(game));
            });
        }
    )
);

/** Возвращает информацию о множестве игр. */
gamesRouter.get("/games/",
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
                const games = await Game.findAll({
                    transaction,
                    offset: req.query.start, 
                    limit: req.query.count
                });

                res.json(await Promise.all(
                    games.map(g => GameDetailDTO.create(g))
                ));
            });       
        }
    )
);

/** Обновляет информацию об игре `gameId`. */
gamesRouter.put("/games/:gameId", 
    verifyToken,
    validateRequest(
        body("name")
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов.")
            .matches("^[0-9A-Za-z ]+$")
            .withMessage("Название игры не соответсвует шаблону: ^[0-9A-Za-z ]+$"),
        body("description")
            .optional()
            .isString()
            .isLength({ min: 0, max: 500 }),
        body("image")
            .isURL(),
        body("participants")
            .isArray({ min: 1 }),
        body("participants.*.id")
            .isUUID(),
        body("participants.*.role")
            .isIn([0, 1]),
        body("competencies")
            .isArray({ min: 1 }),
        body("competencies.*")
            .isUUID(),
        body("checkpoints")
            .isArray({ min: 1 }),
        body("checkpoints.*.name")
            .isString()
            .notEmpty(),
        body("checkpoints.*.competence")
            .optional()
            .isUUID(),
        body("checkpoints.*.description")
            .isString()
            .notEmpty(),
        body("loaderUrl")
            .isURL(),
        body("dataUrl")
            .isURL(),
        body("frameworkUrl")
            .isURL(),
        body("codeUrl")
            .isURL()
    ),
    asyncMiddleware( // TODO:
        async (req, res) => {
            const transaction = await sequelize.transaction();

            try {
                const game = await Game.findByPk(
                    req.params.gameId, 
                    { transaction, rejectOnEmpty: true }
                );
                await game.setCompetencies(
                    req.body.competencies,
                    { transaction }
                );
                await game.removeCheckpoints({ transaction })
                await Promise.all(
                    req.body.checkpoints.map((c) =>
                        game.createCheckpoint(c, { transaction })
                    )
                );
                await game.removeParticipants({ transaction });
                await Promise.all(
                    req.body.participants.map((p) =>
                        game.addParticipant(
                            p.id, 
                            { transaction, through: { role: p.role }}
                        )
                    )
                );

                await transaction.commit();

                res.json(await GameDetailDTO.create(game));
            }
            catch (err) {
                await transaction.rollback();

                throw err;
            }
        }
    )
);

/** 
 * Удаляет игру с идентификатором `gameId` 
 * и связанные с ней данные (оценки, комментарии и т.д.). 
 */
gamesRouter.delete("/games/:gameId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const game = await Game.findByPk(
                    req.params.gameId, 
                    { transaction, rejectOnEmpty: true }
                );

                /* TODO:
                if (game.author !== req.user.id && req.user.role !== Role.Admin) 
                    return next(new AccessError());
                */

                await game.destroy({ transaction });

                res.json(await GameDetailDTO.create(game));
            });
        }
    )
);

export default gamesRouter;
