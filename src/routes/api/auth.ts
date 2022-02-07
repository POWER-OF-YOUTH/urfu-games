import strings from "../../../config/api/strings.json";

import express, { Request, Response, NextFunction } from "express";
import { asyncMiddleware } from "middleware-async";
import { body } from "express-validator";
import { v4 as uuid } from "uuid";

import { AccessError, LogicError } from "../../utils/errors";
import sendResponse from "../../utils/send-response";
import verifyToken from "../../validators/verify-token";
import validateRequest from "../../validators/validate-request";
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
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithLoginAlreadyExists
            ));
        }

        if (await User.exists({ email: req.data.email })) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithEmailAlreadyExists
            ));
        }

        req.data.password = User.encryptPassword(
            req.data.password, 
            <string> process.env.USER_PWD_SALT
        );

        const user: UserDocument = await User.create({ 
            id: uuid(),
            login: req.data.login,
            email: req.data.email,
            password: req.data.password
        });

        sendResponse(res, { 
            user: UserDTO.create(user) 
        });
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
        req.data.password = User.encryptPassword(
            req.data.password, 
            <string> process.env.USER_PWD_SALT
        );

        const user: UserDocument = await User.findByLogin(req.data.login);

        if (user === null) {
            next(new LogicError(
                req.originalUrl,
                strings.errors.logic.userWithLoginNotExists
            ));
        }

        if (req.data.password !== user.password) {
            next(new AccessError(
                req.originalUrl, 
                strings.errors.access.passwordIncorrect
            ));
        }

        sendResponse(res, { 
            user: UserDTO.create(user), 
            token: user.generateJWT() 
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
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.userWithIdNotExists
            ));
        }

        sendResponse(res, { 
            user: UserDTO.create(user) 
        });
    })
);

export default authRouter;
