import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import apiRouter from "./routes/api";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

// static files
app.use(express.static(process.env.PUBLIC_DIR || "/public"));

// routes
app.use("/api", apiRouter);

export default app;