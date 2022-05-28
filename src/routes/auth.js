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

const authRouter = express.Router();

function encryptPassword(password, salt) {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
}

function generateJWT(id) {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );
}

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
            .matches("^[0-9a-zA-Z_\\-@#%., ]+$")
            .withMessage(strings.errors.validation.passwordNotMatchPattern + "^[0-9a-zA-Z_\\-@#%., ]+$.")
            .isLength({ min: 6 })
            .withMessage(strings.errors.validation.passwordTooShort),
    ),
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
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

                res.json(await UserDTO.create(user));
            });
        }
    )
);

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
