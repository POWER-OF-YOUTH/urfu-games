import axios from "axios";
import { Router, Request, Response, NextFunction } from "express";
import { asyncMiddleware } from "middleware-async";
import { body, param, query, validationResult } from "express-validator";
import { Op } from "sequelize";

import Game from "../domain/models/game";
import Progress from "../domain/models/progress";

const router = Router();

// https://api.urfugames.ru/games/{gameId}/progress
// https://api.urfugames.ru/users/{userId}/progress

// Сохранить прогресс пользователя в игре 'gameId'
router.post("/games/:gameId/progress",
    param("gameId")
        .isUUID(),
    body("user")
        .isUUID(),
    body("checkpointsCollected")
        .default(0)
        .isInt({ min: 0 }),
    body("data")
        .isJSON(),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty())
            next(validationErrors.array()[0]);

        // Проверяем существование игры
        try {
            await axios.get(`${process.env.MAIN_SERVICE_URI}/games/${req.params.gameId}`);
        }
        catch (err) {
            return next(new Error("Game not found. 404"));
        }

        // Проверяем существование пользователя
        try {
            await axios.get(`${process.env.MAIN_SERVICE_URI}/users/${req.body.user}`);
        }
        catch (err) {
            return next(new Error("User not found. 404"));
        }

        let game = await Game.findOne({ where: { id: req.params.gameId }});
        if (game === null) {
            game = await Game.create({
                id: req.params.gameId
            })
        }

        let progress = await Progress.findOne({ 
            where: { game: req.params.gameId, user: req.body.user }
        });
        if (progress === null) {
            progress = await Progress.create({ 
                user: req.body.user,
                game: req.params.gameId,
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
    })
);

// Получить информацию о прогрессе всех пользователей в игре.
// С помощью параметра запроса 'users', можно уточнить о каких пользователях мы хотим
// получить информацию
router.get("/games/:gameId/progress",
    param("gameId")
        .isUUID(),
    query("users")
        .optional()
        // Если поле 'users' не является массивом, то конвертируем
        .customSanitizer(users => Array.isArray(users) ? users : [users]),
    query("users.*")
        .isUUID(),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty())
            next(validationErrors.array()[0]);

        // Проверяем существование игры
        try {
            await axios.get(`${process.env.MAIN_SERVICE_URI}/games/${req.params.gameId}`);
        }
        catch (err) {
            return next(new Error("Game not found. 404"));
        }

        // Если передано поле 'users', необходимо проверить существование всех пользователей
        if (req.query.users !== undefined) {
            try {
                // @ts-ignore
                await Promise.all(req.query.users.map(u => 
                    axios.get(`${process.env.MAIN_SERVICE_URI}/users/${u}`)
                ));
            }
            catch (err) {
                return next(new Error("User not found. 404"));
            }
        }

        // @ts-ignore
        const progressAll = await Progress.findAll({ 
            where: { 
                game: req.params.gameId,
                ...(req.query.users !== undefined && {
                    // @ts-ignore
                    user: {
                        [Op.in]: req.query.users
                    }
                })
            }
        });

        // @ts-ignore
        res.json(progressAll.map(p => ({
            id: p.id,
            user: p.user,
            game: p.game,
            checkpointsCollected: p.checkpointsCollected,
            data: p.data
        })));
    })
);

// Удалить прогресс с идентификатором 'progressId'
router.delete("/games/:gameId/progress/:progressId",
    param(["gameId", "progressId"])
        .isUUID(),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty())
            next(validationErrors.array()[0]);

        // Проверяем существование игры
        try {
            await axios.get(`${process.env.MAIN_SERVICE_URI}/games/${req.params.gameId}`);
        }
        catch (err) {
            return next(new Error("Game not found. 404"));
        }

        const progress = await Progress.findOne({ 
            where: { id: req.params.progressId }
        });
        if (progress === null)
            return next(new Error("404"));

        res.json({
            id: progress.id,
            user: progress.user,
            game: progress.game,
            checkpointsCollected: progress.checkpointsCollected,
            data: progress.data
        });
    })
);

router.get("/users/:userId/progress", (req, res) => res.send("Coming soon!"));

export default router;
