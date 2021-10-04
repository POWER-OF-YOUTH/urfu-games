import { v4 as uuid } from "uuid";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { IUser, User } from "../../models/user";
import { LogicError, DatabaseError, AccessError } from "../../utils/errors";
import { Document } from "mongoose";
import { matchedData } from "express-validator";

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

async function signUp(req: Request, res: Response): Promise<void> {
    try {
        const data = <SignInData> matchedData(req, { locations: ["body"] });

        data.password = encryptPassword(data.password, <string> process.env.USER_PWD_SALT);

        const user: UserDocument = await User.create({ id: uuid(), ...data }); 
        
        res.json({
            user: {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                avatar: user.avatar,
                registration_date: user.registration_date
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

async function signIn(req: Request, res: Response): Promise<void> {
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
            return;
        }

        const token: string = generateToken({ id: user.id, role: user.role });

        res.json({
            user: {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                avatar: user.avatar,
                registration_date: user.registration_date,
            },
            token
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

function signOut(req: Request, res: Response): void {
    res.clearCookie("token");
    res.json({});
}

async function check(req: Request, res: Response) {
    try {
        const userData: any = req.user; // Чтобы TypeScript не выдавал ошибку

        if (!await User.exists({ id: userData.id })) {
            res.status(401).json({ errors: [
                new LogicError(
                    req.originalUrl, 
                    "Пользователь с указанным id не существует."
                )
            ]});
            return;
        }

        const user: UserDocument = await User.findOne({ id: userData.id });

        res.json({ 
                user: {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                avatar: user.avatar,
                registration_date: user.registration_date,
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

const authController = {
    signUp,
    signIn,
    signOut,
    check
};

export default authController;
