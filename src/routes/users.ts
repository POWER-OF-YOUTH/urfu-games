import strings from "../config/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { body, param, query } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import UserDTO from "../domain/dto/user-dto";
import sendResponse from "../utils/send-response";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { AccessError, LogicError } from "../utils/errors";
import { User, UserDocument } from "../domain/models/user";

const usersRouter = express.Router();

usersRouter.use("/:userId", 
    validateRequest(
        param("userId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (!await User.exists({ id: req.params.userId })) {
            return next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithIdNotExists
            ));
        }
        next();
    })
);

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

        if (req.query.id !== undefined) {
            // @ts-ignore
            users = await User.find({
                id: { $in: req.query.id }
            });
        }
        else {
            users = await User.find()
                .sort("createdAt")
                .skip(req.query.start)
                .limit(req.query.count)
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
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: UserDocument = await User.findOne({ id: req.params.userId });

        sendResponse(
            res,
            await UserDTO.create(user)
        );
    })
);

usersRouter.put("/:userId", 
    verifyToken, 
    validateRequest(
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
        const user: UserDocument = await User.findOne({ id: req.params.userId });

        if (user.id !== req.user.id)
            return next(new AccessError(req.originalUrl));

        if (req.body.name !== undefined)
            user.set({ name: req.body.name });

        if (req.body.surname !== undefined)
            user.set({ surname: req.body.name });

        if (req.body.patronymic !== undefined)
            user.set({ patronymic: req.body.patronymic });

        await user.save();

        sendResponse(
            res,
            await UserDTO.create(user)
        );
    })
);

export default usersRouter;
