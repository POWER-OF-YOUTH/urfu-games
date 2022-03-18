import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import fs from "fs";
import path from "path";
import { asyncMiddleware } from "middleware-async";
import { body, param, query } from "express-validator";
import { v4 as uuid } from "uuid";

import GameDetailDTO from "../../../domain/dto/game-detail-dto";
import commentsRouter from "./comments";
import gameCompetenciesRouter from "./competencies";
import ratingsRouter from "./ratings";
import sendResponse from "../../../utils/send-response";
import validateRequest from "../../../validators/validate-request";
import verifyToken from "../../../validators/verify-token";
import { Comment } from "../../../domain/models/comment";
import { Game, GameDocument } from "../../../domain/models/game";
import { LogicError, AccessError } from "../../../utils/errors";
import { User, Role, UserDocument } from "../../../domain/models/user";

const gamesRouter = express.Router();

gamesRouter.use("/:gameId",
    validateRequest(
        param("gameId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (!await Game.exists({ id: req.data.gameId })) {
            return next(new LogicError(
                req.originalUrl, 
                "Игры с указанным id не существует."
            ));
        }
        next();
    })
);

gamesRouter.use("/:gameId/comments", commentsRouter);

gamesRouter.use("/:gameId/competencies", gameCompetenciesRouter);

gamesRouter.use("/:gameId/ratings", ratingsRouter);

gamesRouter.post("/", 
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
            .optional()
            .isURL(),
        body("participants")
            .default([])
            .isArray(),
        body("participants.*")
            .isUUID()
            .custom((id: string, { req }) => {
                if (id === req.user.id) {
                    return Promise.reject(
                        new Error("Пользователь не может быть автором и участником одновременно.")
                    );
                }
                return Promise.resolve();
            })
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const author: UserDocument = await User.findOne({ id: req.user.id });

        const participants: Array<UserDocument> = await User.find({ 
            id: { $in: req.data.participants }
        });

        if (participants.length !== req.data.participants.length) {
            return next(new LogicError(
                req.originalUrl, 
                "Один или несколько участников не найдены."
            ));
        }

        const id: string = uuid();
        const game: GameDocument = await Game.create({ 
            id,
            name: req.data.name,
            description: req.data.description,
            image: req.data.image,
            author: author.id,
            participants: participants.map(p => p.id),
            createdAt: Date.now()
        });

        sendResponse(
            res, 
            await GameDetailDTO.create(
                game, 
                author, 
                participants
            )
        );
    })
);

gamesRouter.get("/:gameId", 
    validateRequest(
        param("gameId")
            .isUUID(),
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ id: req.data.gameId });

        sendResponse(
            res, 
            await GameDetailDTO.create(game)
        );
    })
);

gamesRouter.get("/", 
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
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const games: Array<GameDocument> = await Game.find()
            .sort("createdAt")
            .skip(req.data.start)
            .limit(req.data.count);

        sendResponse(
            res,
            await Promise.all(
                games.map(g => GameDetailDTO.create(g))
            )
        );
    })
);

gamesRouter.put("/:gameId", 
    verifyToken, 
    validateRequest(
        param("gameId")
            .isUUID(),
        body("name")
            .optional()
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов.")
            .matches("[0-9A-Za-z]+")
            .withMessage("Название игры не соответсвует шаблону: [0-9A-Za-z]+"),
        body("description")
            .optional()
            .isString()
            .isLength({ min: 0, max: 500 }),
        body("image")
            .optional()
            .isString(),
        body("loaderUrl")
            .optional()
            .isString(),
        body("dataUrl")
            .optional()
            .isString(),
        body("frameworkUrl")
            .optional()
            .isString(),
        body("codeUrl")
            .optional()
            .isString(),
        body("participants")
            .default([])
            .isArray(),
        body("participants.*")
            .isUUID()
            .custom((id: string, { req }) => {
                if (id === req.user.id) {
                    return Promise.reject(
                        new Error("Пользователь не может быть автором и участником одновременно.")
                    );
                }
                return Promise.resolve();
            }),
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ id: req.data.gameId });

        if (game.author !== req.user.id && req.user.role !== Role.Admin) 
            return next(new AccessError(req.originalUrl));

        const participants: Array<UserDocument> = await User.find({ id: { $in: req.data.participants }});

        if (participants.length !== req.data.participants.length) {
            return next(new LogicError(
                req.originalUrl, 
                "Один или несколько участников не найдены."
            ));
        }

        game.set(req.body);

        await game.save();

        const author: UserDocument = await game.getAuthor();

        sendResponse(
            res,
            await GameDetailDTO.create(
                game,
                author,
                participants
            )
        );
    })
);

gamesRouter.delete("/:gameId",
    verifyToken, 
    validateRequest(
        param("gameId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ id: req.data.gameId });

        if (game.author !== req.user.id && req.user.role !== Role.Admin) 
            return next(new AccessError(req.originalUrl));

        // Удаляем комментарии, относящиеся к игре
        await Comment.deleteMany({ game: game.id }); 

        await game.delete();

        sendResponse(
            res, 
            await GameDetailDTO.create(game)
        );
    })
);

export default gamesRouter;

/*
export const uploadGame = [
    async (req: Request, res: Response, next: NextFunction) => {
        if (!Game.exists({ id: req.params.id })) {
            res.status(422).json({ errors: [ 
                new LogicError(req.originalUrl, "Игры с указанным id не существует.") 
            ]});
        }
        else
            next();
    },
    multer({ 
        storage: 
            diskStorage({
                destination(req: Request, file: Express.Multer.File, cb: (error: Error, destination: string) => void) {
                    const directory: string = path.join("/public", process.env.PUBLIC_GAMES_SUBDIR, req.params.id);

                    // Создадим директорию, если её не существует
                    if (!fs.existsSync(directory)) 
                        fs.mkdirSync(directory, { recursive: true });

                    cb(null, directory);
                },
                filename(req: Request, file: Express.Multer.File, cb: (error: Error, filename: string) => void) {
                    cb(null, file.originalname);
                }
            })
    })
        .array("files", 50),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.files.length === 0) {
                res.status(400).json({ errors: [
                    new LogicError(req.originalUrl, "Ни одного файла не было загружено.")
                ]});
            }
            else {
                const gameDocument: HydratedDocument<IGamePopulated> = await Game.findOne({ id: req.params.id });
    
                const filesLoaded: Array<string> = [];
                for (const file of <Array<Express.Multer.File>> req.files)
                    filesLoaded.push(file.originalname);
    
                gameDocument.uploaded = true; 
    
                await gameDocument.save();
    
                res.json({ filesLoaded });
            }
        }
        catch (err) {
            next(err);
        }
    }
];
*/
