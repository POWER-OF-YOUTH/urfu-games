/**
 * @file Вспомогательная функция для валидации запросов.
 */

import { Request, Response, NextFunction } from "express";
import { Result, validationResult } from "express-validator";

import { ValidationError } from "../utils/errors";

/**
 * `validateRequest` создаёт промежуточную функцию, которая,
 * используя массив валидаторов `validators`, проверяет объект `req`.
 * @attention Если в процессе валидации возникли ошибки, то первая
 * из них передаётся обработчику ошибок.
 * @example
 * app.get("/auth/signin",
 *     validateRequest(
 *         body("login")
 *             .isString()
 *             .trim()
 *             .notEmpty(),
 *         body("password")
 *             .isString()
 *             .matches("[0-9a-zA-Z_\\-@#%., ]+")
 *             .isLength({ min: 6 })
 *     ),
 *     // request handlers...
 * );
 */
function validateRequest(...validators: Array<any>) {
    return [
        ...validators,
        (req: Request, res: Response, next: NextFunction) => {
            const validationErrors: Result = validationResult.withDefaults({
                formatter: err => {
                    return new ValidationError(
                        err.param,
                        <string> err.location,
                        err.msg
                    );
                }
            })(req);

            if (!validationErrors.isEmpty())
                return next(validationErrors.array()[0]);
            next();
        }
    ]
}

export default validateRequest;
