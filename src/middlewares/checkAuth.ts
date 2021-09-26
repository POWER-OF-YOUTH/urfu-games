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

        if (user.role & role)
            next();
        else {
            res.status(403).json({ errors: [
                new AccessError(
                    req.originalUrl,
                    "У вас недостаточно прав для доступа к указанному ресурсу."
                )
            ]});
        }
    };
}

function checkAuth(options: AuthOptions = { role: Role.User | Role.Admin }) {
    return [
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
        },
        checkRole(options.role)
    ];
}

export default checkAuth;