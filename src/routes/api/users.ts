import strings from "../../config/api/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { body, param, query } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import UserDTO from "../../domain/dto/user-dto";
import sendResponse from "../../utils/send-response";
import validateRequest from "../../validators/validate-request";
import verifyToken from "../../validators/verify-token";
import { AccessError, LogicError } from "../../utils/errors";
import { User, UserDocument } from "../../domain/models/user";

const usersRouter = express.Router();

usersRouter.get("/", 
    validateRequest(
        query("id")
            .optional()
            .isArray(),
        query("id.*") // TODO: length constraint?
            .isUUID(),
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
        let users: Array<UserDocument> = [];

        if (req.data.id !== undefined)
            users = await User.find({id: {$in: req.data.id}});
        else {
            users = await User.find()
                .sort("createdAt")
                .skip(req.data.start)
                .limit(req.data.count)
        }

        sendResponse(
            res,
            await Promise.all(
                users.map(u => UserDTO.create(u))
            )
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
            await UserDTO.create(user)
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

        if (req.data.name !== undefined)
            user.set({ name: req.data.name });

        if (req.data.surname !== undefined)
            user.set({ surname: req.data.name });

        if (req.data.patronymic !== undefined)
            user.set({ patronymic: req.data.patronymic });

        await user.save();

        sendResponse(
            res,
            await UserDTO.create(user)
        );
    })
);

export default usersRouter;
