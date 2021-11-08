import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { Request, Response, NextFunction } from "express";

import { DatabaseError, UnexpectedError } from "./utils/errors";
import apiRouter from "./routes/api";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// static files
app.use("/public", express.static(
    path.join(process.cwd(), "/public"))
);

// routes
app.use("/api", apiRouter);

// errors handling
app.use((req: Request, res: Response, next: NextFunction) => {
    if (mongoose.connection.readyState !== 1) // 1 = connected
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl)]});
    else
        next();
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({ errors: [ new UnexpectedError(req.originalUrl)]});
});

export default app;
