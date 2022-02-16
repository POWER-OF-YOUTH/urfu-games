import strings from "../config/api/strings.json";

import { Request, Response, NextFunction } from "express";
import expressJWT, { UnauthorizedError } from "express-jwt";
import { asyncMiddleware } from "middleware-async";

import { User } from "../domain/models/user";
import { AccessError } from "../utils/errors";

/*
 * Промежуточные функции, которые расшифровывают JWT токен,
 * помещают данные из токена в req.user и проверяют существование пользователя по id. 
 */
const verifyToken = [
    expressJWT({ 
        secret: <string> process.env.JWT_SECRET, 
        algorithms: ["HS256"] 
    }),
    (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof UnauthorizedError) {
            res.set("WWW-Authenticate", "Bearer");

            return next(new AccessError(
                req.originalUrl, 
                strings.errors.access.notAuthorized
            ));
        }

        next(err);
    },
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (!await User.exists({ id: req.user.id })) {
            return next(new AccessError(
                req.originalUrl, 
                strings.errors.access.notAuthorized
            ));
        }

        next();
    })
];

export default verifyToken;
