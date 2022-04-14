import strings from "../config/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { asyncMiddleware } from "middleware-async";
import { query } from "express-validator";

import GameSearchResultDTO from "../domain/dto/game-search-result-dto";
import UserSearchResultDTO from "../domain/dto/user-search-result-dto";
import validateRequest from "../validators/validate-request";
import { Game, GameDocument } from "../domain/models/game";
import { User, UserDocument } from "../domain/models/user";

const searchRouter = express.Router();

searchRouter.get("/users",
    validateRequest(
        query("q")
            .isString()
            .matches("^[a-zA-Z0-9 ]+$"),
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
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const users: Array<UserDocument> = await User
            .find({ login: { $regex: `^${req.query.q}.*$`, $options: "i" }})
            // @ts-ignore
            .sort({ [req.query.sort]: req.query.order === "ascending" ? 1 : -1 })
            .skip(req.query.start)
            .limit(req.query.count);

        res.json(await Promise.all(users.map(u => UserSearchResultDTO.create(u))));
    })
)

searchRouter.get("/games",
    validateRequest(
        query("q")
            .isString()
            .matches("^[a-zA-Zа-я0-9 ]+$"),
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
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const games: Array<GameDocument> = await Game 
            .find({ name: { $regex: `^${req.query.q}.*$`, $options: "i" }})
            // @ts-ignore
            .sort({ [req.query.sort]: req.query.order === "ascending" ? 1 : -1 })
            .skip(req.query.start)
            .limit(req.query.count);

        res.json(await Promise.all(games.map(g => GameSearchResultDTO.create(g))))
    })
)

export default searchRouter;
