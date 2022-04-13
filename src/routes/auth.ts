import strings from "../config/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { asyncMiddleware } from "middleware-async";
import { body } from "express-validator";
import { v4 as uuid } from "uuid";

import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { AccessError, LogicError } from "../utils/errors";
import { User, UserDocument } from "../domain/models/user";
import UserDTO from "../domain/dto/user-dto";

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
        if (await User.exists({ login: req.body.login }))
            return next(new LogicError(strings.errors.logic.userWithLoginAlreadyExists));

        if (await User.exists({ email: req.body.email }))
            return next(new LogicError(strings.errors.logic.userWithEmailAlreadyExists));

        req.body.password = User.encryptPassword(
            req.body.password, 
            <string> process.env.USER_PWD_SALT
        );

        await User.create({ 
            id: uuid(),
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        });

        res.json({});
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
        const user: UserDocument = await User.findByLogin(req.body.login);

        if (user === null) {
            return next(new LogicError(strings.errors.logic.userWithLoginNotExists));
        }

        req.body.password = User.encryptPassword(
            req.body.password, 
            <string> process.env.USER_PWD_SALT
        );

        if (req.body.password !== user.password)
            return next(new AccessError(strings.errors.access.passwordIncorrect));

        res.json({ access_token: user.generateJWT() });
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

        if (user === null)
            return next(new LogicError(strings.errors.logic.userWithIdNotExists));

        res.json(await UserDTO.create(user));
    })
);

export default authRouter;
