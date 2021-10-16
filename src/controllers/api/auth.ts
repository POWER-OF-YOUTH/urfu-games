import { v4 as uuid } from "uuid";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Document } from "mongoose";
import { matchedData } from "express-validator";

import { IUser, User } from "../../models/user";
import { LogicError, DatabaseError, AccessError } from "../../utils/errors";
import { DTO } from "../../utils/dto/user";

type UserDocument = IUser & Document<any, any, IUser>;

type SignUpData = {
    login: string,
    email: string,
    password: string
};

type SignInData = {
    login: string,
    password: string
};

function encryptPassword(password: string, salt: string): string {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
}

// eslint-disable-next-line @typescript-eslint/ban-types
function generateToken(data: string | object | Buffer): string {
    return jwt.sign(
        data, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );
}

export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <SignUpData> matchedData(req, { locations: ["body"] });

        data.password = encryptPassword(data.password, <string> process.env.USER_PWD_SALT);

        const user: UserDocument = await User.create({ id: uuid(), ...data }); 
        
        res.json({ user: new DTO.User(user) });
    }
    catch (err) {
        next(err);
    }
}

export async function signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <SignUpData> matchedData(req, { locations: ["body"] });

        data.password = encryptPassword(data.password, <string> process.env.USER_PWD_SALT);

        const user: UserDocument = await User.findOne({ login: data.login });

        if (data.password !== user.password) 
        {
            res.status(401).json({ errors: [
                new AccessError(
                    req.originalUrl, 
                    "Указан неправильный пароль."
                )
            ]});
        }
        else {
            res.json({ 
                user: new DTO.User(user), 
                token: generateToken({ id: user.id, role: user.role }) 
            });
        }
    }
    catch (err) {
        next(err);
    }
}

export function signOut(req: Request, res: Response, next: NextFunction): void {
    res.clearCookie("token");
    res.json({});
}

export async function check(req: Request, res: Response, next: NextFunction) {
    try {
        const userData: any = req.user; // Чтобы TypeScript не выдавал ошибку

        if (!await User.exists({ id: userData.id })) {
            res.status(401).json({ errors: [
                new LogicError(
                    req.originalUrl, 
                    "Пользователь с указанным id не существует."
                )
            ]});
        }
        else {
            const user: UserDocument = await User.findOne({ id: userData.id });

            res.json({ user: new DTO.User(user) });
        }
    }
    catch (err) {
        next(err);
    }
}

