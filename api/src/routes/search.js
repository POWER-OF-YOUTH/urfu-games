/**
 * @file Содержит маршруты для работы поиска.
 */

import express  from "express";
import { Op } from "sequelize";
import { asyncMiddleware } from "middleware-async";
import { query } from "express-validator";

import CompetenceDTO from "../domain/dto/competence-dto";
import GameSearchResultDTO from "../domain/dto/game-search-result-dto";
import UserSearchResultDTO from "../domain/dto/user-search-result-dto";
import validateRequest from "../validators/validate-request";
import Competence from "../domain/models/competence";
import Game from "../domain/models/game";
import User from "../domain/models/user";

const searchRouter = express.Router();

/** Выполняет поиск пользователей по логину. */
searchRouter.get("/search/users",
    validateRequest(
        query("q")
            .isString()
            .matches("^[a-zA-Z0-9 ]*$"),
        query("start")
            .default(0)
            .isInt({ gt: -1 })
            .toInt(),
        query("count")
            .default(10)
            .isInt({ gt: 0, lt: 100 })
            .toInt(),
        query("sort")
            .default("createdAt")
            .isIn(["name", "login", "email", "createdAt"]),
        query("order")
            .default("ascending")
            .isIn(["ascending", "descending"])
    ),
    asyncMiddleware(
        async (req, res) => {
            const users = await User.findAll({
                where: {
                    login: {
                        [Op.iRegexp]: `^${req.query.q}.*$`
                    }
                },
                offset: req.query.start,
                limit: req.query.count,
                order: [[req.query.sort, req.query.order === "ascending" ? "ASC" : "DESC"]]
            })

            res.json(await Promise.all(users.map(u => UserSearchResultDTO.create(u))));
        }
    )
);

/** Выполняет поиск игр по названию. */
searchRouter.get("/search/games",
    validateRequest(
        query("q")
            .isString()
            .matches("^[a-zA-Zа-яА-Я0-9 ]*$"),
        query("start")
            .default(0)
            .isInt({ gt: -1 })
            .toInt(),
        query("count")
            .default(10)
            .isInt({ gt: 0, lt: 100 })
            .toInt(),
        query("sort")
            .default("createdAt")
            .isIn(["name", "rating", "createdAt"]),
        query("order")
            .default("ascending")
            .isIn(["ascending", "descending"])
    ),
    asyncMiddleware(
        async (req, res) => {
            const games = await Game.findAll({
                where: {
                    name: {
                        [Op.iRegexp]: `^${req.query.q}.*$`
                    }
                },
                offset: req.query.start,
                limit: req.query.count,
                order: [[req.query.sort, req.query.order === "ascending" ? "ASC" : "DESC"]]
            })

            res.json(await Promise.all(games.map(g => GameSearchResultDTO.create(g))))
        }
    )
);

/** Выполняет поиск компетенций по названию. */
searchRouter.get("/search/competencies/",
    validateRequest(
        query("q")
            .isString()
            .matches("^[a-zA-Zа-яА-Я0-9 ]*$"),
        query("start")
            .default(0)
            .isInt({ gt: -1 })
            .toInt(),
        query("count")
            .default(10)
            .isInt({ gt: 0, lt: 100 })
            .toInt(),
        query("sort")
            .default("createdAt")
            .isIn(["name", "createdAt"]),
        query("order")
            .default("ascending")
            .isIn(["ascending", "descending"])
    ),
    asyncMiddleware(
        async (req, res) => {
            const competencies = await Competence.findAll({
                where: {
                    name: {
                        [Op.iRegexp]: `^${req.query.q}.*$`
                    }
                },
                offset: req.query.start,
                limit: req.query.count,
                order: [[req.query.sort, req.query.order === "ascending" ? "ASC" : "DESC"]]
            })

            res.json(await Promise.all(
                competencies.map(c => CompetenceDTO.create(c))
            ));
        }
    )
);

export default searchRouter;
