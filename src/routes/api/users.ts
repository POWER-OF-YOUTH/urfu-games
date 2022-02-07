import strings from "../../../config/api/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { body, param, query } from "express-validator";
import { asyncMiddleware } from "middleware-async";
import { v4 as uuid } from "uuid";

import validateRequest from "../../validators/validate-request";
import verifyToken from "../../validators/verify-token";
import sendResponse from "../../utils/send-response";
import { User, UserDocument } from "../../domain/models/user";
import UserDTO from "../../domain/dto/user-dto";
import { AccessError, LogicError } from "../../utils/errors";

const usersRouter = express.Router();

usersRouter.get("/", 
    validateRequest(
        query("id")
            .optional()
            .customSanitizer(id => {
                if (!Array.isArray(id))
                    return [ id ];
                return id;
            }),
        query("id.*")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        let users: Array<UserDocument> = [];

        if (req.data.id !== undefined)
            users = await User.find({id: {$in: req.data.id}});
        else
            users = await User.find();

        sendResponse(
            res,
            users.map(u => UserDTO.create(u))
        );
    })
);

usersRouter.get("/:userId", 
    validateRequest(
        param("userId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: UserDocument = await User.findOne({ id: req.data.userId });

        if (user === null) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithIdNotExists
            ));
        }

        sendResponse(
            res,
            UserDTO.create(user)
        );
    })
);

usersRouter.put("/:userId", 
    verifyToken, 
    validateRequest(
        param("userId")
            .isUUID(),
        body("name")
            .optional()
            .isLength({ min: 0, max: 50 }),
        body("surname")
            .optional()
            .isLength({ min: 0, max: 50 }),
        body("patronymic")
            .optional()
            .isLength({ min: 0, max: 50 }),
        body("email")
            .optional()
            .isEmail()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: UserDocument = await User.findOne({ id: req.data.userId });

        if (user === null) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithIdNotExists
            ));
        }

        if (user.id !== req.user.id)
            next(new AccessError(req.originalUrl));

        user.set({
            name: req.data.name,
            surname: req.data.surname,
            patronymic: req.data.patronymic,
            email: req.data.email
        });

        await user.save();

        sendResponse(
            res,
            UserDTO.create(user)
        );
    })
);

export default usersRouter;
