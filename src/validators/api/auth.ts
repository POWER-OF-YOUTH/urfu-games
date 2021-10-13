import { body } from "express-validator";
import { Request } from "express";

import { User } from "../../models/user";
import requestValidator from "../request_validator";

const signUp = [
    body("login")
        .isString()
        .withMessage("Логин должен быть строкой.")
        .notEmpty()
        .withMessage("Логин не должен быть пустым")
        .matches("[0-9A-Za-z]+")
        .withMessage("Логин не соответствует указанному шаблону: [0-9A-Za-z]+")
        .custom(async (login: string) => {
            if (await User.exists({ login }))
                throw new Error("Пользователь с указанным login уже существует.");
        }),
    body("email")
        .isEmail()
        .withMessage("Email недействителен.")
        .normalizeEmail()
        .custom(async (email: string) => {
            if (await User.exists({ email }))
                throw new Error("Пользователь с указанным email уже существует.");
        }),
    body("password")
        .isString()
        .withMessage("Пароль должен быть строкой.")
        .matches("[0-9a-zA-Z_\\-@#%., ]+")
        .withMessage("Пароль не соответствует указанному шаблону: [0-9a-zA-Z_\\-@#%., ]+")
        .isLength({ min: 6 })
        .withMessage("Минимальная длинна пароля — 6 символов."),
    requestValidator
];

const signIn = [
    body("login")
        .isString()
        .withMessage("Логин должен быть строкой.")
        .notEmpty()
        .withMessage("Логин не должен быть пустым")
        .custom(async (login: string) => {
            if (!await User.exists({ login }))
                throw new Error("Пользователь с указанным login не существует.");
        }),
    body("password")
        .isString()
        .withMessage("Пароль должен быть строкой.")
        .isLength({ min: 6 })
        .withMessage("Минимальная длинна пароля — 6 символов."),
    requestValidator
];

const authValidator = {
    signUp,
    signIn,
};

export default authValidator;
