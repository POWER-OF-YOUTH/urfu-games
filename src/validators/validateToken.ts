import { Request, Response, NextFunction } from "express";
import expressJWT from "express-jwt";

import { AccessError } from "../utils/errors";

const validateToken = [
    expressJWT({ 
        secret: <string> process.env.JWT_SECRET, 
        algorithms: ["HS256"] 
    }),
    (err: any, req: Request, res: Response, next: NextFunction) => {
        if (!err)
            next();
        else {
            res.status(401).json({ errors: [
                new AccessError(
                    req.originalUrl,
                    "Чтобы получить доступ к указанному ресурсу вам необходимо аутентифицироваться."
                )
            ]});
        }
    }
];

export default validateToken;