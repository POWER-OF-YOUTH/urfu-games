import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

import { 
    DatabaseError, 
    LogicError, 
    UnexpectedError, 
    ValidationError,
    AccessError
} from "./utils/errors";
import sendResponse from "./utils/send-response";
import apiRouter from "./routes/api";

const app = express();

app.use(cors());
app.use(morgan("dev")); // Логгер запросов 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", apiRouter);

// Промежуточная функция, которая обрабатывает все виды ошибок,
// и в зависимости от их типа возвращает ответ с определенным статусом
app.use(<TError>(err: TError, req: Request, res: Response, next: NextFunction) => {
    const sendError = <T>(status: number, error: T) => {
        sendResponse(res, { errors: [ error ] }, status);
    };

    if (err instanceof ValidationError)
        sendError(422, err);
    else if (err instanceof LogicError)
        sendError(404, err);
    else if (err instanceof AccessError)
        sendError(403, err);
    else { // Internal error
        console.error(err);

        sendError(500, new UnexpectedError(req.originalUrl));
    }
});

export default app;
