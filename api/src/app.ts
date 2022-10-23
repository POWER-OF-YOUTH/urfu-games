/**
 * @file Создание приложения и подключение промежуточных обработчиков.
 */

import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

import {
    AccessError,
    LogicError,
    UnexpectedError,
    ValidationError
} from "./utils/errors";
import {
    ValidationError as SequelizeValidationError,
    EmptyResultError as SequelizeEmptyResultError
} from "sequelize";
import mainRouter from "./routes";

/** Главное приложение. */
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")); // Логгер запросов.
}

app.use("/", mainRouter);

/**
 * Промежуточная функция, которая обрабатывает все виды ошибок,
 * и в зависимости от их типа возвращает ответ с определенным статусом.
 */
app.use(<TError>(err: TError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SequelizeValidationError) {
        res.status(422).json({
            errors: [
                {
                    detail: err.errors[0].message,
                    instance: req.originalUrl,
                    location: "",
                    param: err.errors[0].path,
                    type: "validation"
                }
            ]
        });
    }
    else if (err instanceof SequelizeEmptyResultError) {
        res.status(404).json({
            errors: [
                {
                    detail: "Ресурс не найден.",
                    instance: req.originalUrl,
                    type: "logic"
                }
            ]
        });
    }
    else if (err instanceof ValidationError) {
        res.status(err.status).json({
            errors: [{
                detail: err.detail,
                instance: req.originalUrl,
                location: err.location,
                param: err.param,
                type: "validation"
            }]
        });
    }
    else if (err instanceof LogicError)
        res.status(err.status).json({
            errors: [
                {
                    detail: err.detail,
                    instance: req.originalUrl,
                    type: "logic"
                }
            ]
        });
    else if (err instanceof AccessError)
        res.status(err.status).json({
            errors: [
                {
                    detail: err.detail,
                    instance: req.originalUrl,
                    type: "access"
                }
            ]
        });
    else {
        console.error(err);

        res.status(500).json({
            errors: [
                {
                    detail: "Непредвиденная ошибка.",
                    instance: req.originalUrl,
                    type: "unexpected"
                }
            ]
        });
    }
});
/** Обработчик, который вызывается, если в запросе указан неопределенный путь. */
app.use((req: Request, res: Response) => {
    res.status(404).json({ errors: [{
        ...new AccessError("Указанный путь не найден."),
        instance: req.originalUrl,
        type: "access"
    }]});
})

export default app;
