import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { IUser, User } from '../../models/user';

type SignUpData = {
    login: string,
    email: string,
    password: string
};

type SignInData = {
    login: string,
    password: string
};

function encryptPassword(password: string, salt: string): string { // Функция для хеширования пароля.
    return crypto.createHmac('sha1', salt).update(password).digest('hex')
}

function generateToken(data: any): string {
    return jwt.sign(
        data, 
        <string> process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );
}

async function signUp(req: Request, res: Response) {
    try {
        const data: SignUpData = req.body;

        if (await User.exists({ email: data.email }))
            res.status(401).json({ message: "Пользователь с указанным email уже существует." });
        else if (await User.exists({ login: data.login }))
            res.status(401).json({ message: "Пользователь с указанным login уже существует." });
        else {
            data.password = encryptPassword(data.password, <string> process.env.USER_PWD_SALT); // Хешируем пароль

            const user: IUser = await User.create({ id: uuid(), ...data }); // Создаём объект пользователя в базе данных
            
            res.json({
                id: user.id,
                login: user.login,
                email: user.email,
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                avatar: user.avatar,
                registration_date: user.registration_date
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Ошибка базы данных." });
    }
}

async function signIn(req: Request, res: Response) {
    try {
        const data: SignInData = req.body;

        if (!await User.exists({ login: data.login }))
            res.status(401).json({ message: "Пользователь с указанным login не существует." });
        else {
            data.password = encryptPassword(data.password, <string> process.env.USER_PWD_SALT); // Хешируем пароль

            const user: IUser = <IUser> await User.findOne({ login: data.login });

            // Проверка того, что хеш переданного пароля соответсвует хешу из базы данных
            if (data.password != user.password) 
            {
                res.status(401).json({ message: "Указан неправильный пароль."});
                return;
            }

            const token: string = generateToken({ id: user.id, privilege: user.privilege });

            res.json({
                id: user.id,
                login: user.login,
                email: user.email,
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                avatar: user.avatar,
                registration_date: user.registration_date,
                token
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Ошибка базы данных." });
    }
}

function signOut(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({});
}

const authController = {
    signUp,
    signIn,
    signOut
};

export default authController;
