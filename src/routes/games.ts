import strings from "../config/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import mongoose from "mongoose";
import { asyncMiddleware } from "middleware-async";
import { body, param, query } from "express-validator";
import { v4 as uuid } from "uuid";

import CommentDetailDTO from "../domain/dto/comment-detail-dto";
import CompetenceDTO from "../domain/dto/competence-dto";
import GameDetailDTO from "../domain/dto/game-detail-dto";
import RatingDetailDTO from "../domain/dto/rating-detail-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { Comment, CommentDocument } from "../domain/models/comment";
import { Competence, CompetenceDocument } from "../domain/models/competence";
import { Game, GameDocument } from "../domain/models/game";
import { LogicError, AccessError } from "../utils/errors";
import { Rating, RatingDocument } from "../domain/models/rating";
import { User, Role, UserDocument } from "../domain/models/user";
import Checkpoint from "../domain/models/checkpoint";
import sequelize from "../sequelize";

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
        if (!await Game.exists({ id: req.params.gameId }))
            return next(new LogicError("Игры с указанным id не существует."));
        next();
    })
);

// Добавить информацию об игре
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
            }),
        body("checkpoints")
            .default([])
            .isArray(),
        body("checkpoints.*.name")
            .isString()
            .notEmpty(),
        body("checkpoints.*.competence")
            .optional()
            .isUUID(),
        body("checkpoints.*.description")
            .default("")
            .isString()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const id: string = uuid();
        // @ts-ignore
        const game: GameDocument = await Game.create({ 
            id,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            author: req.user.id,
            participants: req.body.participants,
            createdAt: Date.now()
        });

        if (req.body.checkpoints.length > 0) {
            // Создадим чекпоинты
            await sequelize.transaction(async (transaction) => {
                await Promise.all(
                    // @ts-ignore
                    req.body.checkpoints.map((c) => Checkpoint.create({
                        ...c,
                        game: game.id
                    }, { transaction }))
                );
            });
        }

        res.json(await GameDetailDTO.create(game));
    })
);

// Получить информацию об игре с идентификатором `gameId`
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
        const game: GameDocument = await Game.findOne({ id: req.params.gameId });

        res.json(await GameDetailDTO.create(game));
    })
);

// Получить информацию о множестве игр.
// Параметр `start` задаёт индекс первого элемента в возвращаемом массиве,
// а параметр `count` - количество.
// Возвращаемые игры сортируются по дате создания.
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
            .skip(req.query.start)
            .limit(req.query.count);

        res.json(await Promise.all(
            games.map(g => GameDetailDTO.create(g))
        ));
    })
);

// Обновить информацию об игре с идентификатором `gameId`
gamesRouter.put("/:gameId", 
    verifyToken, 
    validateRequest(
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
        const game: GameDocument = await Game.findOne({ id: req.params.gameId });

        if (game.author !== req.user.id && req.user.role !== Role.Admin) 
            return next(new AccessError(req.originalUrl));

        const participants: Array<UserDocument> = await User.find({ 
            id: { $in: req.body.participants }
        });

        if (participants.length !== req.body.participants.length)
            return next(new LogicError("Один или несколько участников не найдены."));

        game.set(req.body);

        await game.save();

        const author: UserDocument = await game.getAuthor();

        res.json(await GameDetailDTO.create(
            game,
            author,
            participants
        ));
    })
);

// Удалить информацию об игре с идентификатором `gameId`
gamesRouter.delete("/:gameId",
    verifyToken, 
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ id: req.params.gameId });

        if (game.author !== req.user.id && req.user.role !== Role.Admin) 
            return next(new AccessError());

        // Удаляем комментарии, относящиеся к игре
        await Comment.deleteMany({ game: game.id }); 

        await Rating.deleteMany({ game: game.id });

        await game.delete();

        res.json(await GameDetailDTO.create(game));
    })
);

gamesRouter.use("/:gameId/comments/:commentId",
    validateRequest(
        param("commentId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (!await Comment.exists({ id: req.params.commentId }))
            return next(new LogicError("Комментарий с указанным id не существует."));
        next();
    })
);

gamesRouter.post("/:gameId/comments", 
    verifyToken, 
    validateRequest(
        body("text")
            .isString()
            .withMessage("Поле text должно быть строкой.")
            .isLength({ min: 1, max: 500 })
            .withMessage("Комментарий должен содержать от 1 до 500 символов.")
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const author: UserDocument = await User.findOne({ id: req.user.id });

        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const comment: CommentDocument = await game.comment(
            req.body.text, 
            author
        );

        await game.save();

        res.json(await CommentDetailDTO.create(comment));
    })
);

gamesRouter.get("/:gameId/comments/:commentId", 
    validateRequest(
        param("commentId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const comment: CommentDocument = await game.getComment(req.params.commentId);

        res.json(await CommentDetailDTO.create(comment));
    })
);

gamesRouter.get("/:gameId/comments/", 
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
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const comments: Array<CommentDocument> = await game.getComments(
            // @ts-ignore: Is integer!
            req.query.start,
            req.query.count
        );

        res.json(await Promise.all(
            comments.map(c => CommentDetailDTO.create(c))
        ));
    })
);

gamesRouter.put("/:gameId/comments/:commentId", 
    verifyToken,
    validateRequest(
        body("text")
            .isString()
            .withMessage("Поле text должно быть строкой.")
            .isLength({ min: 1, max: 500 })
            .withMessage("Комментарий должен содержать от 1 до 500 символов.")
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const comment: CommentDocument = await game.getComment(
            req.params.commentId
        );

        if (comment.author !== req.user.id)
            return next(new AccessError());

        comment.set({ text: req.body.text });

        await comment.save();

        res.json(await CommentDetailDTO.create(comment));
    })
);

gamesRouter.delete("/:gameId/comments/:commentId", 
    verifyToken,
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const comment: CommentDocument = await game.getComment(req.params.commentId);

        if (comment.author !== req.user.id && req.user.role !== Role.Admin)
            return next(new AccessError());

        await game.deleteComment(req.params.commentId);

        await game.save();

        res.json(await CommentDetailDTO.create(comment));

    })
);

// Промежуточная функция, которая проверят что компетенция с идентификатором
// `competenceId` действительно существует
gamesRouter.use("/:gameId/competencies/:competenceId", 
    validateRequest(
        param("competenceId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        if (!await Competence.exists({ id: req.params.competenceId }))
            return next(new LogicError("Компетенции с указанным id не существует."));
        next();
    })
);

// Привязать все компетенции, идентификаторы которых 
// указаны в параметре `id`, к игре
gamesRouter.post("/:gameId/competencies/", 
    verifyToken,
    validateRequest(
        body("id")
            .isArray(),
        body("id.*")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        if (game.author !== req.user.id && req.user.role !== Role.Admin)
            return next(new AccessError(req.originalUrl));

        const competencies: Array<CompetenceDocument> = await Competence.find({ 
            id: { $in: req.body.id }
        });

        if (competencies.length !== req.body.id.length)
            return next(new LogicError("Одна или несколько компетенций не найдены."));

        game.competencies = [];
        await game.addCompetencies(competencies);

        await game.save();

        res.json(await Promise.all(
            competencies.map(c => CompetenceDTO.create(c))
        ));
    })
);

// Получить информацию о привязанных к игре компетенциях 
gamesRouter.get("/:gameId/competencies/", 
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ id: req.params.gameId });

        const competencies: Array<CompetenceDocument> = await game.getCompetencies();

        res.json(await Promise.all(
            competencies.map(c => CompetenceDTO.create(c))
        ));
    }
));


// Отвязать компетенцию от игры с идентификатором `gameId`
gamesRouter.delete("/:gameId/competencies/", 
    verifyToken,
    validateRequest(
        body("id")
            .isArray(),
        body("id.*")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        if (game.author !== req.user.id && req.user.role !== Role.Admin)
            return next(new AccessError());

        const competencies: Array<CompetenceDocument> = await Competence.find({ 
            id: { $in: req.body.id }
        });

        if (competencies.length !== req.body.id)
            return next(new LogicError("Одна или несколько компетенций не найдены."));

        await Promise.all(competencies.map(c => game.removeCompetence(c)));

        await game.save();

        res.json(await Promise.all(
            competencies.map(c => CompetenceDTO.create(c))
        ));
    })
);

// Выставить оценку
gamesRouter.put("/:gameId/ratings/",
    verifyToken,
    validateRequest(
        body("value")
            .isNumeric() // TODO: Range check
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const author: UserDocument = await User.findOne({ 
            id: req.user.id 
        });

        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const rating: RatingDocument = await game.rate(req.body.value, author);

        await game.save();

        res.json(await RatingDetailDTO.create(rating));
    })
);

// Получить информацию о всех оценках игры
gamesRouter.get("/:gameId/ratings/", 
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
        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const ratings: Array<RatingDocument> = await game.getRatings(
            req.body.start, 
            req.body.count
        );

        res.json(await Promise.all(
            ratings.map(r => RatingDetailDTO.create(r))
        ));
    })
);

// Удалить оценку
gamesRouter.delete("/:gameId/ratings/",
    verifyToken,
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const author: UserDocument = await User.findOne({ 
            id: req.user.id 
        });

        const game: GameDocument = await Game.findOne({ 
            id: req.params.gameId 
        });

        const rating: RatingDocument = await game.getRating(author);

        if (rating === null)
            return next(new LogicError("Пользователь не оценивал игру."));

        await game.deleteRate(author);

        await game.save();

        res.json(await RatingDetailDTO.create(rating));
    })
);


export default gamesRouter;
