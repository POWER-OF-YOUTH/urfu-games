import { Request, Response, NextFunction } from "express";
import expressJWT from "express-jwt";

import { AccessError } from "../utils/errors";
import { IUser, Role } from "../models/user";

type AuthOptions = {
    role: Role
};

function checkRole(role: Role): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: IUser = <IUser> req.user;

        if (user.role !== role) {
            res.status(403).json({ errors: [
                new AccessError(
                    req.originalUrl,
                    "У вас недостаточно прав для доступа к указанному ресурсу."
                )
            ]});
        }
        else
            next();
    };
}

function checkAuth(options: AuthOptions = { role: Role.User }) {
    return [
        expressJWT({ 
            secret: <string> process.env.JWT_SECRET, 
            algorithms: ["HS256"] 
        }),
        (err: any, req: Request, res: Response, next: NextFunction) => {
            if (err) {
                res.status(401).json({ errors: [
                    new AccessError(
                        req.originalUrl,
                        "Чтобы получить доступ к указанному ресурсу вам необходимо аутентифицироваться."
                    )
                ]});
            }
            else 
                next();
        },
        checkRole(options.role)
    ];
}

export default checkAuth;