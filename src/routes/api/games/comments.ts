import strings from "../../../../config/api/strings.json";

import express, {
    Request,
    Response,
    NextFunction
} from "express";
import { body, param, query } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import CommentDetailDTO from "../../../domain/dto/comment-detail-dto";
import sendResponse from "../../../utils/send-response";
import validateRequest from "../../../validators/validate-request";
import verifyToken from "../../../validators/verify-token";
import { AccessError, LogicError } from "../../../utils/errors";
import { Comment, CommentDocument } from "../../../domain/models/comment";
import { Game, GameDocument } from "../../../domain/models/game";
import { User, UserDocument, Role } from "../../../domain/models/user";

const commentsRouter = express.Router();

commentsRouter.post("/", 
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
            id: req.data.gameId 
        });

        const comment: CommentDocument = await game.comment(
            req.data.text, 
            author
        );

        await game.save();

        sendResponse(
            res,
            await CommentDetailDTO.create(comment)
        );
    })
);

commentsRouter.get("/:commentId", 
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
            id: req.data.gameId 
        });

        const comment: CommentDocument = await game.getComment(req.data.commentId);

        if (comment === null) {
            next(new LogicError(
                req.originalUrl,
                "Комментарий с указанным id не существует."
            ));
        }

        sendResponse(
            res,
            await CommentDetailDTO.create(comment)
        );
    })
);

commentsRouter.get("/", 
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
            id: req.data.gameId 
        });

        const comments: Array<CommentDocument> = await game.getComments(
            req.data.start,
            req.data.count
        );

        sendResponse(
            res,
            await Promise.all(
                comments.map(c => CommentDetailDTO.create(c))
            )
        );
    })
);

commentsRouter.put("/:commentId", 
    verifyToken,
    validateRequest(
        param("commentId")
            .isUUID(),
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
            id: req.data.gameId 
        });

        const comment: CommentDocument = await game.getComment(
            req.data.commentId
        );

        if (comment.author !== req.user.id)
            next(new AccessError(req.originalUrl));

        comment.set({ text: req.data.text });

        await comment.save();

        sendResponse(
            res,
            await CommentDetailDTO.create(comment)
        );
    })
);

commentsRouter.delete("/:commentId", 
    verifyToken,
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
            id: req.data.gameId 
        });

        const comment: CommentDocument = await game.getComment(req.data.commentId);

        if (comment.author !== req.user.id && req.user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));

        await game.deleteComment(req.data.commentId);

        await game.save();

        sendResponse(
            res,
            await CommentDetailDTO.create(comment)
        );

    })
);

export default commentsRouter;
