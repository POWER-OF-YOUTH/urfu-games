import { Request, Response, NextFunction } from "express";

import { AccessError } from "../utils/errors";
import { Role } from "../models/user";

function validateRole(...roles: Array<Role>): (req: Request, res: Response, next: NextFunction) => void {
    if (roles.length === 0) 
        throw new Error("Roles is undefined.");

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user)
            throw new Error("User is undefined.");

        const userData: any = req.user; // Чтобы TypeScript не выдавал ошибку
        
        if (roles.includes(userData.role))
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

export default validateRole;
