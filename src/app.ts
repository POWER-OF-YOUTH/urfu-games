import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());;

// cors
// if (process.env.NODE_ENV === 'development') {
//     app.use(cors({
//         origin: `${process.env.CLIENT_URL}`,
//         credentials: true
//     }));
// }

app.use(cors());

// static files
app.use(express.static(path.join(__dirname, "/public")));

// routes

export default app;