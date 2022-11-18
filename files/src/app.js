import express from "express";
import multer from "multer";
import cors from "cors";
import morgan from "morgan";
import { v4 as uuid } from "uuid";

import * as globals from "./globals.js";

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, globals.FILES_UPLOADING_DIR),
    filename: (req, file, cb) => {
        req.locals = { filename: `${uuid()}-${file.originalname}` }
        cb(null, req.locals.filename)
    }
});
const upload = multer({ storage });

if (process.env.NODE_ENV == "development") {
    app.use(cors())
}
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")); // Логгер запросов.
}

app.post("/upload/",
    upload.single("file"),
    (req, res) => {
        res.send(`${globals.FILES_URI}/files/${req.locals.filename}`);
    }
);
app.get("/files/:filename",
    (req, res) => {
        res.sendFile(`${globals.FILES_UPLOADING_DIR}/${req.params.filename}`);
    }
);

app.use((err, req, res, next) => res.send("Internal error."));

app.use((req, res) => res.send("But nobody came."));

export default app;
