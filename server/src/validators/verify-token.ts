/**
 * @file Промежуточные обработчики для проверки токена.
 */

import strings from "../config/strings.json";

import { Request, Response, NextFunction } from "express";
import expressJWT, { UnauthorizedError } from "express-jwt";

import { AccessError } from "../utils/errors";

/**
 * Промежуточные функции, которые расшифровывают JWT токен и
 * помещают данные из токена в `req.user`.
 */
const verifyToken = [
    expressJWT({ 
        secret: <string> process.env.JWT_SECRET, 
        algorithms: ["HS256"] 
    }),
    (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof UnauthorizedError) {
            res.set("WWW-Authenticate", "Bearer");

            return next(new AccessError(strings.errors.access.notAuthorized));
        }
        next(err);
    }
];

export default verifyToken;