import strings from "../../../../config/api/strings.json";

import express, {
    Request,
    Response,
    NextFunction
} from "express";
import { body, param } from "express-validator";
import { asyncMiddleware } from "middleware-async";
import { v4 as uuid } from "uuid";

import validateRequest from "../../../validators/validate-request";
import verifyToken from "../../../validators/verify-token";
import { AccessError, LogicError } from "../../../utils/errors";
import { Comment, CommentDocument } from "../../../domain/models/comment";
import CommentDetailDTO from "../../../domain/dto/comment-detail-dto";
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
        const author = await User.findOne({ id: req.user.id });

        if (author === null) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithIdNotExists
            ));
        }
        
        const comment: CommentDocument = await Comment.create({
            id: uuid(),
            text: req.data.text,
            game: req.data.gameId,
            author: author.id,
            createdAt: Date.now()
        })

        res.json(CommentDetailDTO.create(comment, author));
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
        const comment: CommentDocument = await Comment.findOne({ 
            id: req.data.commentId,
            game: req.data.gameId
        });

        if (comment === null)
            next(new LogicError(req.originalUrl, "Комментарий с указанным id не найден."));

        res.json(CommentDetailDTO.create(comment));
    })
);

commentsRouter.get("/", 
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const comments: Array<CommentDocument> = await Comment.find({ 
            game: req.data.gameId 
        });

        res.json(comments.map(c => CommentDetailDTO.create(c)));
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
        const comment: CommentDocument = await Comment.findOne({ 
            id: req.data.commentId,
            game: req.data.gameId
        });

        if (comment.author !== req.user.id)
            next(new AccessError(req.originalUrl));

        comment.set({ text: req.data.text });

        await comment.save();

        res.json(CommentDetailDTO.create(comment));
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
        const comment: CommentDocument = await Comment.findOne({ 
            id: req.data.commentId,
            game: req.data.gameId
        });

        if (comment.author !== req.user.id && req.user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));

        await comment.delete();

        res.json(CommentDetailDTO.create(comment));
    })
);

export default commentsRouter;
