import strings from "../../config/api/strings.json";

import { Request, Response, NextFunction } from "express";
import expressJWT, { UnauthorizedError } from "express-jwt";

import { AccessError } from "../utils/errors";

/*
 * Промежуточная функция, которая расшифровывает JWT токен
 * и помещает результат в req.user. Если токен не был передан
 * — передаёт AccessError обработчику ошибок.
 */
const verifyToken = [
    expressJWT({ 
        secret: <string> process.env.JWT_SECRET, 
        algorithms: ["HS256"] 
    }),
    (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof UnauthorizedError) {
            res.set("WWW-Authenticate", "Bearer");

            next(new AccessError(
                req.originalUrl, 
                strings.errors.access.notAuthorized
            ));
        }
        else
            next(err);
    }
];

export default verifyToken;
