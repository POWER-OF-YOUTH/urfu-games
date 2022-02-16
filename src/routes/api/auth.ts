import strings from "../../config/api/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { asyncMiddleware } from "middleware-async";
import { body } from "express-validator";
import { v4 as uuid } from "uuid";

import sendResponse from "../../utils/send-response";
import validateRequest from "../../validators/validate-request";
import verifyToken from "../../validators/verify-token";
import { AccessError, LogicError } from "../../utils/errors";
import { User, UserDocument } from "../../domain/models/user";
import UserDTO from "../../domain/dto/user-dto";

const authRouter = express.Router();

authRouter.post("/signup", 
    validateRequest(
        body("login")
            .isString()
            .withMessage(strings.errors.validation.loginMustBeString)
            .trim()
            .notEmpty()
            .withMessage(strings.errors.validation.loginMustNotBeEmpty)
            .matches("^[0-9A-Za-z]+$")
            .withMessage(strings.errors.validation.loginNotMatchPattern + "^[0-9A-Za-z]+$."),
        body("email")
            .isEmail()
            .withMessage(strings.errors.validation.emailInvalid)
            .normalizeEmail(),
        body("password")
            .isString()
            .withMessage(strings.errors.validation.passwordMustBeString)
            .matches("^[0-9a-zA-Z_\\-@#%., ]+$")
            .withMessage(strings.errors.validation.passwordNotMatchPattern + "^[0-9a-zA-Z_\\-@#%., ]+$.")
            .isLength({ min: 6 })
            .withMessage(strings.errors.validation.passwordTooShort),
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (await User.exists({ login: req.data.login })) {
            return next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithLoginAlreadyExists
            ));
        }

        if (await User.exists({ email: req.data.email })) {
            return next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithEmailAlreadyExists
            ));
        }

        req.data.password = User.encryptPassword(
            req.data.password, 
            <string> process.env.USER_PWD_SALT
        );

        await User.create({ 
            id: uuid(),
            login: req.data.login,
            email: req.data.email,
            password: req.data.password
        });

        sendResponse(res, {});
    })
);

authRouter.post("/signin", 
    validateRequest(
        body("login")
            .isString()
            .withMessage(strings.errors.validation.loginMustBeString)
            .trim()
            .notEmpty()
            .withMessage(strings.errors.validation.loginMustNotBeEmpty)
            .matches("^[0-9A-Za-z]+$")
            .withMessage(strings.errors.validation.loginNotMatchPattern + "^[0-9A-Za-z]+$."),
        body("password")
            .isString()
            .withMessage(strings.errors.validation.passwordMustBeString)
            .matches("[0-9a-zA-Z_\\-@#%., ]+")
            .withMessage(strings.errors.validation.passwordNotMatchPattern + "[0-9a-zA-Z_\\-@#%., ]+.")
            .isLength({ min: 6 })
            .withMessage(strings.errors.validation.passwordTooShort),
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: UserDocument = await User.findByLogin(req.data.login);

        if (user === null) {
            return next(new LogicError(
                req.originalUrl,
                strings.errors.logic.userWithLoginNotExists
            ));
        }

        req.data.password = User.encryptPassword(
            req.data.password, 
            <string> process.env.USER_PWD_SALT
        );

        if (req.data.password !== user.password) {
            return next(new AccessError(
                req.originalUrl, 
                strings.errors.access.passwordIncorrect
            ));
        }

        sendResponse(res, { 
            access_token: user.generateJWT() 
        });
    })
);

authRouter.post("/check", 
    verifyToken, 
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: UserDocument = await User.findOne({ id: req.user.id });

        if (user === null) {
            return next(new LogicError(
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

export default authRouter;
