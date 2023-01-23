/**
 * @file Маршруты для регистрации/аутентификации пользователей.
 */

import strings from "../config/strings.json";

import express from "express";
import { asyncMiddleware } from "middleware-async";
import { body } from "express-validator";

import * as globals from "../globals";
import UserDTO from "../domain/dto/user-dto";
import sequelize from "../sequelize";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { AccessError, LogicError } from "../utils/errors";
import {
    User,
    createUser,
    encryptPassword,
    generateJWT
} from "../domain/models/user";

const authRouter = express.Router();

/** Регистрирует пользователя в системе. */
authRouter.post("/auth/signup",
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
            .matches("[0-9a-zA-Z_\\-@#%., ]+")
            .withMessage(strings.errors.validation.passwordNotMatchPattern + "[0-9a-zA-Z_\\-@#%., ]+.")
            .isLength({ min: 6 })
            .withMessage(strings.errors.validation.passwordTooShort)
    ),
    asyncMiddleware(
        /**
         * @param {{
         *     body: { email: string, login: string, password: string }
         * }} req
         */
        async (req, res) => {
            const user = await createUser(req.body);

            res.setHeader("Location", `${globals.API_URI}/users/${user.id}`);
            res.json(await UserDTO.create(user));
        }
    )
);

/** Позволяет получить JWT токен. */
authRouter.post("/auth/signin",
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
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findOne({
                    transaction,
                    where: { login: req.body.login },
                    rejectOnEmpty: new LogicError(strings.errors.logic.userWithLoginNotExists)
                });

                const password = encryptPassword(req.body.password, process.env.USER_PWD_SALT);
                if (password !== user.password)
                    throw new AccessError(strings.errors.access.passwordIncorrect);

                const token = generateJWT(user.id);
                const maxAge = 604800000; // one week
                res.cookie("access_token", token, { httpOnly: true, maxAge });
                res.cookie("logged_in", true);
                res.json({ access_token: token });
            });
        }
    )
);

/** Проверяет действительность JWT токена. */
authRouter.post("/auth/check",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.user.id,
                    {
                        transaction,
                        rejectOnEmpty: new LogicError(strings.errors.logic.userWithIdNotExists)
                    }
                );

                res.json(await UserDTO.create(user));
            });
        }
    )
);

authRouter.post("/auth/logout",
    (req, res) => {
        res.clearCookie("access_token");
        res.cookie("logged_in", false);
        res.sendStatus(200);
    }
);

export default authRouter;
export { authRouter, encryptPassword, generateJWT };
