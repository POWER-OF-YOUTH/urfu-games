/**
 * @file Создание приложения и подключение промежуточных обработчиков.
 */

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import { 
    LogicError, 
    UnexpectedError, 
    ValidationError,
    AccessError
} from "./utils/errors";
import { ValidationError as SequelizeValidationError } from "sequelize";
import mainRouter from "./routes";

/** Главное приложение. */
const app = express();

app.use(cors());
app.use(morgan("dev")); // Логгер запросов 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRouter);

/** 
 * Промежуточная функция, которая обрабатывает все виды ошибок,
 * и в зависимости от их типа возвращает ответ с определенным статусом.
 */
app.use(<TError>(err: TError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SequelizeValidationError)
        res.status(422).json({ errors: [{ 
            ...new ValidationError(err.errors[0].path, "", err.errors[0].message),
            instance: req.originalUrl,
            type: "validation" 
        }]});
    else if (err instanceof ValidationError)
        res.status(422).json({ errors: [{
            ...err,
            instance: req.originalUrl,
            type: "validation"
        }]})
    else if (err instanceof LogicError)
        res.status(404).json({ errors: [{ ...err, instance: req.originalUrl, type: "logic" }]});
    else if (err instanceof AccessError)
        res.status(403).json({ errors: [{ ...err, instance: req.originalUrl, type: "access" }]});
    else {
        console.error(err);

        res.status(500).json({ 
            errors: [{ ...new UnexpectedError(), instance: req.originalUrl, type: "access"}]
        });
    }
});

export default app;
