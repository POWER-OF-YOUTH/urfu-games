import { body } from 'express-validator';

import requestValidator from '../request_validator';

const signUp = [
    body("login")
        .isString()
        .withMessage("Логин должен быть строкой.")
        .notEmpty()
        .withMessage("Логин не должен быть пустым"),
    body("email")
        .isEmail()
        .withMessage("Email недействителен.")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("Пароль должен быть строкой.")
        .matches("/[0-9a-zA-Z_\-@#%., ]+/g")
        .withMessage("Пароль не соответствует указанному шаблону: /[0-9a-zA-Z_\-@#%., ]+/g")
        .isLength({ min: 6 })
        .withMessage("Минимальная длинна пароля — 6 символов."),
    requestValidator
];

const signIn = [
    body("login")
        .isString()
        .withMessage("Логин должен быть строкой.")
        .notEmpty()
        .withMessage("Логин не должен быть пустым"),
    body("password")
        .isString()
        .withMessage("Пароль должен быть строкой.")
        .isLength({ min: 6 })
        .withMessage("Минимальная длинна пароля — 6 символов."),
    requestValidator
];

const authValidator = {
    signUp,
    signIn
};

export default authValidator;