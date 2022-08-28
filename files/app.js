import express from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";

import * as globals from "./globals.js";

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, globals.UPLOADING_DIR),
    filename: (req, file, cb) => {
        req.locals = { filename: `${uuid()}-${file.originalname}` }
        cb(null, req.locals.filename)
    }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));

app.post("/upload/",
    upload.single("file"),
    (req, res) => {
        res.send(`${globals.FILES_URI}/${req.locals.filename}`);
    }
);

app.use((req, res) => res.send("But nobody came."));

export default app;
