/**
 * @file Содержит маршруты для регистрации/аутентификации.
 */

import strings from "../config/strings.json";

import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";
import { asyncMiddleware } from "middleware-async";
import { body } from "express-validator";

import User from "../domain/models/user";
import UserDTO from "../domain/dto/user-dto";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { AccessError, LogicError } from "../utils/errors";
import { Op } from "sequelize";
import sequelize from "../sequelize";
import * as globals from "../globals";

const authRouter = express.Router();

/** Выполняет хеширование пароля. */
function encryptPassword(password, salt) {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
}

/** 
 * Генерирует JWT токен, который содержит поле `id` в качестве полезной нагрузки.
 * @param {string} id - идентификатор пользователя
 */
function generateJWT(id) {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );
}

/** Регистрирует пользователя в системе. */
authRouter.post("/auth/signup",
    asyncMiddleware(
        async (req, res) => {
            const transaction = await sequelize.transaction();

            try {
                let user = await User.findOne({
                    transaction,
                    where: {
                        [Op.or]: [{ login: req.body.login }, { email: req.body.email }]
                    }
                });
                if (user !== null) {
                    throw new LogicError(
                        "Пользователь с указанным `login` или `email` уже существует."
                    );
                }

                const password = encryptPassword(req.body.password, process.env.USER_PWD_SALT);
                user = await User.create({
                    login: req.body.login,
                    email: req.body.email,
                    password
                }, { transaction });

                await transaction.commit();

                res.setHeader("Location", `${globals.API_URI}/users/${user.id}`);
                res.json(await UserDTO.create(user));
            }
            catch (err) {
                await transaction.rollback();

                throw err;
            }
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
                    rejectOnEmpty: new LogicError(
                        strings.errors.logic.userWithLoginNotExists
                    ) 
                });

                const password = encryptPassword(req.body.password, process.env.USER_PWD_SALT);
                if (password !== user.password)
                    throw new AccessError(strings.errors.access.passwordIncorrect);

                res.json({ access_token: generateJWT(user.id) });
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

export default authRouter;
export { authRouter, encryptPassword, generateJWT };
