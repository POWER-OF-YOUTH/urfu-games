/**
 * @file Маршруты для работы с играми.
 */

import express from "express";
import { Op } from "sequelize";
import { asyncMiddleware } from "middleware-async";
import { body, param, query } from "express-validator";

import * as globals from "../globals.js";
import Competence from "../domain/models/competence";
import GameDetailDTO from "../domain/dto/game-detail-dto";
import LogicError from "../utils/errors/logic_error";
import User from "../domain/models/user";
import sequelize from "../sequelize";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import {
    Game,
    createGame,
    deleteGame,
    updateGame
} from "../domain/models/game";
import { ParticipantRole } from "../domain/models/game-participants";

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
            .matches(`^${globals.FILES_URI}.+$`),
        body("participants")
            .default([])
            .isArray(),
        body("participants.*.id")
            .isUUID(),
        body("participants.*.role")
            .isIn([ParticipantRole.Participant]),
        body("competencies")
            .isArray(),
        body("competencies.*")
            .isUUID(),
        body("checkpoints")
            .isArray(),
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
            .matches(`^${globals.FILES_URI}.+$`),
        body("dataUrl")
            .matches(`^${globals.FILES_URI}.+$`),
        body("frameworkUrl")
            .matches(`^${globals.FILES_URI}.+$`),
        body("codeUrl")
            .matches(`^${globals.FILES_URI}.+$`),
    ),
    asyncMiddleware(
        async (req, res) => {
            const initiator = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            const author = initiator;
            const participantsIds = req.body.participants.map((p) => p.id);
            const participants = await User.findAll({
                where: {
                    id: {
                        [Op.in]: participantsIds
                    }
                }
            });
            const competencies = [];
            const competenciesMap = new Map();
            (await Competence.findAll({
                where: {
                    id: {
                        [Op.in]: req.body.competencies
                    }
                }
            })).forEach((c) => {
                competencies.push(c);
                competenciesMap.set(c.id, c)
            });
            req.body.checkpoints.forEach(
                (c) => c.competence = competenciesMap[c.competence] // replace competence id to competence object
            );

            const game = await createGame(
                initiator,
                author,
                participants,
                competencies,
                req.body
            );

            res.setHeader("Location", `${globals.API_URI}/games/${game.id}`);
            res.json(await GameDetailDTO.create(game));
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
            .toInt(),
        query("isPublicated")
            .default(true)
            .toBoolean()
    ),
    asyncMiddleware(
        async (req, res) => {
            const games = await Game.findAll({
                offset: req.query.start,
                limit: req.query.count,
                where:
                {
                    isPublicated: req.query.isPublicated
                }
            });

            res.json(await Promise.all(games.map(g => GameDetailDTO.create(g))));
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
            .default([])
            .isArray(),
        body("participants.*")
            .isUUID(),
        body("competencies")
            .isArray(),
        body("competencies.*")
            .isUUID(),
        body("checkpoints")
            .isArray(),
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
    asyncMiddleware(
        /**
         * @param {{
         *     params: { gameId: string },
         *     body: any,
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res) => {
            const initiator = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            const game = await Game.findByPk(req.params.gameId, { rejectOnEmpty: true });
            const participantsIds = req.body.participants.map((p) => p.id);
            const participants = await User.findAll({
                where: {
                    id: {
                        [Op.in]: participantsIds
                    }
                }
            });
            const competencies = [];
            const competenciesMap = new Map();
            (await Competence.findAll({
                where: {
                    id: {
                        [Op.in]: req.body.competencies
                    }
                }
            })).forEach((c) => {
                competencies.push(c);
                competenciesMap.set(c.id, c)
            });
            req.body.checkpoints = req.body.checkpoints.forEach(
                (c) => c.competence = competenciesMap[c.competence] // replace competence id to competence object
            );

            await updateGame(initiator, game, participants, competencies, req.body);

            res.setHeader("Location", `${globals.API_URI}/games/${game.id}`);
            res.json(await GameDetailDTO.create(game));
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
        /**
         * @param {{
         *     params: { gameId: string },
         *     user: { id: string, role: number }
         * }} req
         */
        async (req, res) => {
            const initiator = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            const game = await Game.findByPk(
                req.params.gameId,
                { rejectOnEmpty: true }
            );

            await deleteGame(initiator, game);

            res.json(await GameDetailDTO.create(game));
        }
    )
);

gamesRouter.get("/users/:userId/games/",
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
         *     user: { id: string, role: number },
         *     query: { start: number, count: number }
         * }} req
        */
        async (req, res) => {
            const user = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            const games = await user.getGames({
                offset: req.query.start,
                limit: req.query.limit
            });

            res.json(await Promise.all(games.map((g) => GameDetailDTO.create(g))));
        }
    )
);

export default gamesRouter;

