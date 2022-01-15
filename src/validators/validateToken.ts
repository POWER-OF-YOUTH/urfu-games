import { Request, Response, NextFunction } from "express";
import expressJWT, { UnauthorizedError } from "express-jwt";

import { AccessError } from "../utils/errors";

const validateToken = [
    expressJWT({ 
        secret: <string> process.env.JWT_SECRET, 
        algorithms: ["HS256"] 
    }),
    (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof UnauthorizedError) {
            next(new AccessError(
                req.originalUrl, 
                "Чтобы получить доступ к указанному ресурсу вам необходимо аутентифицироваться."
            ));
        }
        else
            next(err);
    }
];

export default validateToken;
