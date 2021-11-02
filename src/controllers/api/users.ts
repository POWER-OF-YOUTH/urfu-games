import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";
import { matchedData } from "express-validator";

import { AccessError } from "../../utils/errors";
import { User, IUser } from "../../models/user";
import { DTO } from "../../utils/dto/user";

type UserDocument = IUser & Document<any, any, IUser>;

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await User.find();

        res.json(users.map(u => new DTO.User(u)));
    }
    catch (err) {
        next(err);
    }
}

type GetUserData = {
    id: string
};

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <GetUserData> matchedData(req, { locations: [ "params" ]});
        const user: UserDocument = await User.findOne({ id: data.id });

        res.json(new DTO.User(user));
    }
    catch (err) {
        next(err);
    }
}

type UpdateUserData = {
    id: string,
    name: string | undefined,
    surname: string | undefined,
    patronymic: string | undefined,
    email: string | undefined
} 

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <UpdateUserData> matchedData(req, { locations: [ "params", "body" ]});
        const reqUser: any = req.user;
        const user: UserDocument = await User.findOne({ id: data.id });

        if (user.id !== reqUser.id)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            user.set(data);

            await user.save();

            res.json(new DTO.User(user));
        }
    }
    catch (err) {
        next(err);
    }
}
